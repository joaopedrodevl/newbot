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

export const findTeacher = async (email: string): Promise<Teacher | undefined> => {
    email = email.toLowerCase().trim();
    const data: Array<Teacher> = await readCSVFile("professores.csv") as Array<Teacher>;
    return data.find((teacher) => teacher["E-mail"] === email);
}

export const findStudent = async (email: string) => {
    email = email.toLowerCase().trim();
    const data: Array<Student> = await readCSVFile("alunos.csv") as Array<Student>;
    return data.find((student) => student["E-mail academico"] === email);
}

export const formatName = (name: string) => {
    const nameSplit = name.split(" ");
    return nameSplit[0] + " " + nameSplit[nameSplit.length - 1];
}