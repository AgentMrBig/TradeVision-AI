(function() {
    let isChartInitialized = false;

    function initializeTestD3Chart() {
        console.log("Initializing Test D3 Chart...");

        const svg = d3.select("#test_d3_chart_container")
            .append("svg")
            .attr("width", 500)
            .attr("height", 300)
            .style("background-color", "#e0f7fa");  // Light blue background

        console.log("SVG element created:", svg);
        isChartInitialized = true;
    }

    const testD3Panel = document.getElementById('testD3Panel');
    const testD3ChartContainer = document.getElementById('test_d3_chart_container');
    const tvChartContainer = document.getElementById('tv_chart_container');
    const d3ChartContainer = document.getElementById('d3_chart_container');

    testD3Panel.addEventListener('click', () => {
        testD3ChartContainer.style.display = 'block';
        tvChartContainer.style.display = 'none';
        d3ChartContainer.style.display = 'none';

        if (!isChartInitialized) {
            console.log("Test D3 Chart panel clicked, initializing chart...");
            initializeTestD3Chart();  // Initialize Test D3.js chart when the panel is first clicked
        } else {
            console.log("Test D3 Chart already initialized");
        }
    });
})();
