const fs = require("fs");
const csv = require("csv-parser");

const dir = "./src/csv";

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