import prompts from 'prompts';
import { TOOLS } from './tool-paths.js';

/**
 * Hỏi user chọn agent tool(s) muốn cài skill (multi-select, bắt buộc chọn ít nhất 1).
 *
 * @returns {Promise<string[]>} danh sách tool id đã chọn; mảng rỗng nếu user hủy prompt
 */
export async function promptToolSelection() {
  const response = await prompts({
    type: 'multiselect',
    name: 'tools',
    message: 'Chọn agent tool muốn cài skill',
    choices: TOOLS.map((tool) => ({ title: tool.label, value: tool.id })),
    min: 1,
  });

  return response.tools ?? [];
}

/**
 * Hỏi user chọn phạm vi cài đặt: project (local) hay global (home directory).
 *
 * @returns {Promise<'local'|'global'|undefined>} scope đã chọn; undefined nếu user hủy prompt
 */
export async function promptScope() {
  const response = await prompts({
    type: 'select',
    name: 'scope',
    message: 'Cài vào Project (thư mục hiện tại) hay Global (home directory)?',
    choices: [
      { title: 'Project (thư mục hiện tại)', value: 'local' },
      { title: 'Global (home directory)', value: 'global' },
    ],
  });

  return response.scope;
}
