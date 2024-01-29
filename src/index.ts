import {Client, Collection, GatewayIntentBits, REST, Routes } from "discord.js"
import { exitMember, newMember } from "./services/Member";
import LogService from "./services/LogService";
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: path.resolve(__dirname, '../.env.production') });
} else {
    dotenv.config({ path: path.resolve(__dirname, '../.env.development') });
}

const GUILD_ID = process.env.GUILD_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!GUILD_ID) {
    throw new Error("Missing GUILD_ID");
}

if (!DISCORD_TOKEN) {
    throw new Error("Missing DISCORD_TOKEN");
}

const logService = new LogService();

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

const commands = [];
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
            commands.push(command.data.toJSON());
        } else {
            console.log("Error loading command: " + file);
        }
    }
}

// const rest = new REST().setToken(process.env.DISCORD_TOKEN as string);

// (async () => {
//     try {
//         const data = await rest.put(
//             Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.GUILD_ID as string),
//             { body: commands },
//         );

//         console.log("Successfully registered application commands.");
//     } catch (error) {
//         console.log(error);
//     }
// })();

// client.once("ready", () => {
//     console.log("Bot is Ready!");
// })

client.once("ready", () => {
    console.log("Bot is Ready!");
});

client.on("interactionCreate", async (interaction: any) => {
    if (!interaction.isCommand()) return;

    if (interaction.guild.id !== GUILD_ID) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error: any) {
        console.log(error);
        await logService.create(error.message);
    }
});

client.on("guildMemberAdd", async (member: any) => {
    try {
        await newMember(member);
    } catch (error: any) {
        console.log(error);
        await logService.create(error.message);
    }
});

client.on("guildMemberRemove", async (member: any) => {
    try {
        await exitMember(member);
    } catch (error: any) {
        console.log(error);
        await logService.create(error.message);
    }
});

client.login(DISCORD_TOKEN);