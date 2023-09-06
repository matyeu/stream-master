import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { AcClient } from "../../Librairie";

export default async function (client: AcClient, interaction: ButtonInteraction) {

    const modalReasearch: any = new ModalBuilder()
        .setCustomId('bug-modal')
        .setTitle("Menu de Report");

    const titleName = new TextInputBuilder()
        .setCustomId('titleName')
        .setLabel("Titre")
        .setPlaceholder('🍿 - Veuillez mettre le titre')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const descriptionBug = new TextInputBuilder()
        .setCustomId('descriptionBug')
        .setLabel("Description")
        .setPlaceholder('🔧 - Indiquer le problème rencontré sur ce titre')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);



    const titleRow = new ActionRowBuilder().addComponents(titleName);
    const descriptionRow = new ActionRowBuilder().addComponents(descriptionBug);

    modalReasearch.addComponents(titleRow, descriptionRow);

    await interaction.showModal(modalReasearch);
}

export const button = {
    data: {
        name: __filename.slice(__dirname.length + 1, __filename.length - 3)
    }
}