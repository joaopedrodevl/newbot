import LogService from "../services/LogService";
import { readCSVFile } from "./readCSVFile";

export interface Teacher {
    "E-mail": string;
    "Nome": string;
}

export interface Student {
    "#": string;
    "Nome": string;
    "Matricula": string;
    "Curso": string;
    "Situacao": string;
    "Periodo letivo de ingresso": string;
    "E-mail pessoal": string;
    "E-mail academico": string;
}

const logService = new LogService();

export const findTeacher = async (email: string): Promise<Teacher | undefined> => {
    try {
        email = email.toLowerCase().trim();
        const data: Array<Teacher> = await readCSVFile("professores.csv") as Array<Teacher>;
        return data.find((teacher) => teacher["E-mail"] === email);
    } catch (error: any) {
        console.log(error);
        await logService.create(error.message);
    }
}

export const findStudent = async (email: string) => {
    try {
        email = email.toLowerCase().trim();
        const data: Array<Student> = await readCSVFile("alunos.csv") as Array<Student>;
        return data.find((student) => student["E-mail academico"] === email);
    } catch (error: any) {
        console.log(error);
        await logService.create(error.message);
    }
}

export const formatName = (name: string) => {
    const nameSplit = name.split(" ");
    return nameSplit[0] + " " + nameSplit[nameSplit.length - 1];
}