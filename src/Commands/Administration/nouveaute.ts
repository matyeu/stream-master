import { SmClient } from "../../Librairie";
import { ActionRowBuilder, CommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export default async function (client: SmClient, interaction: CommandInteraction) {

    const modalReasearch: any = new ModalBuilder()
        .setCustomId('new-modal')
        .setTitle("Menu d'ajout");

    const titleName = new TextInputBuilder()
        .setCustomId('titleNew')
        .setLabel("Titre")
        .setPlaceholder('🍿 - Entrer le titre de votre ajout')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const categoryNew = new TextInputBuilder()
        .setCustomId('categoryNew')
        .setLabel("Catégorie")
        .setPlaceholder('✏️ - Entrer la catégorie de votre ajout (anime, serie, film, premium)')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);


    const pictureNew = new TextInputBuilder()
        .setCustomId('pictureNew')
        .setLabel("Image")
        .setPlaceholder("🌆 - Entrer l'url de votre image")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);


    const titleRow = new ActionRowBuilder().addComponents(titleName);
    const categoryRow = new ActionRowBuilder().addComponents(categoryNew);
    const pictureRow = new ActionRowBuilder().addComponents(pictureNew);

    modalReasearch.addComponents(titleRow, categoryRow, pictureRow);

    await interaction.showModal(modalReasearch);
}

export const slash = {
    data: {
        name: __filename.slice(__dirname.length + 1, __filename.length - 3),
        description: "Permet d'indiquer les nouveaux ajouts",
        category: "Administration",
        permissions: ["Administrator"],
    }
}