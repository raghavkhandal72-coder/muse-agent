'use strict';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(console.error);
  });
}

let deferredPrompt;
const installBanner = document.getElementById('install-banner');
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBanner) installBanner.style.display = 'flex';
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      installBanner.style.display = 'none';
    }
  });
}

function switchTab(tabId, btnElement) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  btnElement.classList.add('active');
  if (tabId === 'tab-doctor') fetchDoctorReport();
}

async function apiCall(endpoint, data) {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    return { error: err.message };
  }
}

async function runHash() {
  const text = document.getElementById('hash-input').value;
  const res = await apiCall('/api/hash', { text });
  document.getElementById('hash-result').textContent = res.hash || JSON.stringify(res);
}

let lastEncrypted = null;
async function runEncrypt() {
  const text = document.getElementById('crypto-text').value;
  const key = document.getElementById('crypto-key').value;
  const res = await apiCall('/api/encrypt', { text, key });
  lastEncrypted = res;
  document.getElementById('crypto-result').textContent = JSON.stringify(res, null, 2);
}

async function runDecrypt() {
  const key = document.getElementById('crypto-key').value;
  if (!lastEncrypted) return alert('Run Encrypt first!');
  const res = await apiCall('/api/decrypt', { payload: lastEncrypted, key });
  document.getElementById('crypto-result').textContent = res.decrypted || JSON.stringify(res);
}

async function runSanitize() {
  const text = document.getElementById('sanitize-input').value;
  const res = await apiCall('/api/sanitize', { text });
  document.getElementById('sanitize-result').textContent = res.sanitized || JSON.stringify(res);
}

async function runStoreSet() {
  const key = document.getElementById('store-key').value;
  const value = document.getElementById('store-val').value;
  const res = await apiCall('/api/store/set', { key, value });
  document.getElementById('store-result').textContent = JSON.stringify(res, null, 2);
}

async function runStoreGet() {
  const key = document.getElementById('store-key').value;
  const res = await apiCall('/api/store/get', { key });
  document.getElementById('store-result').textContent = JSON.stringify(res, null, 2);
}

async function fetchDoctorReport() {
  const container = document.getElementById('doctor-list');
  try {
    const res = await fetch('/api/doctor');
    const data = await res.json();
    let html = '';
    for (const c of data.checks) {
      html += `
        <div class="doctor-item">
          <div><strong>${c.name}</strong><br><small style="color:#94a3b8;">${typeof c.details === 'object' ? JSON.stringify(c.details) : c.details}</small></div>
          <span class="status-badge">${c.status}</span>
        </div>`;
    }
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = `<div>Error: ${err.message}</div>`;
  }
}
