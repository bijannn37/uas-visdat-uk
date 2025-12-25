<!DOCTYPE html>
<html lang="en">
<head>
    <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>

<script>
  // Fungsi Sederhana untuk Export PNG
  function exportToPNG() {
    // Sembunyikan sidebar sebentar saat screenshot (opsional)
    const sidebar = document.querySelector('.sidebar-panel');
    const btn = document.querySelector('button[onclick="exportToPNG()"]');
    
    btn.innerText = "Capturing...";
    
    html2canvas(document.body).then(canvas => {
      // Buat link download palsu
      const link = document.createElement('a');
      link.download = 'dashboard-analysis.png';
      link.href = canvas.toDataURL();
      link.click();
      
      btn.innerText = "Export PNG";
    });
  }
</script>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>UK Climate Co‑Benefits Dashboard</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Roboto:wght@400;500&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="{{ asset('style.css') }}" />
</head>
<body>
  <div class="container">

    <aside class="sidebar-panel">
      <header class="sidebar-header">
        <h1>Co‑Benefits Atlas</h1>
        <p>Communicate the co‑benefits of climate action (UK, 46,426 small areas)</p>
      </header>

      <div class="controls-wrapper">
        
        <div class="control-section">
          <div class="control-section-title">AUDIENCE & MESSAGE</div>
          <div class="callout">
            <div class="callout-title">For local councils 🏛️</div>
            <div class="callout-text">
              Where do climate actions deliver the biggest <strong>everyday benefits</strong>?
              Start with <strong>clean air</strong> and <strong>active travel</strong>.
              Use the controls below to identify priority areas.
            </div>
          </div>
        </div>
        
        <div class="control-section">
          <div class="control-section-title">AUTO INSIGHT</div>
          <div id="story-insight" class="insight">
            <em>Loading data...</em>
          </div>
        </div>

        <div class="control-section">
          <div class="control-section-title">MAIN CONTROLS</div>

          <div class="control-group">
            <label for="metric-select">Focus co‑benefit (x‑axis)</label>
            <select id="metric-select" class="select"></select>
            <div class="help">Tip: Change this to explore different benefit correlations.</div>
          </div>

          <div class="control-group">
            <label for="rank-select">Rank areas by</label>
            <select id="rank-select" class="select">
              <option value="sum">Total Net Benefit (Sum) ✨</option>
              <option value="physical_activity">Physical Activity 🚶</option>
              <option value="air_quality">Air Quality 🫁</option>
            </select>
          </div>

          <div class="control-group">
            <button class="btn btn-secondary" onclick="window.location.reload()" style="width:100%">Reset View</button>
          </div>
          <div class="control-group" style="margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
            <label>Share & Export</label>
            <div class="btn-row">
              <button type="button" class="btn btn-secondary" onclick="alert('Fitur Copy Link akan segera hadir!')">Copy Link</button>
              <button type="button" class="btn" onclick="exportToPNG()">Export PNG</button>
            </div>
            <div class="help">Save your current analysis view.</div>
          </div>

        </div> <footer class="sidebar-footer">
          Data: UK Co‑Benefits Atlas (Level 1) · UAS Visdat
        </footer>
        </div>
    </aside>

    <main class="charts-area">
      <div class="dashboard-grid">

        <section class="chart-panel" id="panel-top-left">
          <div class="chart-title">Average Benefits & Costs</div>
          <div class="chart-subtitle">Mean values across currently filtered areas</div>
          <div id="means-container" class="svg-container"></div>
        </section>

        <section class="chart-panel" id="panel-top-right">
          <div class="chart-title">Area Distribution Map</div>
          <div class="chart-subtitle">Selected Benefit vs. Total Net Benefit</div>
          <div id="heatmap-container" class="svg-container"></div>
        </section>

        <section class="chart-panel" id="panel-bottom-left">
          <div class="chart-title">Priority Ranking</div>
          <div class="chart-subtitle">Top 5 Best Performing vs. Bottom 5 Lagging Areas</div>
          <div id="rank-container" class="svg-container"></div>
        </section>

        <section class="chart-panel" id="panel-bottom-right">
          <div class="chart-title">Total Benefit Distribution</div>
          <div class="chart-subtitle">👉 Drag the brush below to filter all charts</div>
          <div id="histogram-container" class="svg-container"></div>
        </section>

      </div>
    </main>
  </div>

  <div id="tooltip"></div>

  <script type="module" src="{{ asset('js/main.js') }}"></script>
</body>
</html>