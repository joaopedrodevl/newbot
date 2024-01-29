import { findStudent, findTeacher, formatName } from "../utils/findPerson";
import { generateCode } from "../utils/generateCode";
import { sendEmail } from "../utils/sendEmail";
import LogService from "./LogService";
import UserService from "./UserService";
import Discord from "discord.js";

const STUDENT_ROLE_ID = process.env.STUDENT_ROLE_ID;
const TEACHER_ROLE_ID = process.env.TEACHER_ROLE_ID;

if (!STUDENT_ROLE_ID) {
    throw new Error("Missing STUDENT_ROLE_ID");
}

if (!TEACHER_ROLE_ID) {
    throw new Error("Missing TEACHER_ROLE_ID");
}

const userService = new UserService();
const pendingAuthentications = new Map();
const logService = new LogService();

/**
 * Creates a new member in the server and initiates the authentication process.
 * @param member - The member object representing the user joining the server.
 * @returns A Promise that resolves when the authentication process is completed.
 */
export const newMember = async (member: any): Promise<any> => {
    const filter = (m: any) => m.author.id === member.user.id;
    const dmChannel = await member.user.createDM();

    let reject: any;
    const authPromise = new Promise((resolve, rejectFn) => {
        reject = rejectFn;
        member.user.dmChannel.awaitMessages({ filter, max: 1, time: 300000, errors: ["time"] })
            .then(resolve)
            .catch((error: any) => {
                if (error === "time") {
                    pendingAuthentications.delete(member.user.id);
                }
                reject(error);
            });
    });

    if (pendingAuthentications.has(member.user.id)) {
        try {
            if (pendingAuthentications.get(member.user.id)["newUser"]) {
                const { email, code, discord_id, type } = pendingAuthentications.get(member.user.id)["newUser"];
                await userService.create(email, code, discord_id, type);
                await member.send("Você já está em processo de autenticação!");
                await member.send("Digite o código recebido: ");
                await member.send("ATENÇÃO: Você tem 5 minutos para responder!")
                return;
            }
            await member.send("Você já está em processo de autenticação!");
            await member.send("Digite seu email acadêmico: ");
            return;
        } catch (error: any) {
            console.log(error);
            await member.send("Você foi expulso do servidor. Erro ao autenticar!");
            await member.kick("Erro ao autenticar!");
            await logService.create(error.message);
        }
    };

    await member.send(`Bem-vindo ao servidor ${member.guild.name}!`);
    await member.send("para continuar, preciso que digite seu email acadêmico: ");
    await member.send("ATENÇÃO: Você tem 5 minutos para responder!")

    try {
        pendingAuthentications.set(member.user.id, { reject, promise: authPromise });
        const content = await authPromise as Discord.Collection<string, Discord.Message>;
        const email = content.first()?.content.trim().toLowerCase();

        if (!email) {
            await member.send("Você foi expulso do servidor por não inserir um email!");
            await member.kick("Email inválido!");
            return;
        }

        const findUser = await userService.findByEmail(email);
        if (findUser) {
            await member.send("Você foi expulso do servidor por já estar cadastrado!");
            await member.kick("Já está cadastrado!");
            return;
        }

        const findStudentData = await findStudent(email);
        const findTeacherData = await findTeacher(email);
        if (!findStudentData && !findTeacherData) {
            await member.send("Você foi expulso do servidor por inserir um email inválido!");
            await member.kick("Email não encontrado!");
            return;
        }

        const code = generateCode();
        const newUser = await userService.create(email, code, member.user.id, findStudentData ? "student" : "teacher");
        await sendEmail(email, code);
        pendingAuthentications.set(member.user.id, { reject, promise: authPromise, newUser });

        await member.send("Email enviado com sucesso! Digite o código recebido: ");
        await member.send("ATENÇÃO: Você tem 5 minutos para responder!")

        const codeContent = await member.user.dmChannel.awaitMessages({ filter, max: 1, time: 300000, errors: ["time"] });
        const codeInput = codeContent.first().content;

        const findUserData = await userService.findByDiscordId(member.user.id);
        const codeDB = findUserData["code"];
        if (codeInput !== codeDB) {
            await member.send("Código inválido!");
            await member.send("Você foi expulso do servidor por inserir um código inválido!");
            await member.kick("Código inválido!");
            return;
        }

        await member.send("Código válido!");
        pendingAuthentications.delete(member.user.id);
        if (findStudentData) {
            const name = formatName(findStudentData["Nome"]);
            await member.setNickname(name);
            await member.roles.add(STUDENT_ROLE_ID);
            await member.send("Você foi adicionado ao cargo de estudante!");
            return;
        }
        if (findTeacherData) {
            const name = formatName(findTeacherData["Nome"]);
            await member.setNickname(name);
            await member.roles.add(TEACHER_ROLE_ID);
            await member.send("Você foi adicionado ao cargo de professor!");
            return;
        }
    } catch (error: any) {
        console.log(error);
        await member.send("Você foi expulso do servidor por não responder a tempo!");
        await member.kick("Não respondeu a tempo!");
        await userService.deleteByDiscordId(member.user.id);
        await logService.create(error.message);
    }
}

/**
 * Removes a member from the system.
 * @param member - The member to be removed.
 * @returns A promise that resolves to the result of the operation.
 */
export const exitMember = async (member: any): Promise<any> => {
    try {
        await userService.deleteByDiscordId(member.user.id);
    } catch (error: any) {
        console.log(error);
        await logService.create(error.message);
    }
}