import { AcClient } from "../../Librairie";
import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { EMBED_SUCCESS, FOOTER } from "../../config";
import { find } from "../../Models/server";

export default async function (client: AcClient, interaction: ModalSubmitInteraction) {

    const serverConfig: any = await find(interaction.guild!.id);

    const titleNew = interaction.fields.getTextInputValue('titleNew');
    const categoryNew = interaction.fields.getTextInputValue('categoryNew');
    const pictureNew = interaction.fields.getTextInputValue('pictureNew');

    if (!pictureNew.includes('http')) return interaction.replyErrorMessage(client, "**Veuillez ajouter un lien valide**", true);

    const embed = new EmbedBuilder()
        .setColor(EMBED_SUCCESS)
        .setTitle('🍿 ・ Nouveauté !')
        .setDescription(`> :ribbon: ・${interaction.user} à ajouté a la liste :
> **${titleNew}** | De catégorie : **${categoryNew}**
> Retrouvez ceci dans le salon <#${serverConfig.channels.research}>`)
        .setImage(pictureNew)
        .setFooter({ text: FOOTER, iconURL: client.user!.displayAvatarURL({ extension: "png" }) })
        .setTimestamp();

    await client.getChannel(interaction.guild!, serverConfig.channels.new, { embeds: [embed] });
    return interaction.replySuccessMessage(client, `**Embed bien envoyé dans le salon <#${serverConfig.channels.new}>**`, true);

}

export const modal = {
    data: {
        name: __filename.slice(__dirname.length + 1, __filename.length - 3)
    }
}