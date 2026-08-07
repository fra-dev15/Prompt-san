const hamburgerBtn = document.getElementById('hamburgerBtn');
const closeBtn = document.getElementById('closeBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuItems = document.querySelectorAll('.menu-item');
const sections = document.querySelectorAll('.content-section');

// メニュー開閉処理
function toggleMenu() {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
}

hamburgerBtn.addEventListener('click', toggleMenu);
closeBtn.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

// 画面切替処理
menuItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    
    // アクティブなメニューの更新
    menuItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    // 表示するセクションの切り替え
    const targetId = item.getAttribute('data-target');
    sections.forEach(sec => {
      if (sec.id === targetId) {
        sec.removeAttribute('hidden');
      } else {
        sec.setAttribute('hidden', 'true');
      }
    });

    // メニューを閉じる
    toggleMenu();
  });
});
