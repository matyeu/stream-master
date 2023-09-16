import {SmClient} from "../../Librairie";
import {ButtonInteraction, EmbedBuilder} from "discord.js";
import {find, edit} from "../../Models/giveaway";
import {find as findMembers} from "../../Models/member";
import {FOOTER} from "../../config";

export default async function (client: SmClient, interaction: ButtonInteraction) {

    const configGiveaway: any = await find(interaction.guild!.id, interaction.customId.split(':')[1]);
    const configMembers: any = await findMembers(interaction.guild!.id, interaction.user.id);
    const users = configGiveaway.users;

    if (users.indexOf(interaction.user.id) !== -1)
        return interaction.replyErrorMessage(client, "Vous participez **déjà** à ce giveaway.", true);

    for (let luck = 0; luck < configMembers.luckGiveaway; luck++) {
        users.push(interaction.user.id);
    }

    configGiveaway.participant++;
    await edit(interaction.guild!.id, interaction.customId.split(':')[1], configGiveaway);

    const embedGiveaway = new EmbedBuilder()
        .setColor("#5766F2")
        .setTitle(configGiveaway.price)
        .setDescription(configGiveaway.description ? `${configGiveaway.description}\n\nParticipant(s) : **${configGiveaway.users.length}**;\nGagnant(s) : **${configGiveaway.winner}**;\nDurée : <t:${configGiveaway.time}:R> (<t:${configGiveaway.time}:f>)`:
        `Participant(s) : **${configGiveaway.users.length}**;\nGagnant(s) : **${configGiveaway.winner}**;\nDurée : <t:${configGiveaway.time}:R> (<t:${configGiveaway.time}:f>)`)
        .setTimestamp()
        .setFooter({text: FOOTER, iconURL: client.user?.displayAvatarURL()});

    return interaction.update({embeds: [embedGiveaway]});


};

export const button = {
    data: {
        name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    }
}