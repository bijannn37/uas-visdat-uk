// public/js/state.js

// Object utama untuk menyimpan status aplikasi
export const state = {
    allData: [],        // Menyimpan data mentah lengkap dari CSV
    filteredData: [],   // Data yang aktif saat ini (setelah di-filter brush/search)
    
    // Default settings saat web pertama dibuka
    metric: "physical_activity", // Pilihan default dropdown
    rankBy: "sum",               // Pilihan default ranking
    rankView: "both",            // Tampilan ranking ('top', 'bottom', atau 'both')
    sumRange: null               // Filter range dari histogram [min, max]
};

// Fungsi helper untuk mengubah isi state
// Gunakan ini daripada mengubah variable langsung agar lebih aman
export function setState(key, value) {
    // Cek apakah key yang mau diubah ada di dalam state
    if (Object.prototype.hasOwnProperty.call(state, key)) {
        state[key] = value;
    } else {
        console.warn(`⚠️ Warning: Key '${key}' tidak ditemukan di state.`);
        // Tetap simpan meski warning (opsional, untuk fleksibilitas)
        state[key] = value;
    }
}