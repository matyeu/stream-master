import {SmClient} from "../../Librairie";
import {Invite} from "discord.js";

export default async function (client: SmClient, invite: Invite) {

    client.invite.get(invite.guild!.id).delete(invite.code, invite.uses);

};