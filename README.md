# API测试服务器

这是一个用于测试API接口的Node.js服务器，提供了完整的用户管理CRUD操作。

## 提示词

```bash
我需要为我的API生成5条测试数据。
请以JSON数组的格式提供，每个对象必须包含：id，name，age，email，role
规则：
id 字段：UUID 字符串
name 字段：常见英文名
email 字段：格式正确的邮箱
age 字段：18-65之间的整数
role 字段 : "admin", "editor", "viewer"枚举值

请给我一个API接口，进行测试
```

## 功能特性

- ✅ 获取所有用户列表
- ✅ 根据ID获取单个用户
- ✅ 创建新用户
- ✅ 更新用户信息
- ✅ 删除用户
- ✅ 根据角色筛选用户
- ✅ 数据验证（年龄、邮箱、角色）
- ✅ 健康检查接口
- ✅ CORS支持

## 安装依赖

```bash
npm install
```

## 启动服务器

### 开发模式（自动重启）
```bash
npm run dev
```

### 生产模式
```bash
npm start
```

服务器将在 `http://localhost:3000` 启动

## API接口文档

### 1. 健康检查
- **GET** `/health`
- 检查服务器运行状态

### 2. 获取所有用户
- **GET** `/api/users`
- 返回所有用户列表

### 3. 获取单个用户
- **GET** `/api/users/:id`，例:http://localhost:3000/api/users/6ba7b810-9dad-11d1-80b4-00c04fd430c8
- 根据用户ID获取用户信息

### 4. 创建用户
- **POST** `/api/users`
- 请求体示例：
```json
{
  "name": "张三",
  "age": 25,
  "email": "zhangsan@example.com",
  "role": "editor"
}
```
- 命令示例：
```
$body = @{
    name = "老八"
    age = 59
    email = "laoba@example.com"
    role = "editor"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method Post -Body $body -ContentType "application/json"
```

### 5. 更新用户
- **PUT** `/api/users/:id`
- 支持部分字段更新

### 6. 删除用户
- **DELETE** `/api/users/:id`
- 根据ID删除用户

### 7. 按角色筛选用户
- **GET** `/api/users/role/:role`
- 支持：admin、editor、viewer

## 测试数据

服务器启动时会自动加载 `api_test_data.json` 文件中的5条测试数据。

## 使用方法

- 双击打开 test.html 文件
- 确保API服务器运行在 http://localhost:3000
- 测试中文名字：
1. 创建用户时输入中文名字
2. 更新用户时修改为中文名字
- 查看是否正确显示
- ✅ 测试建议：
- 创建用户：输入中文名字如"张三"、"李四"
- 更新用户：将现有用户名字改为中文
- 验证显示：检查是否还有问号显示

## 数据验证规则

- **name**: 必填，字符串
- **age**: 必填，18-65之间的整数
- **email**: 必填，有效的邮箱格式
- **role**: 必填，必须是 "admin"、"editor" 或 "viewer" 之一
- **id**: 自动生成，UUID格式

## 响应格式

所有API接口都返回统一的响应格式：

```json
{
  "success": true,
  "message": "操作成功",
  "data": {...},
  "total": 5
}
```

## 错误处理

- 400: 请求参数错误
- 404: 资源不存在
- 500: 服务器内部错误

## 测试建议

1. 使用Postman或类似工具测试API
2. 测试各种边界情况（无效年龄、错误邮箱格式等）
3. 验证数据验证逻辑
4. 测试CRUD操作的完整性