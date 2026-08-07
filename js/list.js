const dataTableBody = document.getElementById('dataTableBody');

// データを取得してテーブルを作る関数
async function fetchAndRenderData() {
  try {
    // ローディング中っぽく見せる
    dataTableBody.innerHTML = '<tr><td colspan="2" style="text-align:center;">読み込み中...</td></tr>';

    // APIを叩く
    const response = await fetch('/api/get-all');
    
    if (!response.ok) throw new Error('API通信エラー');
    
    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      // 中身をクリア
      dataTableBody.innerHTML = '';
      
      // 取ってきたデータを1行ずつテーブルに追加していく
        result.data.forEach((item) => {
        const tr = document.createElement('tr');
        // ★ここを追加：コピーするプロンプトの値をデータ属性に持たせる
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
        tdOfficialName.textContent = item.prompt_name || '';
        
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
