---
name: skill-testing-framework
description: 技能自动化测试框架 - 自动运行技能测试用例，生成测试报告
category: 开发工具
tags: ["测试", "自动化", "质量保证"]
version: 1.0.0
author: OpenClaw Community
minimum_openclaw_version: 1.0.0
skill_type: tool-enhanced
dependencies:
  - git-workflow
permissions:
  - file:read
  - file:write
  - exec
---

# 技能自动化测试框架
## 描述
自动化测试框架，支持自动识别项目中的测试用例，批量运行测试，生成详细的测试报告，确保技能质量。

## 触发条件
当用户说"运行测试"、"测试技能"、"test"时触发，或在git-workflow推送前自动触发。

## 输入参数
| 参数名 | 类型 | 是否必填 | 描述 | 示例 |
|--------|------|----------|------|------|
| projectPath | string | 否 | 要测试的项目路径，默认当前目录 | ~/.openclaw/skills/git-workflow |
| testType | string | 否 | 测试类型：unit/integration/all，默认all | unit |
| reportFormat | string | 否 | 报告格式：json/markdown/html，默认markdown | markdown |

## 执行流程
1. 扫描指定目录下的tests/test-cases.json文件
2. 解析测试用例，分类为单元测试、集成测试
3. 按顺序运行所有测试用例
4. 记录测试结果（通过/失败/跳过）
5. 生成测试报告
6. 返回测试结果和通过率

## 输出格式
```
🧪 测试结果报告
====================
📊 统计信息：
  总测试用例：10
  通过：9
  失败：1
  跳过：0
  通过率：90%

❌ 失败的测试用例：
  1. 技能ID重复测试 - 期望返回错误信息，实际返回成功
     输入：skill create existing-skill "已存在的技能" "测试" 测试分类
     期望输出：包含"技能ID已存在"
     实际输出："创建成功"

✅ 测试报告已生成：tests/report.md
```

## 错误处理
- 测试用例文件不存在：提示用户创建测试用例
- 测试执行失败：显示详细错误信息，不中断其他测试
- 报告生成失败：返回纯文本测试结果
