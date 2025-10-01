// Elemen DOM
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');
const uppercaseCheckbox = document.getElementById('uppercase');
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');
const customCharsInput = document.getElementById('customChars');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const passwordDisplay = document.getElementById('passwordDisplay');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const historyCount = document.getElementById('historyCount');
const toast = document.getElementById('toast');

// Karakter yang digunakan untuk membuat password
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '0123456789';
const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Riwayat password
let passwordHistory = JSON.parse(localStorage.getItem('passwordHistory')) || [];

// Inisialisasi
function init() {
    updateLengthValue();
    loadPasswordHistory();
    createParticlesBackground(); // Tambahkan ini
    generateBtn.click();
}

// Update nilai panjang password saat slider digerakkan
lengthSlider.addEventListener('input', updateLengthValue);

function updateLengthValue() {
    lengthValue.textContent = lengthSlider.value;
}

// Fungsi untuk menghasilkan password
function generatePassword() {
    const length = parseInt(lengthSlider.value);
    let charPool = '';
    let password = '';
    
    // Membuat kumpulan karakter berdasarkan pilihan pengguna
    if (uppercaseCheckbox.checked) charPool += uppercaseChars;
    if (lowercaseCheckbox.checked) charPool += lowercaseChars;
    if (numbersCheckbox.checked) charPool += numberChars;
    if (symbolsCheckbox.checked) charPool += symbolChars;
    
    // Menambahkan karakter kustom jika ada
    const customChars = customCharsInput.value.trim();
    if (customChars) {
        charPool += customChars;
    }
    
    // Memastikan setidaknya satu jenis karakter dipilih
    if (charPool === '') {
        showToast('Pilih setidaknya satu jenis karakter!', 'error');
        return '';
    }
    
    // Membuat password dengan karakter acak
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charPool.length);
        password += charPool[randomIndex];
    }
    
    return password;
}

// Fungsi untuk mengevaluasi kekuatan password
function checkPasswordStrength(password) {
    let score = 0;
    const suggestions = [];
    
    // Kriteria penilaian
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    // Saran perbaikan
    if (password.length < 8) {
        suggestions.push('Gunakan minimal 8 karakter');
    }
    if (!/[A-Z]/.test(password)) {
        suggestions.push('Tambahkan huruf kapital');
    }
    if (!/[a-z]/.test(password)) {
        suggestions.push('Tambahkan huruf kecil');
    }
    if (!/[0-9]/.test(password)) {
        suggestions.push('Tambahkan angka');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        suggestions.push('Tambahkan simbol');
    }
    
    // Menentukan level kekuatan
    let strength, color;
    if (score <= 2) {
        strength = 'Sangat Lemah';
        color ='#e74c3c';
    } else if (score <= 3) {
        strength = 'Lemah';
        color = '#f77300ff';
    } else if (score <= 5) {
        strength = 'Cukup';
        color = ('#dc3825ff');
    } else if (score <= 6) {
        strength = 'Kuat';
        color = '#27ae60';
    } else {
        strength = 'Sangat Kuat';
        color =('#27ae60');
    }
    
    // Menghitung persentase kekuatan
    const percentage = Math.min((score / 7) * 100, 100);
    
    return { strength, color, percentage, suggestions };
}

// Fungsi untuk memperbarui tampilan kekuatan password
function updateStrengthDisplay(password) {
    if (!password) {
        strengthFill.style.width = '0%';
        strengthText.textContent = 'Kekuatan: -';
        strengthText.style.color = '#666';
        return;
    }
    
    const { strength, color, percentage, suggestions } = checkPasswordStrength(password);
    
    strengthFill.style.width = `${percentage}%`;
    strengthFill.style.backgroundColor = color;
    strengthText.textContent = `Kekuatan: ${strength}`;
    strengthText.style.color = color;
    
    // Menampilkan saran jika password lemah
    if (suggestions.length > 0 && strength.includes('Lemah')) {
        strengthText.textContent += ` | Saran: ${suggestions[0]}`;
    }
}

