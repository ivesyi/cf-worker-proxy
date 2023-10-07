# Cloudflare Worker Proxy

一个基于Cloudflare Worker的简易代理，允许用户通过特定的前缀访问任何网站。本代理可帮助实现跨域请求和为特定的代理需求提供解决方案。

参考了[cloudflare-reverse-proxy](https://github.com/gaboolic/cloudflare-reverse-proxy)并在其基础上进行了一些调整和改进。在此表示感谢！

## 使用指南

### 在Cloudflare上部署Worker

1. 登录到[Cloudflare Dashboard](https://dash.cloudflare.com/).
2. 在右上方选择你的域名。
3. 在导航栏中，点击 "Workers"。
4. 点击 "Create a Worker"。
5. 在左侧的编辑器中，粘贴 `_worker.js` 里的代码。
6. 点击 "Save and Deploy"。

### 如何使用代理

1. 部署完Cloudflare Worker后，你会得到一个URL，类似 `https://your-worker-name.yourusername.workers.dev/`
2. 为了代理任何网站，只需添加 `/proxy/` 前缀，然后添加你希望代理的URL，例如：`https://your-worker-name.yourusername.workers.dev/proxy/https://targeturl.com`。

### 绑定自定义域名（可选）

如果你希望也可以使用自己的自定义域名代替默认的`.workers.dev`域名，如何操作请自行google,
完成后，你可以通过你的自定义域名来访问代理，例如：`https://proxy.yourdomain.com/proxy/https://targeturl.com`。

## 特点

- 简单易用，无需复杂配置。
- 支持跨域请求。
- 但请注意，某些使用了reCAPTCHA的网站可能会遇到问题

## 致谢

特别感谢 [cloudflare-reverse-proxy](https://github.com/gaboolic/cloudflare-reverse-proxy) 提供的原始代码和灵感。
