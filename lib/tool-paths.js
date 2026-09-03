import path from 'node:path';

// Danh sách agent tool hỗ trợ cài skill, kèm đường dẫn thư mục skill
// tương ứng ở phạm vi local (project hiện tại) và global (home directory).
// omp (Oh-My-Pi) dùng thư mục riêng `.agents/skills/<tên-skill>/SKILL.md`
// (không dùng chung path với pi).
export const TOOLS = [
  { id: 'codex', label: 'Codex', localDir: '.codex/skills', globalDir: '.codex/skills' },
  { id: 'claude', label: 'Claude', localDir: '.claude/skills', globalDir: '.claude/skills' },
  { id: 'pi', label: 'Pi', localDir: '.pi/agent/skills', globalDir: '.pi/agent/skills' },
  { id: 'omp', label: 'Oh-My-Pi (omp)', localDir: '.agents/skills', globalDir: '.agents/skills' },
  { id: 'commandcode', label: 'CommandCode', localDir: '.commandcode/skills', globalDir: '.commandcode/skills' },
];

/**
 * Tính danh sách target path (absolute, đã dedupe) cho các tool đã chọn.
 *
 * @param {string[]} selectedToolIds - id của các tool user đã chọn
 * @param {'local'|'global'} scope - phạm vi cài đặt
 * @param {string} cwd - thư mục hiện tại, dùng khi scope là 'local'
 * @param {string} homeDir - home directory, dùng khi scope là 'global'
 * @returns {string[]} danh sách absolute path duy nhất (không trùng lặp)
 */
export function resolveTargetPaths(selectedToolIds, scope, cwd, homeDir) {
  const baseDir = scope === 'global' ? homeDir : cwd;
  const paths = new Set();

  for (const toolId of selectedToolIds) {
    const tool = TOOLS.find((t) => t.id === toolId);
    if (!tool) continue;
    const relativeDir = scope === 'global' ? tool.globalDir : tool.localDir;
    paths.add(path.join(baseDir, relativeDir));
  }

  return Array.from(paths);
}
