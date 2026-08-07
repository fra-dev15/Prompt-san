const dataTableBody = document.getElementById('dataTableBody');
const API_BASE_URL = 'https://prompt-san.vercel.app';
// const API_BASE_URL = 'https://pick-style.vercel.app';

// データを取得してテーブルを作る関数
async function fetchAndRenderData() {
  try {
    // ローディング中っぽく見せる
    dataTableBody.innerHTML = '<tr><td colspan="2" style="text-align:center;">読み込み中...</td></tr>';

    // APIを叩く
    const response = await fetch(`${API_BASE_URL}/api/get-all`);
    
    if (!response.ok) throw new Error('API通信エラー');
    
    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      // 中身をクリア
      dataTableBody.innerHTML = '';
      
      // 取ってきたデータを1行ずつテーブルに追加していく
      result.data.forEach((item) => {
        const tr = document.createElement('tr');
        
        // コピーするプロンプトの値をデータ属性に持たせる
        const promptValue = item.prompt_name || '';
        tr.setAttribute('data-prompt-value', promptValue);

        // 行をクリックしたときの通知処理
        tr.addEventListener('click', function() {
          const textToCopy = this.getAttribute('data-prompt-value');
          if (!textToCopy) return;

          navigator.clipboard.writeText(textToCopy).then(() => {
            // 「コピーしました」の控えめな通知を表示する関数を呼ぶ
            showToast(`コピーしました: ${textToCopy}`);
          }).catch(err => {
            console.error('コピーに失敗しました: ', err);
            showToast('コピーに失敗しました', true);
          });
        });

        tr.style.cursor = 'pointer';
        
        // 1列目: 要素名 (prompt_name)
        const tdPromptName = document.createElement('td');
        tdPromptName.textContent = item.official_name;
        
        // 2列目: 正式名称 (official_name)
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

// ★ここが抜けてた：画面の右下にトースト通知を出す関数
function showToast(message, isError = false) {
  // すでに古いトーストがあれば消す
  const existingToast = document.getElementById('dynamic-toast');
  if (existingToast) {
    existingToast.remove();
  }

  // トースト用の要素を作成
  const toast = document.createElement('div');
  toast.id = 'dynamic-toast';
  toast.textContent = message;
  
  // スタイルをコード内で直接指定
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.backgroundColor = isError ? '#e74c3c' : '#2ecc71';
  toast.style.color = '#fff';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '6px';
  toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  toast.style.fontSize = '14px';
  toast.style.zIndex = '9999';
  toast.style.transition = 'opacity 0.3s ease';

  document.body.appendChild(toast);

  // 2秒後にフェードアウトさせて消す
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2000);
}

// メニューの「データ一覧」がクリックされた時にだけデータを取得する
const dbMenuBtn = document.querySelector('[data-target="database-section"]');
if (dbMenuBtn) {
  dbMenuBtn.addEventListener('click', () => {
    // まだデータが読み込まれていない（空っぽの）時だけAPIを叩く
    if (dataTableBody.children.length === 0 || dataTableBody.textContent.includes('読み込み中')) {
      fetchAndRenderData();
    }
  });
}
