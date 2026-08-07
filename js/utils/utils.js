export function showToast(message, isError = false) {
  const existingToast = document.getElementById('dynamic-toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.id = 'dynamic-toast';
  toast.textContent = message;
  
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

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
