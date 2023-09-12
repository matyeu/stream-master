import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Guild, GuildMember } from "discord.js";
import { SmClient } from "../../Librairie";
import { find as findServer } from "../../Models/server";
import { find as findMember, edit as editMember } from "../../Models/member";
import { EMBED_GENERAL } from "../../config";

export default async function (client: SmClient, newMember: GuildMember) {

    const serverConfig: any = await findServer(newMember.guild!.id);

    if (newMember.user.bot) return;

    newMember.guild.invites.fetch().then(async newInvite => {

        const oldInvite = client.invite.get(newMember.guild.id);
        const invite = newInvite.find(i => i.uses! > oldInvite.get(i.code));
        const memberInvite = newMember.client.users.cache.get(invite!.inviter!.id)!;

        const memberConfig: any = await findMember(newMember.guild!.id, memberInvite.id);

        memberConfig.invitations.inviteUser++;
        memberConfig.invitations.inviteGiveaway += 1

        if (memberConfig.invitations.inviteGiveaway >= 10) {
            memberConfig.invitations.inviteGiveaway = 0;
            memberConfig.luckGiveaway++;
        }

        await editMember(newMember.guild!.id, memberInvite.id, memberConfig);

        if (memberInvite) {
            const emvedInvite = new EmbedBuilder()
                .setColor(EMBED_GENERAL)
                .setDescription(`**${newMember.user.tag}** vient de rejoindre via l'invitation de **${memberInvite.tag}**`)

            const buttonDisabled = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`buttonInvite`)
                        .setLabel(`${memberInvite.tag} possède maintenant ${invite!.uses} invitations`)
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Secondary));

            await client.getChannel(<Guild>newMember!.guild, serverConfig.channels.invite, { embeds: [emvedInvite], components: [buttonDisabled] });

        }
    });
}