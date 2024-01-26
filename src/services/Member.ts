import { findStudent, findTeacher, formatName } from "../utils/findPerson";
import { generateCode } from "../utils/generateCode";
import { sendEmail } from "../utils/sendEmail";
import UserService from "./UserService";

const userService = new UserService();

export const newMember = async (member: any): Promise<any> => {
    await member.send(`Bem-vindo ao servidor ${member.guild.name}!`);
    await member.send("para continuar, preciso que digite seu email acadêmico: ");
    await member.send("ATENÇÃO: Você tem 5 minutos para responder!")

    const filter = (m: any) => m.author.id === member.user.id;

    try {
        const content = await member.user.dmChannel.awaitMessages({ filter, max: 1, time: 300000, errors: ["time"] });
        const email = content.first().content.toLowerCase().trim();

        if (!email.endsWith("@academico.ifpb.edu.br")) {
            await member.send("Você foi expulso do servidor por inserir um email inválido!");
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
        await userService.create(email, code, member.user.id);
        await sendEmail(email, code);

        await member.send("Email enviado com sucesso! Digite o código recebido: ");
        await member.send("ATENÇÃO: Você tem 5 minutos para responder!")

        const codeContent = await member.user.dmChannel.awaitMessages({ filter, max: 1, time: 300000, errors: ["time"] });
        const codeInput = codeContent.first().content;

        const findUserData = await userService.findByEmail(email);
        const codeDB = findUserData["code"];
        if (codeInput !== codeDB) {
            await member.send("Código inválido!");
            await member.send("Você foi expulso do servidor por inserir um código inválido!");
            await member.kick("Código inválido!");
            return;
        }

        await member.send("Código válido!");

        if (findStudentData) {
            const name = formatName(findStudentData["Nome"]);
            await member.setNickname(name);
            await member.roles.add(process.env.STUDENT_ROLE_ID);
            await member.send("Você foi adicionado ao cargo de estudante!");
            return;
        }
        if (findTeacherData) {
            const name = formatName(findTeacherData["Nome"]);
            await member.setNickname(name);
            await member.roles.add(process.env.TEACHER_ROLE_ID);
            await member.send("Você foi adicionado ao cargo de professor!");
            return;
        }
    } catch (error) {
        await member.send("Você foi expulso do servidor por não responder a tempo!");
        await member.kick("Não respondeu a tempo!");
        await userService.deleteByEmail(member.user.id);
    }
}

export const exitMember = async (member: any): Promise<any> => {
    try {
        await userService.deleteByDiscordId(member.user.id);
    } catch (error) {
        console.log(error);
    }
}