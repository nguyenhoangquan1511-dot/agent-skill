import fs from 'node:fs';
import path from 'node:path';

/**
 * Copy toàn bộ thư mục skill (skillsSourceDir/*) vào từng target path.
 * Ghi đè nếu skill đã tồn tại. Lỗi ở 1 target không làm dừng các target khác.
 *
 * @param {string[]} targetPaths - danh sách absolute path cần cài skill vào
 * @param {string} skillsSourceDir - thư mục chứa các skill nguồn (mỗi thư mục con là 1 skill)
 * @returns {Array<{targetPath: string, ok: boolean, installedSkills: string[], error?: string}>}
 */
export function installSkills(targetPaths, skillsSourceDir) {
  const skillNames = fs
    .readdirSync(skillsSourceDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  return targetPaths.map((targetPath) => {
    try {
      fs.mkdirSync(targetPath, { recursive: true });
      for (const skillName of skillNames) {
        fs.cpSync(
          path.join(skillsSourceDir, skillName),
          path.join(targetPath, skillName),
          { recursive: true, force: true },
        );
      }
      return { targetPath, ok: true, installedSkills: skillNames };
    } catch (err) {
      return { targetPath, ok: false, installedSkills: [], error: err.message };
    }
  });
}