// Fungsi untuk memuat riwayat password
function loadPasswordHistory() {
    historyList.innerHTML = '';
    passwordHistory.forEach((password, index) => {
        addHistoryItem(password, index);
    });
    updateHistoryCount();
}

// Fungsi untuk menambahkan password ke riwayat
function addToHistory(password) {
    // Hindari duplikat
    if (passwordHistory.includes(password)) {
        return;
    }
    
    // Membatasi riwayat hingga 10 item
    if (passwordHistory.length >= 10) {
        passwordHistory.pop();
    }
    
    // Tambahkan ke awal array
    passwordHistory.unshift(password);
    
    // Simpan ke localStorage
    localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
    
    // Perbarui tampilan
    loadPasswordHistory();
}

// Fungsi untuk menambahkan item ke daftar riwayat
function addHistoryItem(password, index) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const passwordSpan = document.createElement('span');
    passwordSpan.className = 'history-password';
    passwordSpan.textContent = password;
    
    const copyButton = document.createElement('button');
    copyButton.className = 'history-copy';
    copyButton.innerHTML = '📋 Salin';
    copyButton.addEventListener('click', function() {
        copyToClipboard(password);
        showToast('Password berhasil disalin dari riwayat!');
    });
    
    historyItem.appendChild(passwordSpan);
    historyItem.appendChild(copyButton);
    historyList.appendChild(historyItem);
}

// Fungsi untuk memperbarui jumlah riwayat
function updateHistoryCount() {
    historyCount.textContent = passwordHistory.length;
}

// Fungsi untuk menyalin teks ke clipboard
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Gagal menyalin teks: ', err);
    }
    
    document.body.removeChild(textarea);
}

// Fungsi untuk menampilkan notifikasi toast
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = 'toast';
    
    // Mengubah warna berdasarkan jenis pesan
    if (type === 'error') {
        toast.classList.add('error');
    } else {
        toast.classList.add('show');
    }
    
    // Menyembunyikan toast setelah 3 detik
    setTimeout(() => {
        toast.classList.remove('show', 'error');
    }, 3000);
}

// Event listener untuk tombol generate
generateBtn.addEventListener('click', function() {
    const password = generatePassword();
    if (password) {
        passwordDisplay.textContent = password;
        updateStrengthDisplay(password);
        addToHistory(password);
    }
});

// Event listener untuk tombol salin
copyBtn.addEventListener('click', function() {
    const password = passwordDisplay.textContent;
    if (password && password !== 'Klik tombol "Generate Password"') {
        copyToClipboard(password);
        showToast('Password berhasil disalin!');
    } else {
        showToast('Tidak ada password untuk disalin!', 'error');
    }
});

// Event listener untuk tombol hapus riwayat
clearHistoryBtn.addEventListener('click', function() {
    if (passwordHistory.length > 0) {
        passwordHistory = [];
        localStorage.removeItem('passwordHistory');
        loadPasswordHistory();
        showToast('Riwayat password telah dihapus!');
    } else {
        showToast('Tidak ada riwayat untuk dihapus!', 'error');
    }
});

// Event listener untuk input karakter kustom
customCharsInput.addEventListener('input', function() {
    // Generate ulang password jika ada perubahan
    if (passwordDisplay.textContent !== 'Klik tombol "Generate Password"') {
        generateBtn.click();
    }
});

// Event listener untuk checkbox
[uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, symbolsCheckbox].forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        // Generate ulang password jika ada perubahan
        if (passwordDisplay.textContent !== 'Klik tombol "Generate Password"') {
            generateBtn.click();
        }
    });
});

// Background Particles Effect
function createParticlesBackground() {
    const particlesContainer = document.createElement('div');
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    document.body.appendChild(particlesContainer);

    // Create particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 20 + 10}s infinite linear;
        `;
        
        // Add keyframes for animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0% {
                    transform: translate(0, 0) rotate(0deg);
                }
                25% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(90deg);
                }
                50% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg);
                }
                75% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(270deg);
                }
                100% {
                    transform: translate(0, 0) rotate(360deg);
                }
            }
        `;
        document.head.appendChild(style);
        
        particlesContainer.appendChild(particle);
    }
}

// Inisialisasi aplikasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', init);