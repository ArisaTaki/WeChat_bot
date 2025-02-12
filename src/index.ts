import { WechatyBuilder } from "wechaty";
import type { Message } from "wechaty";
import { ChatService } from "./services/chat.service";
import { config } from "./config";
import { FileBox } from "file-box";
import { log } from "./utils/logger";
import qrcodeTerminal from "qrcode-terminal";

const chatService = new ChatService();
let botStartTime: Date; // 记录机器人启动时间

const bot = WechatyBuilder.build({
  name: config.BOT_NAME,
  puppet: "wechaty-puppet-padlocal",
  puppetOptions: {
    token: config.WECHATY_PUPPET_PADLOCAL_TOKEN,
  },
});

bot
  .on("scan", (qrcodeUrl: string, status) => {
    // 不管状态如何，只要有二维码URL就显示
    if (qrcodeUrl) {
      qrcodeTerminal.generate(qrcodeUrl, { small: true });
      log.info("请使用微信扫描上方二维码登录");
      log.info("二维码链接：", qrcodeUrl);
    }
    log.info("当前状态:", status);
  })
  .on("login", (user) => {
    log.info("用户 %s 登录成功", user.name());
    // 在登录成功时设置启动时间
    botStartTime = new Date();
    log.info("机器人启动时间:", botStartTime);
  })
  .on("ready", () => {
    log.info("机器人就绪，开始处理新消息");
  })
  .on("message", async (message: Message) => {
    try {
      // 只处理在启动之后发送的消息
      const messageTime = message.date();
      if (!botStartTime || messageTime < botStartTime) {
        // log.info("忽略启动前的消息");
        return;
      }

      log.info("收到新消息，开始处理...");
      log.info("消息类型:", message.type());
      log.info("消息内容:", message.text());
      log.info("发送者:", message.talker()?.name());
      log.info("消息时间:", messageTime);

      // 过滤自己发送的消息
      if (message.self()) {
        log.info("忽略自己发送的消息");
        return;
      }

      // 只处理文本消息
      if (message.type() !== bot.Message.Type.Text) {
        log.info("忽略非文本消息，类型:", message.type());
        return;
      }

      const content = message.text().trim();
      const room = message.room();

      // 忽略空消息
      if (!content) {
        log.info("忽略空消息");
        return;
      }

      log.info("准备回复消息...");
      // 私聊消息
      if (!room) {
        try {
          log.info("开始调用 ChatGPT API");
          const response = await chatService.chat(content);
          log.info("ChatGPT 返回结果，准备发送回复");
          await message.say(response);
          log.info("回复发送成功");
        } catch (error) {
          log.error("ChatGPT 调用或发送回复出错:", error);
          await message.say("抱歉，我遇到了一些问题，请稍后再试。");
        }
      } else {
        log.info("忽略群聊消息");
      }
    } catch (e) {
      log.error("消息处理主流程错误:", e);
      try {
        await message.say("抱歉，我遇到了一些问题，请稍后再试。");
      } catch (replyError) {
        log.error("发送错误回复时也失败了:", replyError);
      }
    }
  })
  .on("error", (error) => {
    log.error("机器人错误:", error);
  });

// 启动机器人
log.info("正在启动机器人...");
bot
  .start()
  .then(() => log.info("机器人启动成功"))
  .catch((e) => {
    log.error("机器人启动失败:", e);
    process.exit(1);
  });
