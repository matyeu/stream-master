import {model, Schema} from 'mongoose';
import {Snowflake} from "discord.js";
import {createMissingProperties} from "../Librairie";

const Logger = require("../Librairie/logger");

const Members = model("Members", new Schema({
    serverId: String,
    userId: String,
    invitations: {
        inviteUser: Number,
        inviteBonus: Number,
        inviteLeave: Number,
        inviteGiveaway: Number,
    },
    luckGiveaway: Number,
}));

export const def = {
    serverId: "",
    userId: "",
    invitations: {
        inviteUser: 0,
        inviteBonus: 0,
        inviteLeave: 0,
        inviteGiveaway: 0
    },
    luckGiveaway: 1
};

export async function create(serverId: Snowflake, userId: Snowflake) {
    let member = new Members(createMissingProperties(def, {serverId, userId}));
    await member.save();
    Logger.client("Creating a user in the database");
    return member;
};

export async function find(serverId: Snowflake, userId: Snowflake) {
    let member = await Members.findOne({serverId, userId});
    if (!member) {
        member = await create(serverId, userId);
    }
    return member;
};

export async function findServer(serverId: Snowflake) {
    if (!serverId) return null;
    const members = await Members.find({serverId: serverId});
    if (members) return members;
    return null;
}

export async function edit(serverId: Snowflake, userId: Snowflake, data: object) {
    await find(serverId, userId);
    let member = await Members.findOneAndUpdate({serverId, userId}, data, {new: true});
    return await member!.save();
};

export async function update(serverId: Snowflake, userId: Snowflake) {
    let member = await find(serverId, userId);
    let data = createMissingProperties(def, member)
    return edit(serverId, userId, data);
};

export default Members;