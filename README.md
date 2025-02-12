# WeChat ChatGPT Bot

这是一个基于 Wechaty 和 ChatGPT 的微信机器人项目。

## 功能特点

- 自动回复私聊消息
- 使用 ChatGPT 进行智能对话
- 支持上下文记忆
- 简单易用的配置

## 安装

1. 克隆项目

```bash
git clone [your-repository-url]
cd wechat_bot
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量
   复制 `.env.example` 文件为 `.env`，并填写必要的配置信息：

- OPENAI_API_KEY：你的 OpenAI API 密钥
- OPENAI_MODEL：使用的模型（默认：gpt-3.5-turbo）
- BOT_NAME：机器人名称

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
3. 登录成功后，可以开始与机器人对话

## 注意事项

- 需要使用个人微信号登录
- 请确保 OpenAI API 密钥可用
- 建议使用国外服务器部署，避免网络问题
- 请遵守相关法律法规和平台规则

## 许可证

MIT
