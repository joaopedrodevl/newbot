import { SlashCommandBuilder } from "discord.js";
import { searchQuestions } from "../../services/api";
import LogService from "../../services/LogService";

const dotenv = require("dotenv");
dotenv.config();

const STACKOVERFLOW_ID = process.env.STACKOVERFLOW_ID;

if (!STACKOVERFLOW_ID) {
    throw new Error("Missing STACKOVERFLOW_ID");
}

const logService = new LogService();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stackoverflow")
        .setDescription("Responde o usuário com uma pergunta do StackOverflow.")
        .addStringOption((option: any) =>
            option
                .setName("pergunta")
                .setDescription("A pergunta que você quer fazer ao StackOverflow.")
                .setRequired(true)
        ),
    async execute(interaction: any) {
        try {
            if (interaction.channelId !== STACKOVERFLOW_ID) {
                await interaction.reply({ content: "Você não pode usar esse comando aqui", ephemeral: true });
                return;
            };
            const query = interaction.options.getString("pergunta");
            const questions = await searchQuestions(query);
            if (!questions) {
                await interaction.reply(`Não encontrei nenhuma pergunta para '${query}'`);
                return;
            }
            await interaction.reply(`Aqui estão as perguntas que encontrei para '${query}':\n${questions}`);
        } catch (error: any) {
            console.log(error);
            await logService.create(error.message);
        }
    },
};