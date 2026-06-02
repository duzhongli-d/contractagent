# Next.js 到 FastAPI 迁移项目提示词

## 项目目标
将Next.js全栈系统重构为前后端分离架构：
- **后端**：Next.js API Routes → FastAPI
- **前端**：Next.js → 独立前端应用

## 核心任务

### 阶段1：系统分析
1. 分析当前项目的API路由（`pages/api/` 或 `app/api/`）
2. 识别数据库模型和业务逻辑
3. 梳理前端组件结构和API调用方式
4. 提取认证授权机制

### 阶段2：FastAPI后端开发
1. **项目结构**
   ```
   backend/
   ├── app/
   │   ├── main.py           # FastAPI应用入口
   │   ├── models/           # 数据模型
   │   ├── routers/          # API路由
   │   ├── schemas/          # Pydantic模式
   │   ├── services/         # 业务逻辑
   │   └── config.py         # 配置
   ├── requirements.txt
   └── Dockerfile
   ```

2. **核心功能**
   - 将所有Next.js API路由转换为FastAPI routers
   - 保持接口输入输出格式完全一致
   - 实现数据库连接和ORM迁移
   - 配置JWT认证和安全依赖
   - 添加CORS和中间件支持
   - 生成Swagger API文档

### 阶段3：前端改造
1. **项目结构**
   ```
   frontend/
   ├── src/
   │   ├── services/         # API客户端
   │   ├── types/           # TypeScript类型
   │   ├── components/      # 组件
   │   └── pages/          # 页面
   ├── next.config.js
   └── package.json
   ```

2. **关键改造**
   - 创建统一的axios API客户端（配置baseURL）
   - 实现请求拦截器（token自动添加、刷新机制）
   - 更新所有API调用以使用FastAPI接口
   - 保持认证流程和状态管理不变
   - 确保组件功能完全兼容


### 阶段4：部署配置
1. **后端部署**
   - 创建Dockerfile和docker-compose.yml
   - 配置环境变量和数据库连接

2. **前端部署**
   - 配置NEXT_PUBLIC_API_URL环境变量
   - 优化构建配置

### 阶段5：部署配置
   
   文件归类原则
配置文件：根目录或 config/ 目录
文档：docs/ 目录，包含说明文档、API文档
资源文件：public/ 或 assets/ 目录
测试文件：tests/ 或 tests/ 目录

## 交付要求

### 代码交付物
1. **FastAPI后端**
   - 完整的后端代码（所有API路由、模型、业务逻辑）
   - 数据库迁移文件
   - Docker部署配置
   - API文档

2. **改造的前端**
   - 独立的Next.js应用
   - 统一的API服务层
   - 类型定义文件

3. **部署文档**
   - 详细的部署步骤
   - 环境配置说明

### 关键要求
- **接口兼容性**：前端调用方式保持不变
- **功能完整性**：所有原有功能正常工作
- **项目结构清晰**：建立清晰、有序、高效的项目文件结构


请严格按照以上要求执行，确保前后端接口完美兼容，并提供完整的部署和使用文档。