const fs = require("fs");
const csv = require("csv-parser");

const dir = "./src/csv";

/**
 * Reads a CSV file and returns its contents as an array of objects.
 * 
 * @param localArchive - The path to the CSV file.
 * @returns A promise that resolves to an array of objects representing the CSV data.
 */
export const readCSVFile = (localArchive: string): Promise<any> => {
    const results: Array<object> = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(`${dir}/${localArchive}`)
            .pipe(csv({ delimiter: "," }))
            .on("data", (data: object) => results.push(data))
            .on("end", () => {
                resolve(results);
            });
    });
}