import { AcClient } from "../../Librairie";
import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { find } from "../../Models/server";
import { EMBED_ERROR, FOOTER } from "../../config";

export default async function (client: AcClient, interaction: ModalSubmitInteraction) {

    const serverConfig: any = await find(interaction.guild!.id);
    const member = await interaction.guild!.members.fetch(interaction.user.id);

    const titleName = interaction.fields.getTextInputValue('titleName');
    const descriptionBug = interaction.fields.getTextInputValue('descriptionBug');

    const embed = new EmbedBuilder()
        .setColor(EMBED_ERROR)
        .setAuthor({ name: `${member.displayName} (${member.id})`, iconURL: member.displayAvatarURL({ extension: "png" }) })
        .setTitle('🔧 - Report Tool')
        .addFields(
            {
                name: "Titre concerné",
                value: `\`${titleName}\``
            },
            {
                name: "Problème rencontré",
                value: `\`${descriptionBug}\``
            }
        )
        .setFooter({ text: FOOTER, iconURL: client.user!.displayAvatarURL({ extension: "png" }) })
        .setTimestamp();


    await client.getChannel(interaction.guild!, serverConfig.channels.report, { embeds: [embed] });
    return interaction.replySuccessMessage(client, `**Problème signalé auprès du staff de ${interaction.guild!.name}**`, true);

}

export const modal = {
    data: {
        name: __filename.slice(__dirname.length + 1, __filename.length - 3)
    }
}