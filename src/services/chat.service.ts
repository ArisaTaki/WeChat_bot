import OpenAI from "openai";
import { config } from "../config";
import { log } from "../utils/logger";

export class ChatService {
  private openai: OpenAI;
  private context: { role: "user" | "assistant"; content: string }[] = [];
  private maxRetries = 3;
  private retryDelay = 1000; // 1秒

  constructor() {
    log.info("初始化 ChatGPT 服务");
    log.info("使用模型:", config.OPENAI_MODEL);
    log.info("API Base URL:", config.OPENAI_BASE_URL);

    this.openai = new OpenAI({
      baseURL: config.OPENAI_BASE_URL,
      apiKey: config.OPENAI_API_KEY,
      timeout: 60000, // 60秒超时
    });
  }

  private async retry<T>(
    operation: () => Promise<T>,
    retries: number = this.maxRetries
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        log.warn(
          `操作失败，剩余重试次数: ${retries - 1}，等待 ${
            this.retryDelay
          }ms 后重试`
        );
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        return this.retry(operation, retries - 1);
      }
      throw error;
    }
  }

  async chat(message: string): Promise<string> {
    try {
      log.info("收到用户消息:", message);

      // 添加用户消息到上下文
      this.context.push({ role: "user", content: message });

      // 保持上下文长度，避免超出 token 限制
      if (this.context.length > 10) {
        this.context = this.context.slice(-10);
      }

      log.info("发送到 ChatGPT 的上下文:", this.context);

      const completion = await this.retry(async () => {
        log.info("调用 ChatGPT API...");
        const response = await this.openai.chat.completions.create({
          messages: this.context,
          model: config.OPENAI_MODEL,
          temperature: 0.7,
          max_tokens: 1000,
        });
        log.info("ChatGPT API 调用成功");
        return response;
      });

      const reply =
        completion.choices[0]?.message?.content ||
        "抱歉，我没有得到有效的回复。";
      log.info("ChatGPT 原始响应:", completion);
      log.info("提取的回复:", reply);

      // 添加助手回复到上下文
      this.context.push({ role: "assistant", content: reply });

      return reply;
    } catch (error) {
      log.error("ChatGPT API 调用错误:", error);
      if (error instanceof Error) {
        log.error("错误详情:", error.message);
        if ("response" in error) {
          log.error("API 响应:", (error as any).response?.data);
        }
      }
      throw error; // 让上层处理错误
    }
  }
}
