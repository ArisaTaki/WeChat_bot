import dotenv from "dotenv";

dotenv.config();

export const config = {
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || "",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
  BOT_NAME: process.env.BOT_NAME || "ChatGPT助手",
  WECHATY_PUPPET_PADLOCAL_TOKEN:
    process.env.WECHATY_PUPPET_PADLOCAL_TOKEN || "",
};
