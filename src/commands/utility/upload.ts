import Discord, { SlashCommandBuilder } from "discord.js";
import LogService from "../../services/LogService";
import { deleteFile, downloadZip, extractZip, verifyZip } from "../../services/download-zip";
import { readCSVFile } from "../../utils/readCSVFile";

const UPLOAD_CHANNEL_ID = process.env.UPLOAD_CHANNEL_ID;

if (!UPLOAD_CHANNEL_ID) {
    throw new Error("Missing UPLOAD_CHANNEL_ID");
}

const logService = new LogService();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("upload")
        .setDescription("Manda um arquivo para o servidor.")
        .addAttachmentOption((option: any) =>
            option
                .setName("arquivo")
                .setDescription("O arquivo que você deseja enviar.")
                .setRequired(true)
        ),
    async execute(interaction: any) {
        try {
            const channel = interaction.channel;

            if (channel.id !== UPLOAD_CHANNEL_ID) {
                await interaction.reply({ content: "Você não pode usar esse comando aqui", ephemeral: true });
                return;
            }

            if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
                await interaction.reply("Você não tem permissão para usar esse comando.");
                return;
            }

            const attachment = interaction.options.getAttachment("arquivo");

            if (!attachment) {
                await interaction.reply("Você precisa enviar um arquivo.");
                return;
            }

            if (attachment.size > 10000000) {
                await interaction.reply("O arquivo precisa ter no máximo 10MB.");
                return;
            }

            const file = attachment.url;
            const fileName = attachment.name;

            if (fileName !== "dados.zip") {
                await interaction.reply("O arquivo precisa se chamar dados e estar compactado em .zip");
                return;
            }

            const filePath = `./src/csv/${fileName}`;

            const download = await downloadZip(file, filePath);

            if (!download) {
                await interaction.reply("Erro ao baixar o arquivo.");
                return;
            }

            const verify = await verifyZip(filePath);

            if (!verify.success) {
                await interaction.reply(verify.message);
                return;
            }

            await extractZip(filePath, "./src/csv");

            const columsStudent = ["#", "Nome", "Matricula", "Curso", "Situacao", "Periodo letivo de ingresso", "E-mail pessoal", "E-mail academico"];
            const columsTeacher = ["Nome", "E-mail"];

            const verifyColumsStudent = await readCSVFile("alunos.csv");
            const verifyColumsTeacher = await readCSVFile("professores.csv");

            const keys = Object.keys(verifyColumsStudent[0]);
            const verifyColums = columsStudent.every((value, index) => value === keys[index]);

            if (!verifyColums) {
                await interaction.reply(`O 'alunos.csv' arquivo precisa ter as seguintes colunas, seguindo estritamente os seguintes nomes: ${columsStudent.join(", ")}`);
                await deleteFile(filePath);
                return;
            }

            const keysTeacher = Object.keys(verifyColumsTeacher[0]);
            const verifyColumsT = columsTeacher.every((value, index) => value === keysTeacher[index]);
            
            if (!verifyColumsT) {
                await interaction.reply(`O arquivo 'professores.csv' precisa ter as seguintes colunas, seguindo estritamente os seguintes nomes: ${columsTeacher.join(", ")}`);
                await deleteFile(filePath);
                return;
            }

            await interaction.reply("Arquivo enviado com sucesso.");
        } catch (error: any) {
            console.log(error);
            await logService.create(error.message);
        }
    },
};