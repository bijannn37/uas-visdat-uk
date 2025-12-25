// public/js/charts/meansChart.js
import * as d3 from "https://cdn.skypack.dev/d3@7";
import { setupCanvas, formatCurrency } from "../utils.js";
import { state } from "../state.js";
import { METRICS } from "../config.js";

export function renderMeans() {
    const { svg, width, height } = setupCanvas("#means-container");

    const margin = { top: 20, right: 30, bottom: 20, left: 120 }; // Kiri lebar untuk label teks
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // 1. Hitung Rata-rata dari Data yang AKTIF (Filtered)
    const data = state.filteredData;
    
    // Siapkan array data untuk grafik
    const aggregated = METRICS
        .filter(m => !m.isTotal) // Jangan masukkan "Sum"
        .map(m => {
            return {
                label: m.label,
                key: m.key,
                value: d3.mean(data, d => +d[m.key]) || 0 // Hitung rata-rata
            };
        })
        .sort((a, b) => b.value - a.value); // Urutkan dari terbesar

    // 2. Skala
    const x = d3.scaleLinear()
        .domain(d3.extent(aggregated, d => d.value)).nice()
        .range([0, innerWidth]);

    // Jika ada nilai negatif, geser titik 0 ke tengah/sesuai data
    const zeroPos = x(0);

    const y = d3.scaleBand()
        .domain(aggregated.map(d => d.label))
        .range([0, innerHeight])
        .padding(0.2);

    // 3. Gambar Batang
    g.selectAll("rect")
        .data(aggregated)
        .join("rect")
        .attr("y", d => y(d.label))
        .attr("height", y.bandwidth())
        // Logika Batang Positif vs Negatif
        .attr("x", d => d.value >= 0 ? zeroPos : x(d.value))
        .attr("width", d => Math.abs(x(d.value) - zeroPos))
        .attr("fill", d => d.value >= 0 ? "#4ade80" : "#f87171") // Hijau vs Merah
        .attr("opacity", 0.8);

    // 4. Garis Vertikal di titik 0
    g.append("line")
        .attr("x1", zeroPos).attr("x2", zeroPos)
        .attr("y1", 0).attr("y2", innerHeight)
        .attr("stroke", "#fff")
        .attr("stroke-dasharray", "4");

    // 5. Label Sumbu Y (Teks Kategori)
    g.append("g")
        .call(d3.axisLeft(y).tickSize(0))
        .style("font-size", "11px")
        .select(".domain").remove(); // Hapus garis sumbu Y biar bersih

    // 6. Label Angka di ujung batang
    g.selectAll(".val-label")
        .data(aggregated)
        .join("text")
        .attr("class", "val-label")
        .attr("x", d => d.value >= 0 ? x(d.value) + 5 : x(d.value) - 5)
        .attr("y", d => y(d.label) + y.bandwidth() / 2 + 4)
        .style("text-anchor", d => d.value >= 0 ? "start" : "end")
        .style("font-size", "10px")
        .style("fill", "#ccc")
        .text(d => formatCurrency(d.value));
}