/**
 * 清理脚本单元测试 (test/clean.test.js)
 * 
 * 职责说明：
 * 验证 scripts/clean.js 中的清理逻辑能够正确识别并安全删除临时目录与日志文件，
 * 且在路径不存在时优雅跳过而不抛出异常。
 */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { cleanPath } = require('../scripts/clean');

test('cleanPath 安全处理不存在的路径', () => {
  // 1. 测试不存在的虚构文件路径，验证不会抛出未捕获异常
  assert.doesNotThrow(() => {
    cleanPath('non-existent-file-xyz-123.log');
  });
});

test('cleanPath 能够正确删除指定的临时文件与目录', () => {
  // 1. 在项目根目录下创建专供测试的临时标记文件
  const testFileName = '.test-temp-marker.log';
  const testFilePath = path.resolve(__dirname, '..', testFileName);
  fs.writeFileSync(testFilePath, 'temp content', 'utf8');
  assert.equal(fs.existsSync(testFilePath), true, '临时测试文件应当已创建');

  // 2. 调用清理逻辑
  cleanPath(testFileName);

  // 3. 验证已被彻底删除
  assert.equal(fs.existsSync(testFilePath), false, '临时测试文件应当已被成功清理');
});
