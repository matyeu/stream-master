import { SmClient } from "../../Librairie";
import { ModalSubmitInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction } from "discord.js";
import { EMBED_ERROR, EMBED_GENERAL, EMOJIS, FOOTER, } from "../../config";
import { buttonsReasearch } from "../../Modules/Informations/action";

const animesJson = require(`../../../assets/jsons/animes.json`);
const seriesJson = require(`../../../assets/jsons/series.json`);
const filmsJson = require(`../../../assets/jsons/films.json`);
const premiumJson = require(`../../../assets/jsons/premiums.json`);

export default async function (client: SmClient, interaction: ModalSubmitInteraction) {

    const researchName = interaction.fields.getTextInputValue('researchName').toLowerCase().replace(/\s/g, '');

    const positionAnime = animesJson.map((e: { identifiant: string; }) => e.identifiant).indexOf(researchName);
    const anime = animesJson[positionAnime];

    const positionSerie = seriesJson.map((e: { identifiant: string; }) => e.identifiant).indexOf(researchName);
    const serie = animesJson[positionSerie];

    const positionFilm = filmsJson.map((e: { identifiant: string; }) => e.identifiant).indexOf(researchName);
    const film = animesJson[positionFilm];

    const positionPremium = premiumJson.map((e: { identifiant: string; }) => e.identifiant).indexOf(researchName);
    const premium = animesJson[positionPremium];

    const embed = new EmbedBuilder()
        .setColor(EMBED_GENERAL)
        .setFooter({ text: FOOTER, iconURL: client.user!.displayAvatarURL({ extension: "png" }) })
        .setTimestamp();

    let description = '';

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId('bug-button')
            .setLabel('Signaler un problème')
            .setEmoji("🔧")
            .setStyle(ButtonStyle.Secondary));


    if (anime) {

        embed.setTitle(anime.title)
        for (const saison in anime.saisons) {
            if (anime.saisons.hasOwnProperty(saison)) {
                description += `[${saison}](${anime.saisons[saison]})\n`;
            }
        }
        embed.setDescription(anime.description ? `${anime.description}\n\n${description}` : description)
        if (anime.picture) embed.setImage(anime.picture);

        return interaction.reply({ embeds: [embed], components: [button], ephemeral: true });
    } else if (serie) {

        embed.setTitle(serie.title)
        for (const saison in serie.saisons) {
            if (serie.saisons.hasOwnProperty(saison)) {
                description += `[${saison}](${serie.saisons[saison]})\n`;
            }
        }
        embed.setDescription(serie.description ? `${serie.description}\n\n${description}` : description)
        if (serie.picture) embed.setImage(serie.picture);

        return interaction.reply({ embeds: [embed], components: [button], ephemeral: true });
    } else if (film) {

        embed.setTitle(film.title)
        for (const saison in film.saisons) {
            if (film.saisons.hasOwnProperty(saison)) {
                description += `[${saison}](${film.saisons[saison]})\n`;
            }
        }
        embed.setDescription(film.description ? `${film.description}\n\n${description}` : description)
        if (film.picture) embed.setImage(film.picture);

        return interaction.reply({ embeds: [embed], components: [button], ephemeral: true });
    } else if (premium) {

        embed.setTitle(premium.title)
        for (const saison in premium.saisons) {
            if (premium.saisons.hasOwnProperty(saison)) {
                description += `[${saison}](${premium.saisons[saison]})\n`;
            }
        }
        embed.setDescription(premium.description ? `${premium.description}\n\n${description}` : description)
        if (premium.picture) embed.setImage(premium.picture);

        return interaction.reply({ embeds: [embed], components: [button], ephemeral: true });
    } else {

        const embed = new EmbedBuilder()
            .setColor(EMBED_ERROR)
            .setTitle(`${client.getEmoji(EMOJIS.error)} - Aucun Résultat !`)
            .setDescription(`> 🎥 - Aucun anime, série, film n'a été trouvé pour : \`${researchName}\``)
            .setFooter({ text: FOOTER, iconURL: client.user!.displayAvatarURL({ extension: "png" }) })
            .setTimestamp();

        const button = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("suggestion")
                    .setLabel("Suggestion")
                    .setEmoji('💡')
                    .setStyle(ButtonStyle.Success)
            )

        const erroreEmbed = await interaction.reply({ embeds: [embed], components: [button], fetchReply: true, ephemeral: true });

        erroreEmbed.createMessageComponentCollector({ filter: () => true })
            .on("collect", async (interaction: ButtonInteraction) => { await buttonsReasearch(client, interaction) });
    }

}

export const modal = {
    data: {
        name: __filename.slice(__dirname.length + 1, __filename.length - 3)
    }
}