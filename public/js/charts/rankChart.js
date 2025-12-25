// public/js/charts/rankChart.js
import * as d3 from "https://cdn.skypack.dev/d3@7";
import { setupCanvas, formatCurrency, showTooltip, hideTooltip } from "../utils.js";
import { state } from "../state.js";

export function renderRank() {
    const { svg, width, height } = setupCanvas("#rank-container");

    const margin = { top: 30, right: 30, bottom: 20, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // 1. Ambil Data
    const data = state.filteredData;
    const rankBy = state.rankBy; // "sum" atau metrik pilihan lain

    // Sortir data (Terbesar ke Terkecil)
    const sorted = [...data].sort((a, b) => b[rankBy] - a[rankBy]);

    // Ambil Top 5 & Bottom 5 (Total 10) agar grafik tidak penuh sesak
    const top5 = sorted.slice(0, 5);
    const bottom5 = sorted.slice(-5);
    
    // Gabungkan dan beri label kategori
    const displayData = [
        ...top5.map(d => ({ ...d, type: "TOP" })),
        ...bottom5.map(d => ({ ...d, type: "BOTTOM" }))
    ];

    // 2. Skala
    const x = d3.scaleLinear()
        .domain(d3.extent(displayData, d => +d[rankBy])).nice()
        .range([0, innerWidth]);
    
    // Titik nol (untuk membedakan positif/negatif)
    const zeroPos = x(0);

    const y = d3.scaleBand()
        .domain(displayData.map(d => d.small_area))
        .range([0, innerHeight])
        .padding(0.3);

    // 3. Gambar Batang
    g.selectAll("rect")
        .data(displayData)
        .join("rect")
        .attr("y", d => y(d.small_area))
        .attr("height", y.bandwidth())
        // Logika Batang Positif vs Negatif
        .attr("x", d => +d[rankBy] >= 0 ? zeroPos : x(+d[rankBy]))
        .attr("width", d => Math.abs(x(+d[rankBy]) - zeroPos))
        .attr("fill", d => d.type === "TOP" ? "#2ecc71" : "#e74c3c") // Hijau vs Merah
        .attr("rx", 3) // Sudut membulat
        .on("mouseover", (event, d) => {
            showTooltip(event, `Area: <strong>${d.small_area}</strong><br>${d.type} Rank<br>Value: ${formatCurrency(+d[rankBy])}`);
            d3.select(event.currentTarget).attr("opacity", 0.7);
        })
        .on("mouseout", (event) => {
            hideTooltip();
            d3.select(event.currentTarget).attr("opacity", 1);
        });

    // 4. Label Sumbu Y (Nama Area)
    g.append("g")
        .call(d3.axisLeft(y).tickSize(0))
        .style("font-size", "10px")
        .select(".domain").remove();

    // 5. Garis Vertikal Nol
    g.append("line")
        .attr("x1", zeroPos).attr("x2", zeroPos)
        .attr("y1", 0).attr("y2", innerHeight)
        .attr("stroke", "#666")
        .attr("stroke-dasharray", "2");
        
    // 6. Label Nilai di ujung batang
    g.selectAll(".val-label")
        .data(displayData)
        .join("text")
        .attr("x", d => +d[rankBy] >= 0 ? x(+d[rankBy]) + 5 : x(+d[rankBy]) - 5)
        .attr("y", d => y(d.small_area) + y.bandwidth() / 2 + 3)
        .style("text-anchor", d => +d[rankBy] >= 0 ? "start" : "end")
        .style("font-size", "9px")
        .style("fill", "#ccc")
        .text(d => formatCurrency(+d[rankBy]));
}