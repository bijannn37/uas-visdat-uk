// public/js/utils.js
import * as d3 from "https://cdn.skypack.dev/d3@7";

// --- 1. FORMATTER ANGKA ---
// Format mata uang GBP (£)
export const formatCurrency = d3.format("$.2f"); 

// Format angka desimal biasa
export const formatNumber = d3.format(".2f");


// --- 2. SKALA WARNA (COLOR SCALES) ---
export const colorScale = d3.scaleDiverging(d3.interpolateSpectral)
    .domain([-2, 0, 2]); 


// --- 3. SETUP CANVAS (RESPONSIF) ---
export function setupCanvas(containerId) {
    const container = d3.select(containerId);
    
    // Hapus isi lama agar tidak menumpuk
    container.selectAll("*").remove();

    const boundingBox = container.node().getBoundingClientRect();
    const width = boundingBox.width || 400;
    const height = boundingBox.height || 300;

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("max-width", "100%")
        .style("height", "auto")
        .style("overflow", "visible");

    return { svg, width, height };
}

// --- 4. TOOLTIP HELPERS (INI YANG TADI HILANG) ---
// Kita ambil elemen div id="tooltip" yang ada di HTML
const tooltip = d3.select("#tooltip");

export function showTooltip(event, content) {
    tooltip.style("opacity", 1)
        .html(content)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 10) + "px");
}

export function hideTooltip() {
    tooltip.style("opacity", 0);
}