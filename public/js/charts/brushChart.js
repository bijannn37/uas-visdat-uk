// public/js/charts/brushChart.js
import * as d3 from "https://cdn.skypack.dev/d3@7";
import { setupCanvas } from "../utils.js";
import { state, setState } from "../state.js";

// Fungsi render ini menerima parameter 'updateCallback'
// 'updateCallback' adalah fungsi yang akan dipanggil setiap kali user selesai menggeser brush
export function renderHistogram(updateCallback) {
    const { svg, width, height } = setupCanvas("#histogram-container");

    const margin = { top: 10, right: 20, bottom: 25, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // 1. Data: Gunakan ALL DATA (bukan filtered) untuk background histogram
    const data = state.allData;

    // 2. Skala X (Total Benefit)
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => +d.sum))
        .range([0, innerWidth]);

    // 3. Buat Bin (Kelompokkan data jadi batang-batang)
    const histogram = d3.bin()
        .value(d => +d.sum)
        .domain(x.domain())
        .thresholds(x.ticks(40)); // Jumlah batang

    const bins = histogram(data);

    // 4. Skala Y (Jumlah Wilayah per Bin)
    const y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .range([innerHeight, 0]);

    // 5. Gambar Batang
    g.selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("x", 1)
        .attr("transform", d => `translate(${x(d.x0)}, ${y(d.length)})`)
        .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr("height", d => innerHeight - y(d.length))
        .style("fill", "#6366f1") // Warna Ungu
        .style("opacity", 0.8);

    // Axis Bawah
    g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0))
        .style("font-size", "10px");

    // --- LOGIKA BRUSH (ALAT FILTER) ---
    const brush = d3.brushX()
        .extent([[0, 0], [innerWidth, innerHeight]])
        .on("end", function(event) {
            // Jika user klik kosong (clear selection)
            if (!event.selection) {
                setState("sumRange", null);
            } else {
                // Konversi posisi pixel (px) ke nilai data (angka)
                const [x0, x1] = event.selection;
                const minVal = x.invert(x0);
                const maxVal = x.invert(x1);
                
                // Simpan filter ke Global State
                setState("sumRange", [minVal, maxVal]);
            }
            
            // PENTING: Panggil fungsi updateAllCharts di main.js
            if (updateCallback) updateCallback();
        });

    const brushG = g.append("g").call(brush);

    // Pertahankan posisi brush jika grafik dirender ulang
    if (state.sumRange) {
        brushG.call(brush.move, [
            x(state.sumRange[0]),
            x(state.sumRange[1])
        ]);
    }
}