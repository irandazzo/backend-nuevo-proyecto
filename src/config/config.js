import dotenv from 'dotenv';
dotenv.config({path: './.env'});

export default {
    PORT: process.env.PORT,
    DB_NAME: process.env.DB_NAME,
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PASS: process.env.MONGO_PASS,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASS: process.env.ADMIN_PASS,
    SECRET_KEY: process.env.SECRET_KEY,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
}