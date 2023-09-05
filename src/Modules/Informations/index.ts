import { ButtonInteraction, Guild, ModalSubmitInteraction, TextChannel } from "discord.js";
import { AcClient } from "../../Librairie";
import { find } from "../../Models/server";
import { createCatalogEmbed, createResearchEmbed } from "./embeds";
import { buttonsCatalog, buttonsReasearch } from "./action";

const Logger = require("../../Librairie/logger");

export default async function (client: AcClient, guild: Guild) {

    const serverConfig: any = await find(guild.id);

    if (!serverConfig.modules.informations) return Logger.warn(`Loading informations from the ${guild.name} server - SKIPPED (The module is disabled)`);

    const catalogChannel = <TextChannel>guild.channels.cache.get(serverConfig.channels.catalog);
    if (!catalogChannel) return Logger.error(`Loading information for the  ${guild.name} server - FAIL (The catalog channel is not filled in or cannot be found)`);

    const researchChannel = <TextChannel>guild.channels.cache.get(serverConfig.channels.research);
    if (!researchChannel) return Logger.error(`Loading information for the  ${guild.name} server - FAIL (The research channel is not filled in or cannot be found)`);

    let catalogEmbed = (await (<TextChannel>catalogChannel).messages?.fetchPinned()).first();
    if (!catalogEmbed) catalogEmbed = await createCatalogEmbed(client, catalogChannel);

    let researchEmbed = (await (<TextChannel>researchChannel).messages?.fetchPinned()).first();
    if (!researchEmbed) researchEmbed = await createResearchEmbed(client, researchChannel);


    catalogEmbed.createMessageComponentCollector({ filter: () => true })
        .on("collect", async (interaction: ButtonInteraction) => { await buttonsCatalog(client, interaction) });

    researchEmbed.createMessageComponentCollector({ filter: () => true })
        .on("collect", async (interaction: ButtonInteraction) => { await buttonsReasearch(client, interaction) });

    Logger.module(`Loading information for the server ${guild.name} - SUCCESS`);

}