// const API_URL = 'https://pick-style.vercel.app/api/pickstyle';
const API_BASE_URL = 'https://prompt-san.vercel.app';

let currentResult = "";

const extractBtn = document.getElementById('extractBtn');
const extractCountInput = document.getElementById('countInput');
const resultArea = document.getElementById('resultArea');
const resultText = document.getElementById('resultText');
const copyBtn = document.getElementById('copyBtn');
const toast = document.getElementById('toast');
const errorArea = document.getElementById('errorArea');

// 入力値の制限 (1〜10) を制御
extractCountInput.addEventListener('input', function() {
  let val = parseInt(this.value, 10);
  if (val > 10) this.value = 10;
  if (val < 1) this.value = 1;
});

// 抽出ボタンクリック処理（API連携）
extractBtn.addEventListener('click', async function() {
  let count = parseInt(extractCountInput.value, 10);
  
  if (isNaN(count) || count < 1) count = 1;
  if (count > 10) count = 10;

  // UIの初期化
  errorArea.textContent = '';
  extractBtn.disabled = true;
  extractBtn.textContent = '抽出中...';

  try {
    // Vercel APIへリクエストを送信
    const response = await fetch(`${API_BASE_URL}/api/pickstyle?count=${count}`);
    
    if (!response.ok) {
      throw new Error('APIからのデータ取得に失敗しました');
    }

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      // ① 取得した要素をカンマ区切りで結合
      currentResult = result.data.join(',') + ',';

      // 画面に表示
      resultText.textContent = currentResult;
      resultArea.style.display = 'flex';
      toast.textContent = '';
      copyBtn.textContent = 'クリップボードにコピー';

      // ★ここで履歴に保存する処理を呼び出す★
      savePickResult(result.data);

    } else {
      throw new Error(result.error || 'データの抽出に失敗しました');
    }
  } catch (err) {
    console.error(err);
    errorArea.textContent = `エラー: ${err.message}`;
    resultArea.style.display = 'none';
  } finally {
    extractBtn.disabled = false;
    extractBtn.textContent = 'ランダムに抽出';
  }
});

// ② コピーボタンクリック処理
copyBtn.addEventListener('click', function() {
  if (!currentResult) return;

  function doCopy() {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(currentResult);
    } else {
      const tempArea = document.createElement('textarea');
      tempArea.value = currentResult;
      document.body.appendChild(tempArea);
      tempArea.select();
      document.execCommand('copy');
      document.body.removeChild(tempArea);
      return Promise.resolve();
    }
  }

  doCopy().then(() => {
    copyBtn.textContent = 'コピー完了！';
    toast.textContent = '✓ クリップボードにコピーしました';
    setTimeout(() => {
      copyBtn.textContent = 'クリップボードにコピー';
      toast.textContent = '';
    }, 2000);
  });
});

/*=================================
抽出結果保存
==================================*/
function savePickResult(extractedItems) {
  // localStorageから現在の履歴を取得（無ければ空配列）
  const history = JSON.parse(localStorage.getItem('pickstyle_history') || '[]');

  // 新しい履歴オブジェクト
  const newEntry = {
    timestamp: new Date().toLocaleString('ja-JP'),
    result: Array.isArray(extractedItems) ? extractedItems.join(', ') : extractedItems
  };

  // 先頭に追加（最新が上にくるように）
  history.unshift(newEntry);

  // 直近50件までに制限
  const updatedHistory = history.slice(0, 50);

  // localStorageに保存
  localStorage.setItem('pickstyle_history', JSON.stringify(updatedHistory));
}
