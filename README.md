# 网盘后台服务

基于 Egg.js + TypeScript + MongoDB 构建的网盘后台服务，提供用户认证和文件管理功能。

## 技术栈

- Node.js
- Egg.js
- TypeScript
- MongoDB (egg-mongoose)
- JWT (egg-jwt)

## 项目结构

```
app/
├── controller/     # 控制器
├── middleware/     # 中间件
├── model/         # 数据模型
├── service/       # 服务层
├── router.ts      # 路由配置
config/
├── config.default.ts  # 默认配置
├── config.local.ts    # 本地配置
├── config.prod.ts     # 生产配置
└── plugin.ts          # 插件配置
typings/
└── index.d.ts         # 类型声明
```

## 环境要求

- Node.js >= 16.0.0
- MongoDB >= 4.0.0
- pnpm >= 8.0.0

## 安装和运行

1. 安装依赖
```bash
pnpm install
```

2. 配置环境变量
创建 `.env` 文件并设置以下变量：
```
MONGODB_URL=mongodb://127.0.0.1:27017/netdisk
JWT_SECRET=your_jwt_secret_key
```

3. 运行服务
```bash
# 开发环境
pnpm run dev

# 生产环境
pnpm start
```

## API 文档

### 认证接口

#### 注册用户
- **URL**: `/api/v1/auth/register`
- **Method**: `POST`
- **请求体**:
```json
{
  "username": "用户名",
  "email": "邮箱",
  "password": "密码"
}
```
- **成功响应** (201):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 用户登录
- **URL**: `/api/v1/auth/login`
- **Method**: `POST`
- **请求体**:
```json
{
  "email": "邮箱",
  "password": "密码"
}
```
- **成功响应** (200):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 获取当前用户信息
- **URL**: `/api/v1/auth/me`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **成功响应** (200):
```json
{
  "success": true,
  "data": {
    "_id": "用户ID",
    "username": "用户名",
    "email": "邮箱",
    "createdAt": "创建时间"
  }
}
```

## 错误处理

所有错误响应的格式如下：
```json
{
  "success": false,
  "error": "错误信息"
}
```

常见错误状态码：
- 400: 请求参数错误
- 401: 未授权访问
- 404: 资源不存在
- 500: 服务器错误

## 安全性

- 使用 bcryptjs 加密用户密码
- JWT 用于用户认证
- 所有敏感信息通过环境变量配置
- 实现了请求参数验证
- 统一的错误处理机制
