import { SlashCommandBuilder } from "discord.js";
const dotenv = require("dotenv");
dotenv.config();

const CHAT_ID = process.env.CHAT_ID;

if (!CHAT_ID) {
    throw new Error("Missing CHAT_ID");
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    async execute(interaction: any) {
        if (interaction.channelId !== CHAT_ID) {
            await interaction.reply({ content: "Você não pode usar esse comando aqui", ephemeral: true });
            return;
        }
        await interaction.reply("Pong!");
    },
};