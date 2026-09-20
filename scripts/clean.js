/**
 * 跨平台清理脚本 (scripts/clean.js)
 * 
 * 职责说明：
 * 自动化清理本地构建产物（dist/、dist-v*）、历史调试与验证日志（*.log）以及临时缓存文件，
 * 保持工作树干净清爽，避免本地残留文件误提交或干扰下一次构建。
 */
const fs = require('node:fs');
const path = require('node:path');

// 仓库根目录绝对路径
const rootDir = path.resolve(__dirname, '..');

/**
 * 安全删除指定文件或目录
 * @param {string} targetPath 相对根目录的目标路径
 */
function cleanPath(targetPath) {
  const fullPath = path.join(rootDir, targetPath);
  if (!fs.existsSync(fullPath)) return;

  try {
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`[已清理目录] ${targetPath}`);
    } else {
      fs.rmSync(fullPath, { force: true });
      console.log(`[已清理文件] ${targetPath}`);
    }
  } catch (error) {
    console.warn(`[清理跳过] 无法删除 ${targetPath}: ${error.message}`);
  }
}

/**
 * 主执行函数
 */
function main() {
  console.log('开始清理工作区残留与构建临时文件...');

  // 1. 读取根目录下所有文件与目录
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });

  // 2. 匹配并删除临时构建目录与日志文件
  for (const entry of entries) {
    const name = entry.name;

    // 匹配 dist 或 dist-v 开头的历史打包产物目录
    if (entry.isDirectory() && (name === 'dist' || name.startsWith('dist-v'))) {
      cleanPath(name);
    }

    // 匹配根目录下的日志文件
    if (entry.isFile() && name.endsWith('.log')) {
      cleanPath(name);
    }
  }

  console.log('工作区清理完成。');
}

if (require.main === module) {
  main();
}

module.exports = { cleanPath, main };
