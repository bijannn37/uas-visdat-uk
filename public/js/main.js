// public/js/main.js

// 1. Import Module
import * as d3 from "https://cdn.skypack.dev/d3@7";
import { state, setState } from "./state.js";
import { METRICS } from "./config.js";
import { renderScatter } from "./charts/scatterChart.js";
import { renderHistogram } from "./charts/brushChart.js";
import { renderMeans } from "./charts/meansChart.js";
import { renderRank } from "./charts/rankChart.js";
import { formatCurrency } from "./utils.js";

// 2. Fungsi Utama: Render Ulang Semua Grafik
function updateAllCharts() {
    // 1. Filter Data berdasarkan Brush Histogram
    let activeData = state.allData;
    
    if (state.sumRange) {
        const [min, max] = state.sumRange;
        activeData = activeData.filter(d => +d.sum >= min && +d.sum <= max);
    }

    setState("filteredData", activeData);

    // 2. Render Ulang Semua Grafik
    renderScatter();
    renderMeans();
    renderRank();
    
    // --- 3. LOGIKA AUTO INSIGHT DINAMIS (UPDATE DI SINI) ---
    const insightContainer = d3.select("#story-insight");
    
    if (activeData.length === 0) {
        insightContainer.html("No areas match the selected filter. Try adjusting the brush.");
        return;
    }

    // Ambil metrik yang sedang aktif di dropdown
    const currentMetric = state.metric;
    
    // Hitung Rata-rata
    const avgValue = d3.mean(activeData, d => +d[currentMetric]);

    // Cari Wilayah dengan Nilai Tertinggi (Top Performer)
    const topArea = [...activeData].sort((a, b) => b[currentMetric] - a[currentMetric])[0];

    // Susun Kalimat Insight secara otomatis
    const text = `
        Currently showing <strong>${activeData.length.toLocaleString()}</strong> areas. 
        The average benefit for the selected metric is <strong>${formatCurrency(avgValue)}</strong>. 
        <br><br>
        🌟 <strong>${topArea.small_area}</strong> stands out as the top performer in this group.
    `;

    insightContainer.html(text);
}

// 3. Inisialisasi (Load Data & Setup Event Listener)
async function init() {
    try {
        // Load CSV (Pastikan path sesuai dengan Laravel public folder)
        const rawData = await d3.csv("Level_1.csv"); 
        
        // Simpan ke State
        setState("allData", rawData);
        setState("filteredData", rawData); // Awalnya filtered = semua data

        console.log("✅ Data Loaded:", rawData.length, "rows");

        // Setup Dropdown Metric (Sumbu X Scatter Plot)
        const select = d3.select("#metric-select");
        METRICS.forEach(m => {
            if (!m.isTotal) { // Jangan masukkan 'Sum' ke dropdown X-axis
                select.append("option").text(m.label).attr("value", m.key);
            }
        });

        // Event Listener Dropdown
        select.on("change", function() {
            setState("metric", this.value); // Update state
            renderScatter(); // Hanya perlu render scatter yang berubah sumbu X-nya
        });
        
        // Event Listener Ranking Dropdown
        d3.select("#rank-select").on("change", function() {
            setState("rankBy", this.value);
            renderRank();
        });

        // Render Awal
        // Kirim 'updateAllCharts' sebagai callback ke histogram 
        // agar saat brush digeser, grafik lain ikut update
        renderHistogram(updateAllCharts); 
        
        updateAllCharts(); // Render pertama kali

    } catch (error) {
        console.error("❌ Gagal memuat data:", error);
        document.body.innerHTML = `<h2 style="color:red; text-align:center; margin-top:50px">Gagal memuat data CSV.<br>Cek Console (F12) untuk detail.</h2>`;
    }
}

// Jalankan aplikasi
init();