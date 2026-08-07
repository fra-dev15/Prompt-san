const dataTableBody = document.getElementById('dataTableBody');

// データを取得してテーブルを作る関数
async function fetchAndRenderData() {
  try {
    // ローディング中っぽく見せる
    dataTableBody.innerHTML = '<tr><td colspan="2" style="text-align:center;">読み込み中...</td></tr>';

    // APIを叩く
    const response = await fetch('https://pick-style.vercel.app/api/pickstyle'); // ★全件取得のURLならここを変更
    
    if (!response.ok) throw new Error('API通信エラー');
    
    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      // 中身をクリア
      dataTableBody.innerHTML = '';
      
      // 取ってきたデータを1行ずつテーブルに追加していく
      result.data.forEach((item, index) => {
        const tr = document.createElement('tr');
        
        const tdId = document.createElement('td');
        tdId.textContent = index + 1; // No (連番)
        
        const tdName = document.createElement('td');
        tdName.textContent = item; // 実際のデータ
        
        tr.appendChild(tdId);
        tr.appendChild(tdName);
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
