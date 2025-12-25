// public/js/charts/scatterChart.js
import * as d3 from "https://cdn.skypack.dev/d3@7";
import { setupCanvas, showTooltip, hideTooltip, formatCurrency } from "../utils.js";
import { state } from "../state.js";
import { METRICS } from "../config.js";

export function renderScatter() {
    // 1. Setup Canvas
    const { svg, width, height } = setupCanvas("#heatmap-container");

    // Jika data kosong, berhenti
    if (!state.filteredData || state.filteredData.length === 0) return;

    // --- OPTIMASI PERFORMA: Sampling Data ---
    // Menggambar 46.000 titik sekaligus akan membuat browser blank/freeze.
    // Kita ambil sampel 2.000 data secara acak agar grafik ringan & muncul.
    let dataToRender = state.filteredData;
    if (dataToRender.length > 2000) {
        dataToRender = [...state.filteredData]
            .sort(() => 0.5 - Math.random())
            .slice(0, 2000);
    }
    
    console.log(`📊 Rendering Scatter: ${dataToRender.length} points (Sample from ${state.filteredData.length})`);
    // -----------------------------------------

    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Definisikan 'Clip Path' agar titik tidak keluar garis saat Zoom
    svg.append("defs").append("clipPath")
        .attr("id", "scatter-clip")
        .append("rect")
        .attr("width", innerWidth)
        .attr("height", innerHeight);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 2. Metrics & Key
    const xKey = state.metric;
    const metricObj = METRICS.find(m => m.key === xKey) || {};
    const labelX = metricObj.label || xKey;

    // 3. Skala (Scales) - Pastikan paksa menjadi angka dengan +d
    const x = d3.scaleLinear()
        .domain(d3.extent(dataToRender, d => +d[xKey])).nice()
        .range([0, innerWidth]);

    const y = d3.scaleLinear()
        .domain(d3.extent(dataToRender, d => +d.sum)).nice()
        .range([innerHeight, 0]);

    const color = d3.scaleSequential(d3.interpolateRdYlGn)
        .domain(d3.extent(dataToRender, d => +d.sum));

    // 4. Gambar Sumbu (Axes)
    const xAxisG = g.append("g").attr("transform", `translate(0,${innerHeight})`);
    const yAxisG = g.append("g");

    const xAxis = d3.axisBottom(x).ticks(5);
    const yAxis = d3.axisLeft(y).ticks(5);

    xAxisG.call(xAxis);
    yAxisG.call(yAxis);

    // Labels
    g.append("text")
        .attr("x", innerWidth / 2).attr("y", innerHeight + 40)
        .attr("fill", "#ccc").style("text-anchor", "middle").style("font-size", "12px")
        .text(labelX);

    g.append("text")
        .attr("transform", "rotate(-90)").attr("y", -45).attr("x", -innerHeight / 2)
        .attr("fill", "#ccc").style("text-anchor", "middle").style("font-size", "12px")
        .text("Total Net Benefit (£)");

    // 5. Gambar Titik (Circles) dengan Clip Path
    const scatterG = g.append("g").attr("clip-path", "url(#scatter-clip)");

    const circles = scatterG.selectAll("circle")
        .data(dataToRender)
        .join("circle")
        .attr("cx", d => x(+d[xKey]))
        .attr("cy", d => y(+d.sum))
        .attr("r", 4)
        .attr("fill", d => color(+d.sum))
        .attr("opacity", 0.6)
        .attr("stroke", "#111")
        .attr("stroke-width", 0.5)
        .style("cursor", "pointer");

    // --- INTERAKSI (Tooltip) ---
    circles
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke", "#fff").attr("stroke-width", 2).attr("opacity", 1).attr("r", 7);
            showTooltip(event, `
                <div style="font-weight:bold; margin-bottom:5px; color:#ffd700;">${d.small_area}</div>
                <div>${metricObj.emoji || ""} ${labelX}: <strong>${formatCurrency(+d[xKey])}</strong></div>
                <div>✨ Total: <strong>${formatCurrency(+d.sum)}</strong></div>
            `);
        })
        .on("mouseout", function() {
            d3.select(this).attr("stroke", "#111").attr("stroke-width", 0.5).attr("opacity", 0.6).attr("r", 4);
            hideTooltip();
        });

    // --- FITUR ZOOM ---
    const zoom = d3.zoom()
        .scaleExtent([0.5, 20])
        .on("zoom", (event) => {
            const newX = event.transform.rescaleX(x);
            const newY = event.transform.rescaleY(y);
            xAxisG.call(xAxis.scale(newX));
            yAxisG.call(yAxis.scale(newY));
            circles.attr("cx", d => newX(+d[xKey])).attr("cy", d => newY(+d.sum));
        });

    svg.append("rect")
        .attr("width", innerWidth).attr("height", innerHeight)
        .style("fill", "none").style("pointer-events", "all")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .call(zoom);
}