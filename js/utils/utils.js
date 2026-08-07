export function showToast(message, isError = false) {
  const existingToast = document.getElementById('dynamic-toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.id = 'dynamic-toast';
  toast.textContent = message;

  // ダークモード判定
  const isDark = document.body.classList.contains('dark-theme');

  // スタイル設定（画面中央下・統一デザイン）
  toast.style.position = 'fixed';
  toast.style.bottom = '30px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '20px';
  toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  toast.style.fontSize = '14px';
  toast.style.zIndex = '9999';
  toast.style.whiteSpace = 'nowrap';
  toast.style.transition = 'opacity 0.3s ease';

  // エラー時と通常（ダーク／ライトモード）で背景色・文字色を分岐
  if (isError) {
    toast.style.backgroundColor = '#e74c3c';
    toast.style.color = '#ffffff';
  } else if (isDark) {
    toast.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    toast.style.color = '#111111';
  } else {
    toast.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
    toast.style.color = '#ffffff';
  }

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}