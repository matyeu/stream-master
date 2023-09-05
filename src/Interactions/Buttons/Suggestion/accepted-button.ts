import { ButtonInteraction, EmbedBuilder } from "discord.js";
import { AcClient } from "../../../Librairie";
import { EMBED_SUCCESS, EMOJIS, FOOTER } from "../../../config";

export default async function (client: AcClient, interaction: ButtonInteraction) {

    const member = await interaction.guild!.members.fetch(interaction.user.id);

    if (!member.permissions.has(["ManageMessages"]))
        return interaction.replyErrorMessage(client, "**Vous n'avez pas l'habilitation d'utiliser cet interaction !**", true);

    const embedMessage = interaction.message.embeds[0];

    const embed = new EmbedBuilder()
        .setColor(EMBED_SUCCESS)
        .setAuthor({name: `${embedMessage.author?.name}`, iconURL: `${embedMessage.author?.iconURL}`})
        .setTitle(`${client.getEmoji(EMOJIS.succes)} Suggestion Acceptée`)
        .setDescription(`Votre suggestion a été traitée par **${member.displayName}**`)
        .setFooter({ text: FOOTER, iconURL: client.user!.displayAvatarURL({ extension: "png" }) })
        .setTimestamp()
        
        for (const field of embedMessage.fields) {
            embed.addFields({name: field.name, value: `\`${field.value}\``, inline: field.inline}
            )
        }

    return interaction.update({ embeds: [embed], components: [] });

}

export const button = {
    data: {
        name: __filename.slice(__dirname.length + 1, __filename.length - 3)
    }
}