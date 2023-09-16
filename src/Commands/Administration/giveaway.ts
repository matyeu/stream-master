import {SmClient} from "../../Librairie";
import {
    CommandInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    Message,
    ButtonStyle,
    ApplicationCommandOptionType
} from "discord.js";
import {EMBED_GENERAL, FOOTER} from "../../config";
import {create, find, edit} from "../../Models/giveaway";

const ms = require("ms");

export default async function (client: SmClient, interaction: CommandInteraction) {

    //@ts-ignore
    switch (interaction.options.getSubcommand(false)) {
        case "start":

            const price = interaction.options.get("prix", true).value as string;
            const description = interaction.options.get("description", false)!;
            const winner = interaction.options.get("gagnant", true).value as number;
            const idChannel = interaction.options.get("channel", true).value as any;
            const channel = interaction.guild!.channels.cache.find(channel => channel.id === idChannel)!;

            const timeOption = interaction.options.get('temps', true).value as string;
            const time = ms(timeOption);
            const date = (Date.now() + time) / 1000;
            const timeStamp = date.toString().split('.')[0];


            if (channel.type !== 0 && channel.type !== 5)
                return interaction.replyErrorMessage(client, "**Vous devez** mentionner un **salon textuel**.", true);

            const embedGiveaway = new EmbedBuilder()
                .setColor("#5766F2")
                .setTitle(price)
                .setDescription(description ? `${description.value}\n\nParticipant(s) : **0**;\nGagnant(s) : **${winner}**;\nDurée : <t:${timeStamp}:R> (<t:${timeStamp}:f>)`
                    : `Participant(s) : **0**;\nGagnant(s) : **${winner}**;\nDurée : <t:${timeStamp}:R> (<t:${timeStamp}:f>)`)
                .setTimestamp()
                .setFooter({text: FOOTER, iconURL: client.user?.displayAvatarURL()});


            await channel.send({embeds: [embedGiveaway]})
                .then(async (message: Message) => {

                    let button = new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`giveaway-button:${message.id}`)
                                .setEmoji("🎉")
                                .setStyle(ButtonStyle.Primary));

                    await message.edit({components: [button]});
                    await create(interaction.guild!.id, message.id, price, description ? `${description.value}` : "", winner, timeStamp);

                    setTimeout(async () => {

                        const configGiveaway: any = await find(interaction.guild!.id, message.id);
                        let randomUser = Math.floor(Math.random() * configGiveaway.users.length);

                        const usersWinner = [];
                        for (let i = 0; i < winner; i++) {
                            usersWinner.push(configGiveaway.users[randomUser]);

                            let userDel = configGiveaway.users.indexOf(configGiveaway.users[randomUser]);
                            await configGiveaway.users.splice(userDel, 1);
                            await edit(interaction.guild!.id, message.id, configGiveaway);

                            randomUser = Math.floor(Math.random() * configGiveaway.users.length);
                        }

                        const embedGiveawayEnd = new EmbedBuilder()
                            .setColor(EMBED_GENERAL)
                            .setTitle(price)
                            .setTimestamp()
                            .setFooter({text: FOOTER, iconURL: client.user?.displayAvatarURL()});

                        const buttonDisabled = new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`giveaway_button`)
                                    .setEmoji("🎉")
                                    .setDisabled(true)
                                    .setStyle(ButtonStyle.Secondary));



                        if (winner < configGiveaway.participant) {

                            const userWin = `<@${usersWinner.join(">, <@")}>`;

                            embedGiveawayEnd.setDescription(description ?  `${description.value}\n\nParticipant(s) : **${configGiveaway.participant}**;\nGagnant(s) : **${userWin}**;\nDurée : <t:${timeStamp}:R> (<t:${timeStamp}:f>)` :
                                `Participant(s) : **${configGiveaway.participant}**;\nGagnant(s) : **${userWin}**;\nDurée : <t:${timeStamp}:R> (<t:${timeStamp}:f>)`)

                            await message.edit({embeds: [embedGiveawayEnd], components: [buttonDisabled]});


                            let embedCongratulation = new EmbedBuilder()
                                .setColor(EMBED_GENERAL)
                                .setDescription( `Félicitations ${userWin} !\nVous venez de gagner un(e) **${price}** !`)
                                .setTimestamp()
                                .setFooter({text: FOOTER, iconURL: client.user?.displayAvatarURL()});

                            return client.getChannel(message.guild!, channel.id, {embeds: [embedCongratulation]});
                        } else {

                            embedGiveawayEnd.setDescription(description ?  `${description.value}\n\nParticipant(s) : **${configGiveaway.participant}**;\nGagnant(s) : \`Pas asser de participant\`;\nDurée : <t:${timeStamp}:R> (<t:${timeStamp}:f>)` :
                                `Participant(s) : **${configGiveaway.participant}**;\nGagnant(s) : \`Pas asser de participant\`;\nDurée : <t:${timeStamp}:R> (<t:${timeStamp}:f>)`)

                            await message.edit({embeds: [embedGiveawayEnd], components: [buttonDisabled]});

                            embedGiveawayEnd.setDescription(`Il n'y a **pas eu assez** de participants pour ce giveaway !`);
                            return client.getChannel(message.guild!, channel.id, {embeds: [embedGiveawayEnd]});
                        }

                    }, time);
                });
            return interaction.replySuccessMessage(client, "Le giveaway a **été créé** avec succès !", true);

            break;
        case "reroll":
            const giveaway = interaction.options.get("giveaway_id", true).value as string;
            const winnerReroll = interaction.options.get("gagnant", false)! as any;

            const configGiveaway: any = await find(interaction.guild!.id, giveaway);
            if (!configGiveaway)
                return interaction.replyErrorMessage(client, "Le giveaway indiqué est **introuvable** ou **n'existe pas**.", true);

            if (winnerReroll ? winnerReroll.value : 1 > configGiveaway.users.length)
                return interaction.replyErrorMessage(
                    client, "Il n'y a **pas eu assez** de participants pour ce reroll !", true);

            let randomUser = Math.floor(Math.random() * configGiveaway.users.length);

            let usersWinner = [];
            for (let i = 0; i < winnerReroll; i++) {
                usersWinner.push(configGiveaway.users[randomUser]);

                const userDel = configGiveaway.users.indexOf(configGiveaway.users[randomUser]);
                await configGiveaway.users.splice(userDel, 1);
                await edit(interaction.guild!.id, configGiveaway.id_giveaway, configGiveaway);

                randomUser = Math.floor(Math.random() * configGiveaway.users.length);
            }

            const userWin = `<@${usersWinner.join(">, <@")}>`;
            interaction.channel!.send(userWin).then((msg) => {
                msg.delete();
            });

            const embedGiveawayReroll = new EmbedBuilder()
                .setColor(EMBED_GENERAL)
                .setDescription(`${interaction.user} vient de reroll le giveaway !\nFélicitations ${userWin} !`)
                .setTimestamp()
                .setFooter({text: FOOTER, iconURL: client.user?.displayAvatarURL()});

            return interaction.reply({embeds: [embedGiveawayReroll]});
            break;
    }
};

