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

/**
 * Finds a teacher by email.
 * @param email - The email of the teacher.
 * @returns A Promise that resolves to the found teacher, or undefined if not found.
 */
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

/**
 * Finds a student by academic email.
 * @param email - The academic email of the student to be searched.
 * @returns The student found or undefined if not found.
 */
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

/**
 * Formats a name by extracting the first and last name.
 * @param name - The name to be formatted.
 * @returns The formatted name.
 */
export const formatName = (name: string) => {
    const nameSplit = name.split(" ");
    return nameSplit[0] + " " + nameSplit[nameSplit.length - 1];
}