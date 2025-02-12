# WeChat ChatGPT Bot

这是一个基于 Wechaty 和 ChatGPT 的微信机器人项目。使用 PadLocal 协议实现稳定可靠的微信接入。

## 功能特点

- 自动回复私聊消息
- 使用 ChatGPT 进行智能对话
- 支持上下文记忆
- 稳定可靠的消息处理
- 优雅的消息过滤机制
- 完善的日志记录

## 安装

1. 克隆项目

```bash
git clone https://github.com/ArisaTaki/WeChat_bot.git
cd wechat_bot
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量
   复制 `.env.example` 文件为 `.env`，并填写必要的配置信息：

```bash
cp .env.example .env
```

需要配置的环境变量：

- `OPENAI_API_KEY`：OpenAI API 密钥
- `OPENAI_MODEL`：使用的模型（默认：gpt-3.5-turbo）
- `OPENAI_BASE_URL`：OpenAI API 基础 URL
- `BOT_NAME`：机器人名称
- `WECHATY_PUPPET_PADLOCAL_TOKEN`：PadLocal 服务的 token（访问 http://pad-local.com/#/tokens 申请）

## 运行

开发模式：

```bash
npm run dev
```

生产模式：

```bash
npm run build
npm start
```

## 使用说明

1. 运行程序后，会显示一个二维码
2. 使用微信扫描二维码登录
3. 登录成功后，机器人就会开始工作
4. 可以通过私聊向机器人发送消息进行对话

## 特性说明

- 消息处理：

  - 只处理登录后的新消息
  - 自动过滤自己发送的消息
  - 只响应文本消息
  - 目前仅支持私聊（群聊消息会被忽略）

- 上下文记忆：

  - 保持最近 10 条消息的上下文
  - 支持连续对话

- 错误处理：
  - 完善的错误处理机制
  - 详细的日志记录
  - 友好的错误提示

## 注意事项

- 需要 PadLocal token 才能运行（可以申请 7 天免费试用）
- 请确保 OpenAI API 密钥可用
- 建议使用国外服务器部署，避免 API 访问问题
- 请遵守相关法律法规和平台规则

## 许可证

MIT