export const slash = {
    data: {
        name: __filename.slice(__dirname.length + 1, __filename.length - 3),
        description: "Permet de lancer un giveaway.",
        category: "Administration",
        permissions: ["Administrator"],
        options: [
            {
                name: "start",
                description: "Permet de lancer un giveaway.",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "channel",
                        description: "Salon où sera lancé le giveaway.",
                        type: ApplicationCommandOptionType.Channel,
                        required: true,
                    },
                    {
                        name: "prix",
                        description: "Prix du giveaway.",
                        type: ApplicationCommandOptionType.String,
                        required: true,
                    },
                    {
                        name: "gagnant",
                        description: "Nombre de gagnant.",
                        type: ApplicationCommandOptionType.Number,
                        required: true,
                    },
                    {
                        name: "temps",
                        description: "Temps avant la fin du giveaway.",
                        type: ApplicationCommandOptionType.String,
                        required: true,
                    },
                    {
                        name: "description",
                        description: "Description du giveaway.",
                        type: ApplicationCommandOptionType.String,
                        required: false,
                    }
                ]
            },
            {
                name: "reroll",
                description: "Permet de relancer un giveaway.",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "giveaway_id",
                        description: "Message du giveaway.",
                        type: ApplicationCommandOptionType.String,
                        required: true,
                    },
                    {
                        name: "gagnant",
                        description: "Nombre de gagnant.",
                        type: ApplicationCommandOptionType.Number,
                        required: false,
                    }
                ]
            }
        ],
    }
}