import { AcClient } from "../../Librairie";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ModalSubmitInteraction} from "discord.js";
import { find } from "../../Models/server";
import { EMBED_GENERAL, FOOTER } from "../../config";

export default async function (client: AcClient, interaction: ModalSubmitInteraction) {

    const serverConfig: any = await find(interaction.guild!.id);

    const suggestionName = interaction.fields.getTextInputValue('suggestionName');
    const genreInput = interaction.fields.getTextInputValue('genreInput');
    const dateInput = interaction.fields.getTextInputValue('dateInput');

    const member = await interaction.guild!.members.fetch(interaction.user.id);

    const embed = new EmbedBuilder()
    .setColor(EMBED_GENERAL)
    .setAuthor({name: `${member.displayName} (${member.id})`, iconURL: member.displayAvatarURL({extension: "png"})})
    .setTitle('Nouvelle Suggestion !')
    .addFields(
        {
            name: "Titre",
            value: `\`${suggestionName}\``,
            inline: true
        },
        {
            name: "Date de parution",
            value: `\`${dateInput}\``,
            inline: true
        },
        {
            name: "Genre",
            value: `\`${genreInput}\``,
            inline: false
        }
    )
    .setFooter({ text: FOOTER, iconURL: client.user!.displayAvatarURL({ extension: "png" }) })
    .setTimestamp();

    const buttons = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
        new ButtonBuilder()
            .setCustomId("accepted-button")
            .setLabel("Acceptée")
            .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId("refused-button")
            .setLabel("Refusée")
            .setStyle(ButtonStyle.Danger)
    );

    await client.getChannel(interaction.guild!, serverConfig.channels.suggestion, {embeds: [embed], components: [buttons]});
    return interaction.replySuccessMessage(client, `**Votre suggestion c'est bien envoyée dans le salon <#${serverConfig.channels.suggestion}>**`, true);

}

export const modal = {
    data: {
        name: __filename.slice(__dirname.length + 1, __filename.length - 3)
    }
}