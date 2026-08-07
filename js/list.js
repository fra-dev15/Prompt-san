import { showToast } from './utils/utils.js';

const dataTableBody = document.getElementById('dataTableBody');
const API_BASE_URL = 'https://prompt-san.vercel.app';

async function fetchAndRenderData() {
  try {
    dataTableBody.innerHTML = '<tr><td colspan="2" style="text-align:center;">読み込み中...</td></tr>';
    const response = await fetch(`${API_BASE_URL}/api/get-all`);
    if (!response.ok) throw new Error('API通信エラー');
    
    const result = await response.json();
    if (result.success && Array.isArray(result.data)) {
      dataTableBody.innerHTML = '';
      
      result.data.forEach((item) => {
        const tr = document.createElement('tr');
        const promptValue = item.prompt_name || '';
        tr.setAttribute('data-prompt-value', promptValue);

        tr.addEventListener('click', function() {
          const textToCopy = this.getAttribute('data-prompt-value');
          if (!textToCopy) return;

          navigator.clipboard.writeText(textToCopy).then(() => {
            showToast(`コピーしました: ${textToCopy}`);
          }).catch(err => {
            console.error('コピーに失敗しました: ', err);
            showToast('コピーに失敗しました', true);
          });
        });

        tr.style.cursor = 'pointer';
        
        const tdPromptName = document.createElement('td');
        tdPromptName.textContent = item.official_name;
        
        const tdOfficialName = document.createElement('td');
        tdOfficialName.textContent = promptValue;
        
        tr.appendChild(tdPromptName);
        tr.appendChild(tdOfficialName);
        dataTableBody.appendChild(tr);
      });
    } else {
      throw new Error('データの形式がおかしいよ');
    }
  } catch (error) {
    console.error('データ取得エラー:', error);
    dataTableBody.innerHTML = `<tr><td colspan="2" style="color:red; text-align:center;">エラー: ${error.message}</td></tr>`;
  }
}

function initDatabaseView() {
  if (!dataTableBody) return;
  if (dataTableBody.children.length === 0 || dataTableBody.textContent.includes('読み込み中')) {
    fetchAndRenderData();
  }
}

const dbMenuBtn = document.querySelector('[data-target="database-section"]');
if (dbMenuBtn) {
  dbMenuBtn.addEventListener('click', initDatabaseView);
}

document.addEventListener('DOMContentLoaded', () => {
  const dbSection = document.getElementById('database-section');
  if (dbSection && !dbSection.hasAttribute('hidden')) {
    initDatabaseView();
  }
});
