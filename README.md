# 技能自动化测试框架 - 保障技能质量的自动化测试工具 V1.0
## 🎯 项目说明
技能自动化测试框架是专为OpenClaw技能开发的自动化测试工具，支持自动识别测试用例、批量运行测试、生成详细测试报告，帮助开发者快速发现bug，确保技能质量，实现测试驱动开发。

### 解决的核心痛点
- ❌ 手动测试效率低，容易遗漏边界情况
- ❌ 技能迭代后容易出现回归bug
- ❌ 没有统一的测试标准，质量参差不齐
- ❌ 测试结果不透明，难以追溯问题

## ✨ 核心特性
- ✅ 自动识别：自动扫描项目中的tests/test-cases.json测试用例
- ✅ 多类型测试：支持单元测试、集成测试、全量测试
- ✅ 详细报告：生成Markdown/JSON/HTML格式的测试报告
- ✅ CI集成：支持CI模式，测试失败自动返回非0退出码
- ✅ 错误定位：失败用例显示详细错误信息和输出摘要
- ✅ 无缝集成：可直接集成到Git Workflow中，推送前自动运行测试

## 🏗️ 工作原理
```
测试用例编写 → 自动扫描测试用例 → 批量执行测试 → 验证输出结果 → 生成测试报告 → 反馈测试结果
```

## 🚀 安装方式
### 方式1：OpenClaw技能市场安装（推荐）
1. 打开OpenClaw控制面板 → 技能市场
2. 搜索「技能自动化测试框架」
3. 点击「安装」即可自动完成部署

### 方式2：本地安装
```bash
# 1. 下载到技能目录
cd ~/.openclaw/skills
git clone https://github.com/evcgs/skill-testing-framework.git

# 2. 安装全局命令
cd skill-testing-framework
npm link
```

## 📝 使用指南
### 基础用法
```bash
# 测试当前目录的项目
skill-test

# 测试指定项目
skill-test ~/.openclaw/skills/git-workflow

# 仅运行单元测试
skill-test --type unit

# CI模式，失败时退出码非0
skill-test --ci

# 生成JSON格式报告
skill-test --format json
```

### 测试用例编写规范
在项目根目录下创建`tests/test-cases.json`文件：
```json
{
  "testCases": [
    {
      "name": "测试用例名称",
      "type": "unit", // 或 integration
      "input": "要执行的命令",
      "expectedOutput": {
        "success": true, // 期望执行成功还是失败
        "contains": ["期望包含的文本1", "期望包含的文本2"],
        "notContains": ["期望不包含的文本"]
      }
    }
  ]
}
```

## 📋 典型使用场景
### 1. 开发阶段测试
> 开发过程中频繁运行测试，快速发现bug
```bash
skill-test
```

### 2. 提交前自动测试
> 集成到Git Workflow中，提交前自动运行测试，不通过无法提交
```bash
# 在git-workflow中配置，推送前自动运行测试
```

### 3. CI/CD流水线集成
> 集成到CI流水线中，代码提交自动触发测试
```bash
skill-test --ci
```

## 📝 更新日志
### v1.0.0 (2026-03-09)
- ✅ 基础功能：自动识别和运行测试用例
- ✅ 支持多种测试类型：单元测试、集成测试
- ✅ 生成详细的Markdown测试报告
- ✅ 支持CI模式，自动化流水线集成
- ✅ 错误信息详细展示，快速定位问题

## 💬 交流与支持
### 微信交流群
扫码加入用户交流群，获取最新更新、使用技巧和技术支持：
![wxq.jpg](wxq.jpg)
> （群二维码已过期，请添加下方微信备注来意拉群）

### 联系我们
- **微信**：添加微信，备注「测试框架+来意」
![wx.png](wx.png)
