# 巧克力小镇实施计划

**目标：** 交付可本地打开的 3D 微缩小镇、实拍对照及证据边界说明。

**架构：** 单页静态前端。数据清单独立于几何建模，原始照片只读引用；Node 内置 HTTP 服务器限制访问白名单。

**技术栈：** HTML、CSS、JavaScript、Three.js 0.186.1、Node.js 内置测试。

1. 素材数据：建立 `public/data.js`、`public/photos/` 副本、19 张完整图像索引；测试数量、关联、未定位节点和文件可读。
2. 模型：`public/town.js` 构造建筑、窗口、店牌、鹅卵石、路灯、巴士；每个节点记录关联图片；照片纹理不影响原件。
3. 展示：`public/index.html`、`public/style.css`、`public/app.js`；全貌、档案、说明、侧栏、灯箱、视角预设、亮度和截图。
4. 本地服务：`scripts/server.mjs`、`scripts/start-preview.ps1`；白名单、路径校验、真实随机端口、日志、PID、仅回环监听。
5. 自动测试：`tests/data.test.mjs`、`tests/server.test.mjs`；运行 `npm test`，所有断言通过。
6. 浏览器验证：创建任务独立页面；桌面/手机快照和截图；验证 3D、图片、点击、灯箱、键盘、视角、无错误控制台、无外网请求。
7. 交付：`README.md` 记录启动方式、模型性质、局限、素材索引和测试结果；保留本任务预览服务供用户查看。

当前目录不是 Git 仓库，不自动初始化或创建提交。无可用 worktree，不引入无关仓库。
