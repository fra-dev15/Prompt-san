import { showToast } from './utils/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const apiUrlInput = document.getElementById('apiUrlInput');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');

  if (!apiUrlInput || !saveSettingsBtn || !themeToggleBtn) return;

  // --- API URL設定の処理 ---
  const savedApiUrl = localStorage.getItem('custom_api_base_url') || 'https://prompt-san.vercel.app';
  apiUrlInput.value = savedApiUrl;

  saveSettingsBtn.addEventListener('click', () => {
    const newUrl = apiUrlInput.value.trim();
    if (!newUrl) {
      showToast('URLを入力してください', true);
      return;
    }
    localStorage.setItem('custom_api_base_url', newUrl);
    showToast('設定を保存しました！');
  });

  // --- ダークモード設定の処理 ---
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggleBtn.textContent = 'ライトモードに切り替え';
  }

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
