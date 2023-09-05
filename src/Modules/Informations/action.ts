import { ButtonInteraction, EmbedBuilder, TextInputBuilder, TextInputStyle, ModalBuilder, ActionRowBuilder, ModalSubmitInteraction } from "discord.js";
import { AcClient } from "../../Librairie";
import { EMBED_GENERAL, FOOTER } from "../../config";
import { find } from "../../Models/server";

const Logger = require("../../Librairie/logger");

export async function buttonsCatalog(client: AcClient, interaction: ButtonInteraction) {

    Logger.button(`The ${interaction.customId} button was used by ${interaction.user?.tag} on the ${interaction.guild?.name} server.`);

    if (interaction.customId !== "anime" && interaction.customId !== "film" && interaction.customId !== "serie" && interaction.customId !== "premium") {
        await Logger.error(`Un bouton utlisé par ${interaction.user.username} - ${interaction.user.id} n'a pas été trouver par le client -> "${interaction.customId}"`)
        return interaction.replyErrorMessage(client, `**Le button choisi n'a pas été trouver par le client**`, true);
    };

    const emojis = {
        anime: "🏯",
        film: "📽️",
        serie: "🎬",
        premium: "✨"
    }

    const embed = new EmbedBuilder()
        .setColor(EMBED_GENERAL)
        .setTitle(`${emojis[interaction.customId]} Catalogue des ${interaction.customId}s`)
        .setFooter({ text: FOOTER, iconURL: client.user!.displayAvatarURL({ extension: "png" }) })
        .setTimestamp();

    const json = require(`../../../Jsons/${interaction.customId}s.json`);
    let i = 0;

    json.map((e: any) => { for (const _ in e.saisons) { i++ } });

    if (i > 0) {
        embed.setDescription(json.map((e: { name: string }) => `- **${e.name}**`).join('\n'))
    } else {
        embed.setDescription(`\`Actuellement, aucun ${interaction.customId} n'a été ajouté\``)
    }

    return interaction.reply({ embeds: [embed], ephemeral: true });

}

export async function buttonsReasearch(client: AcClient, interaction: ButtonInteraction) {

    Logger.button(`The ${interaction.customId} button was used by ${interaction.user?.tag} on the ${interaction.guild?.name} server.`);

    const serverConfig: any = await find(interaction.guild!.id);

    if (interaction.customId !== "research" && interaction.customId !== "suggestion" && interaction.customId !== "premium") {
        await Logger.error(`Un bouton utlisé par ${interaction.user.username} - ${interaction.user.id} n'a pas été trouver par le client -> "${interaction.customId}"`)
        return interaction.replyErrorMessage(client, `**Le button choisi n'a pas été trouver par le client**`, true);
    };

    switch (interaction.customId) {
        case 'research':
            const modalReasearch: any = new ModalBuilder()
			.setCustomId('resarch-modal')
			.setTitle('Menu de Recherche');

            const researchName = new TextInputBuilder()
			.setCustomId('researchName')
			.setLabel("Titre")
            .setPlaceholder('🍿 - Entrer le titre de votre anime, série, film ou premium')
			.setStyle(TextInputStyle.Short)
            .setRequired(true);


            const researchRow = new ActionRowBuilder().addComponents(researchName);

            modalReasearch.addComponents(researchRow);

            await interaction.showModal(modalReasearch);

            break;
        case 'suggestion': 

        const modalSuggestion: any = new ModalBuilder()
			.setCustomId('suggestion-modal')
			.setTitle('Menu de Suggestion');

            const suggestionName = new TextInputBuilder()
			.setCustomId('suggestionName')
			.setLabel("Titre")
            .setPlaceholder('🍿 - Entrer le titre de votre anime, série, film ou premium')
			.setStyle(TextInputStyle.Short)
            .setRequired(true);

            const genreInput = new TextInputBuilder()
			.setCustomId('genreInput')
			.setLabel("Genre")
            .setPlaceholder('✏️ - Entrer le genre de votre anime, série, film ou premium')
			.setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

            const dateInput = new TextInputBuilder()
			.setCustomId('dateInput')
			.setLabel("Date")
            .setPlaceholder('🗓️ - Date de parution')
			.setStyle(TextInputStyle.Short)
            .setRequired(true);

            const suggestionRow = new ActionRowBuilder().addComponents(suggestionName);
            const genreRow = new ActionRowBuilder().addComponents(genreInput);
            const dateRow = new ActionRowBuilder().addComponents(dateInput);

            modalSuggestion.addComponents(suggestionRow, genreRow, dateRow);

            await interaction.showModal(modalSuggestion);
        
        break;
        case 'premium':
            const embed = new EmbedBuilder()
                .setColor(EMBED_GENERAL)
                .setTitle(`💎 ・ Comment devenir premium ?`)
                .setDescription(`**・ Voici les différentes possibilités de devenir premium :**

🌀・ Vous pouvez **boost** le serveur et vous obtiendrez directement votre accès
❤️・ Vous pouvez acheter votre accès dans le salon <#${serverConfig.channels.shop}>`)
                .setFooter({ text: FOOTER, iconURL: client.user!.displayAvatarURL({ extension: "png" }) })
                .setTimestamp();

            interaction.reply({ embeds: [embed], ephemeral: true });
            break;
        default:
            await Logger.error(`Un bouton utlisé par ${interaction.user.username} - ${interaction.user.id} n'a pas été trouver par le client -> "${interaction.customId}"`)
            return interaction.replyErrorMessage(client, `**Le button choisi n'a pas été trouver par le client**`, true);
    }

}