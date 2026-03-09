#! /usr/bin/env node

/**
 * 技能自动化测试运行器
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { execSync } from 'child_process';

function loadTestCases(projectPath) {
  const testCasePath = join(projectPath, 'tests', 'test-cases.json');
  if (!existsSync(testCasePath)) {
    console.log('❌ 测试用例文件不存在：tests/test-cases.json');
    return null;
  }
  
  try {
    return JSON.parse(readFileSync(testCasePath, 'utf-8'));
  } catch (e) {
    console.log('❌ 测试用例文件格式错误：', e.message);
    return null;
  }
}

function runTestCase(testCase, projectPath) {
  console.log(`\n🧪 运行测试：${testCase.name}`);
  
  try {
    // 执行测试输入
    const output = execSync(testCase.input, { 
      encoding: 'utf-8',
      cwd: projectPath,
      timeout: 5000
    });
    
    // 验证输出
    let passed = true;
    const errors = [];
    
    if (testCase.expectedOutput.contains) {
      for (const expectedText of testCase.expectedOutput.contains) {
        if (!output.includes(expectedText)) {
          passed = false;
          errors.push(`期望包含："${expectedText}"，实际未找到`);
        }
      }
    }
    
    if (testCase.expectedOutput.notContains) {
      for (const unexpectedText of testCase.expectedOutput.notContains) {
        if (output.includes(unexpectedText)) {
          passed = false;
          errors.push(`期望不包含："${unexpectedText}"，实际找到`);
        }
      }
    }
    
    if (testCase.expectedOutput.success !== undefined) {
      const actualSuccess = !output.toLowerCase().includes('error') && !output.toLowerCase().includes('failed');
      if (actualSuccess !== testCase.expectedOutput.success) {
        passed = false;
        errors.push(`期望执行${testCase.expectedOutput.success ? '成功' : '失败'}，实际${actualSuccess ? '成功' : '失败'}`);
      }
    }
    
    return {
      name: testCase.name,
      passed,
      errors,
      output: output.slice(0, 500) + (output.length > 500 ? '...' : '')
    };
    
  } catch (e) {
    return {
      name: testCase.name,
      passed: false,
      errors: [`执行失败：${e.message}`],
      output: e.stdout?.slice(0, 500) || e.stderr?.slice(0, 500) || ''
    };
  }
}

function generateReport(results, projectPath, format = 'markdown') {
  const stats = {
    total: results.length,
    passed: results.filter(r => r.passed).length,
    failed: results.filter(r => !r.passed).length,
    passRate: (results.filter(r => r.passed).length / results.length * 100).toFixed(1) + '%'
  };
  
  let report = '';
  
  if (format === 'markdown') {
    report = `# 测试报告
## 📊 测试统计
| 指标 | 值 |
|------|----|
| 总测试用例 | ${stats.total} |
| 通过 | ${stats.passed} |
| 失败 | ${stats.failed} |
| 通过率 | ${stats.passRate} |

## ❌ 失败的测试用例
${results.filter(r => !r.passed).map(r => `### ${r.name}
- **错误信息**：${r.errors.join('; ')}
- **输出摘要**：
\`\`\`
${r.output}
\`\`\`
`).join('\n')}

## ✅ 通过的测试用例
${results.filter(r => r.passed).map(r => `- ${r.name}`).join('\n')}
`;
  }
  
  // 保存报告
  const reportPath = join(projectPath, 'tests', 'report.md');
  writeFileSync(reportPath, report, 'utf-8');
  
  return { stats, report, reportPath };
}

function showUsage() {
  console.log('🧪 技能自动化测试框架使用方法：');
  console.log('');
  console.log('基础用法：');
  console.log('  test-runner [project-path] [options]');
  console.log('');
  console.log('选项：');
  console.log('  --type <test-type>    测试类型：unit/integration/all（默认：all）');
  console.log('  --format <format>     报告格式：markdown/json/html（默认：markdown）');
  console.log('  --ci                  CI模式，失败时退出码非0');
  console.log('');
  console.log('示例：');
  console.log('  test-runner                            # 测试当前目录的项目');
  console.log('  test-runner ~/skills/git-workflow      # 测试指定项目');
  console.log('  test-runner --type unit --ci           # 仅运行单元测试，CI模式');
  console.log('');
  process.exit(1);
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showUsage();
  }
  
  // 解析参数
  let projectPath = process.cwd();
  if (args[0] && !args[0].startsWith('--')) {
    projectPath = resolve(args[0]);
  }
  
  const typeIndex = args.indexOf('--type');
  const testType = typeIndex > 0 ? args[typeIndex + 1] : 'all';
  
  const formatIndex = args.indexOf('--format');
  const reportFormat = formatIndex > 0 ? args[formatIndex + 1] : 'markdown';
  
  const ciMode = args.includes('--ci');
  
  // 加载测试用例
  const testData = loadTestCases(projectPath);
  if (!testData || !testData.testCases || testData.testCases.length === 0) {
    console.log('❌ 没有找到有效的测试用例');
    process.exit(ciMode ? 1 : 0);
  }
  
  console.log(`🧪 开始测试项目：${projectPath}`);
  console.log(`📋 总测试用例：${testData.testCases.length}个`);
  
  // 运行测试
  const results = [];
  for (const testCase of testData.testCases) {
    // 按测试类型过滤
    if (testType === 'unit' && testCase.type === 'integration') continue;
    if (testType === 'integration' && testCase.type === 'unit') continue;
    
    results.push(runTestCase(testCase, projectPath));
  }
  
  // 生成报告
  const { stats, report, reportPath } = generateReport(results, projectPath, reportFormat);
  
  // 输出结果
  console.log('\n' + '='.repeat(60));
  console.log('📊 测试结果：');
  console.log(`  总用例：${stats.total} | 通过：${stats.passed} | 失败：${stats.failed} | 通过率：${stats.passRate}`);
  console.log('='.repeat(60));
  
  if (stats.failed > 0) {
    console.log('\n❌ 失败的测试用例：');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}: ${r.errors.join(', ')}`);
    });
  }
  
  console.log(`\n📝 详细报告已生成：${reportPath}`);
  
  // CI模式下失败退出
  if (ciMode && stats.failed > 0) {
    process.exit(1);
  }
}

main();
