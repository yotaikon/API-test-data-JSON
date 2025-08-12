const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 设置字符编码
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// 读取测试数据
let testData = [];
try {
  // 优先读取中文测试数据文件
  let dataPath = path.join(__dirname, 'api_test_data_with_chinese.json');
  if (!fs.existsSync(dataPath)) {
    dataPath = path.join(__dirname, 'api_test_data.json');
  }
  const rawData = fs.readFileSync(dataPath, 'utf8');
  testData = JSON.parse(rawData);
} catch (error) {
  console.error('读取测试数据失败:', error);
  testData = [];
}

// 路由：获取所有用户
app.get('/api/users', (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json({
      success: true,
      message: '获取用户列表成功',
      data: testData,
      total: testData.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取用户列表失败',
      error: error.message
    });
  }
});

// 路由：根据ID获取单个用户
app.get('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const user = testData.find(user => user.id === id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json({
      success: true,
      message: '获取用户成功',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取用户失败',
      error: error.message
    });
  }
});

// 路由：创建新用户
app.post('/api/users', (req, res) => {
  try {
    const { name, age, email, role } = req.body;
    
    // 验证必填字段
    if (!name || !age || !email || !role) {
      return res.status(400).json({
        success: false,
        message: '缺少必填字段'
      });
    }
    
    // 验证年龄范围
    if (age < 18 || age > 65) {
      return res.status(400).json({
        success: false,
        message: '年龄必须在18-65之间'
      });
    }
    
    // 验证角色
    const validRoles = ['admin', 'editor', 'viewer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: '角色必须是 admin、editor 或 viewer 之一'
      });
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '邮箱格式不正确'
      });
    }
    
    // 生成UUID
    const id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    
    const newUser = { id, name, age, email, role };
    testData.push(newUser);
    
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(201).json({
      success: true,
      message: '创建用户成功',
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建用户失败',
      error: error.message
    });
  }
});

// 路由：更新用户
app.put('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, email, role } = req.body;
    
    const userIndex = testData.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 更新字段
    if (name) testData[userIndex].name = name;
    if (age !== undefined) {
      if (age < 18 || age > 65) {
        return res.status(400).json({
          success: false,
          message: '年龄必须在18-65之间'
        });
      }
      testData[userIndex].age = age;
    }
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: '邮箱格式不正确'
        });
      }
      testData[userIndex].email = email;
    }
    if (role) {
      const validRoles = ['admin', 'editor', 'viewer'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: '角色必须是 admin、editor 或 viewer 之一'
        });
      }
      testData[userIndex].role = role;
    }
    
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json({
      success: true,
      message: '更新用户成功',
      data: testData[userIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新用户失败',
      error: error.message
    });
  }
});

// 路由：删除用户
app.delete('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const userIndex = testData.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    const deletedUser = testData.splice(userIndex, 1)[0];
    
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json({
      success: true,
      message: '删除用户成功',
      data: deletedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除用户失败',
      error: error.message
    });
  }
});

// 路由：根据角色筛选用户
app.get('/api/users/role/:role', (req, res) => {
  try {
    const { role } = req.params;
    const validRoles = ['admin', 'editor', 'viewer'];
    
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: '角色必须是 admin、editor 或 viewer 之一'
      });
    }
    
    const filteredUsers = testData.filter(user => user.role === role);
    
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json({
      success: true,
      message: `获取${role}角色用户成功`,
      data: filteredUsers,
      total: filteredUsers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '筛选用户失败',
      error: error.message
    });
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.json({
    success: true,
    message: 'API服务器运行正常',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 API服务器已启动，端口: ${PORT}`);
  console.log(`📊 已加载 ${testData.length} 条测试数据`);
  console.log(`🔗 健康检查: http://localhost:${PORT}/health`);
  console.log(`👥 用户API: http://localhost:${PORT}/api/users`);
});
