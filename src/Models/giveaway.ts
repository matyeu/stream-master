import {model, Schema} from 'mongoose';
import {Snowflake} from "discord.js";
import {createMissingProperties} from "../Librairie";

const Logger = require("../Librairie/logger");

let Giveaway = model("Giveaway", new Schema({
    guildId: String,
    id_giveaway: String,
    price: String,
    description: String,
    winner: Number,
    participant: Number,
    time: String,
    users: Array,
}));

export const def = {
    guildId: "",
    id_giveaway: "",
    price: "",
    description: "",
    winner: 0,
    participant: 0,
    time: "",
    users: Array,
};

export async function create(guildId: Snowflake, id_giveaway: Snowflake, price: String, description: String, winner: Number, time: String) {
    const giveaway = new Giveaway(createMissingProperties(def, {guildId, id_giveaway, price, description, winner, time}));
    await giveaway.save();
    Logger.database("Creating a giveaway in the database");
    return giveaway;
};

export async function find(guildId: Snowflake, id_giveaway: Snowflake) {
    const giveaway = await Giveaway.findOne({guildId, id_giveaway});
    return giveaway;
};

export async function edit(guildId: Snowflake, id_giveaway: Snowflake, data: object) {
    await find(guildId, id_giveaway);
    const giveaway = await Giveaway.findOneAndUpdate({guildId, id_giveaway}, data, {new:true});
    Logger.database("Updating a giveaway in the database");
    return await giveaway!.save();
};


export default Giveaway;