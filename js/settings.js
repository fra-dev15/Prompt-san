import { showToast } from './utils/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;

  // 保存されているテーマを適用
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggleBtn.textContent = 'ライトモードに切り替え';
  }

  // ボタンをクリックしたときの処理
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    if (document.body.classList.contains('dark-theme')) {
      localStorage.setItem('theme', 'dark');
      themeToggleBtn.textContent = 'ライトモードに切り替え';
      showToast('ダークモードに切り替えました');
    } else {
      localStorage.setItem('theme', 'light');
      themeToggleBtn.textContent = 'ダークモードに切り替え';
      showToast('ライトモードに切り替えました');
    }
  });
});
