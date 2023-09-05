import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, TextChannel } from "discord.js";
import { AcClient } from "../../Librairie";
import { EMBED_GENERAL, FOOTER } from "../../config";
import { find } from "../../Models/server";

const animesJson = require(`../../../Jsons/animes.json`);
const seriesJson = require(`../../../Jsons/series.json`);
const filmsJson = require(`../../../Jsons/films.json`);
const premiumJson = require(`../../../Jsons/premiums.json`);

let i = 0;

animesJson.map((e: any) => { for (const _ in e.saisons) { i++ } });
seriesJson.map((e: any) => { for (const _ in e.saisons) { i++ } });
filmsJson.map((e: any) => { for (const _ in e.saisons) { i++ } });
premiumJson.map((e: any) => { for (const _ in e.saisons) { i++ } });


export async function createCatalogEmbed(client: AcClient, channel: TextChannel) {

    const serverConfig: any = await find(channel.guild.id);

    const embed = new EmbedBuilder()
        .setColor(EMBED_GENERAL)
        .setThumbnail(client.user!.displayAvatarURL({ extension: "png" }))
        .setDescription(`> \`・\` **${i}**  Liens sont disponibles actuellement

> \`・\` Rendez-vous dans le salon <#${serverConfig.channels.research}> pour trouver ce que vous souhaitez !

> \`・\` **Cliquez sur les boutons** ci-dessous pour voir quel type de catalogue vous voulez voir.`)
        .setFooter({ text: FOOTER, iconURL: client.user!.displayAvatarURL({ extension: "png" }) })
        .setTimestamp();


    const buttons = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("anime")
                .setLabel("Animes")
                .setEmoji('🏯')
                .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("series")
                .setLabel("Séries")
                .setEmoji('🎬')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("film")
                .setLabel("Films")
                .setEmoji('📽️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
        )

        .addComponents(
            new ButtonBuilder()
                .setCustomId("premium")
                .setLabel("Premium")
                .setEmoji('✨')
                .setStyle(ButtonStyle.Primary)
        );

    const message = await channel.send({ embeds: [embed], components: [buttons] });
    await message.pin();
    return message;
};

export async function createResearchEmbed(client: AcClient, channel: TextChannel) {

    const serverConfig: any = await find(channel.guild.id);

    const embed = new EmbedBuilder()
        .setColor(EMBED_GENERAL)
        .setTitle('🎥・Films Séries Animes')
        .setThumbnail(client.user!.displayAvatarURL({ extension: "png" }))
        .setDescription(`Les Films Series et Animes sont désormais disponibles sur le bot !
Nous comptons déja **${i}** Liens ajoutés !

**🔎・Comment rechercher un film un anime ou une serie ?**
Cliquez sur le bouton 🔎 ci-dessous pour trouver ce que vous souhaitez. Pour voir la liste : <#${serverConfig.channels.catalog}>

**⭕・Un Probleme ?**
Allez dans le salon ⁠<#${serverConfig.channels.support}> !

**✨・Comment nous soutenir ?**
Allez dans le salon ⁠<#${serverConfig.channels.soutien}> !
    
    
    `)
        .setFooter({ text: FOOTER, iconURL: client.user!.displayAvatarURL({ extension: "png" }) })
        .setTimestamp();

    const buttons = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("research")
                .setLabel("Recherche")
                .setEmoji('🔍')
                .setStyle(ButtonStyle.Primary)
        )

        .addComponents(
            new ButtonBuilder()
                .setCustomId("premium")
                .setLabel("Premium")
                .setEmoji('✨')
                .setStyle(ButtonStyle.Secondary)
        )

        .addComponents(
            new ButtonBuilder()
                .setCustomId("suggestion")
                .setLabel("Suggestion")
                .setEmoji('💡')
                .setStyle(ButtonStyle.Success)
        )

    const message = await channel.send({ embeds: [embed], components: [buttons] });
    await message.pin();
    return message;

}