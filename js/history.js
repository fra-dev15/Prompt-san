/*======================================
ファイル名：history.js
説明：抽出履歴画面表示用スクリプト
更新日付：2026/8/7
======================================*/

import { showToast } from './utils/utils.js';

function renderHistory() {
  const historyTableBody = document.getElementById('historyTableBody');
  if (!historyTableBody) return;

  const history = JSON.parse(localStorage.getItem('pickstyle_history') || '[]');

  if (history.length === 0) {
    historyTableBody.innerHTML = '<tr><td colspan="2" style="text-align:center;">履歴はありません</td></tr>';
    return;
  }

  historyTableBody.innerHTML = history.map(item => `
    <tr>
      <td>${item.timestamp}</td>
      <td>${item.result}</td>
    </tr>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  // 初回描画
  renderHistory();

  // クリアボタンのイベント
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      if (confirm('履歴をすべて削除しますか？')) {
        localStorage.removeItem('pickstyle_history');
        renderHistory();
        showToast('履歴を削除しました');
      }
    });
  }

  // ★追加：行クリックで抽出結果をコピーする処理
  const historyTableBody = document.getElementById('historyTableBody');
  if (historyTableBody) {
    historyTableBody.addEventListener('click', (e) => {
      const row = e.target.closest('tr');
      if (!row) return;

      const resultCell = row.cells[1];
      if (!resultCell) return;

      const textToCopy = resultCell.textContent.trim();
      if (!textToCopy || textToCopy === '履歴はありません') return;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast(`抽出結果をコピーしました: ${textToCopy}`)
        });
      }
    });
  }

  // メニューアイテムのクリックを監視して、履歴画面が開かれたら再描画
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
      if (item.getAttribute('href') === '#history' || item.dataset.target === 'history-section') {
        renderHistory();
      }
    });
  });
});