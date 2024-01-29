const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: path.resolve(__dirname, '../.env.prod') });
} else {
    dotenv.config({ path: path.resolve(__dirname, '../.env.dev') });
}