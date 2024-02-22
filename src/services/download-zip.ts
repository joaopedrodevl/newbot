import axios from "axios";
import extract from "extract-zip";
import fs from "fs";
import path from "path";
import yauzl from "yauzl";

export async function downloadZip(url: string, path: string): Promise<Buffer> {
    const response = await axios.get(url, { responseType: "stream" });
    const writer = fs.createWriteStream(path);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on("finish", () => {
            fs.readFile(path, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
        writer.on("error", reject);
    });
}

export function verifyZip(path: string): Promise<{ success: boolean, message: string }> {
    const files = ["alunos.csv", "professores.csv"];

    return new Promise((resolve) => {
        yauzl.open(path, { lazyEntries: true }, (err, zipfile) => {
            if (err) {
                resolve({ success: false, message: err.message });
                return;
            }

            zipfile.readEntry();
            zipfile.on("entry", (entry) => {
                if (!files.includes(entry.fileName)) {
                    resolve({ success: false, message: "Arquivo inválido. Certifique-se que o nome do arquivo seja 'dados' com a extensão '.zip'. Certifique-se também que os arquivos zipados sejam 'alunos.csv' e 'professores.csv'." });
                    return;
                }
                zipfile.readEntry();
            });
            zipfile.on("end", () => {
                resolve({ success: true, message: "Arquivo válido" });
            });
        });
    })
}

export async function deleteFile(path: string): Promise<void> {
    fs.unlink(path, (err) => {
        if (err) throw new Error(err.message);
    })
}

export async function extractZip(pathP: string, destination: string): Promise<void> {
    try {
        await extract(pathP, { dir: path.resolve(destination) });
    } catch (error: any) {
        throw new Error(error.message);
    }
}