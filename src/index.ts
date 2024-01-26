import {Client, Collection, GatewayIntentBits } from "discord.js"
import { exitMember, newMember } from "./services/Member";
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

class MyClient extends Client {
    commands: Collection<string, any>;

    constructor(options: any) {
        super(options);
        this.commands = new Collection();
    }
}

const client = new MyClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
    ],
});

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith(".ts"));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ("data" in command && 'execute' in command){
            client.commands.set(command.data.name, command);
        } else {
            console.log("Error loading command: " + file);
        }
    }
}

client.once("ready", () => {
    console.log("Bot is Ready!");
})

client.on("interactionCreate", async (interaction: any) => {
    if (!interaction.isCommand()) return;

    if (interaction.guild.id !== process.env.GUILD_ID) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        if (interaction.replied || interaction.deferred){
            await interaction.followUp({content: "There was an error while executing this command!", ephemeral: true});
        } else {
            await interaction.reply({content: "There was an error while executing this command!", ephemeral: true});
        }
    }
});

client.on("guildMemberAdd", async (member: any) => {
    await newMember(member);
});

client.on("guildMemberRemove", async (member: any) => {
    console.log("Member left!");
    await exitMember(member);
});

client.login(process.env.DISCORD_TOKEN);