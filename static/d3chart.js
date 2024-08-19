document.addEventListener('DOMContentLoaded', function() {
    let isD3ChartInitialized = false;

    const d3Panel = document.getElementById('d3Panel');

    if (d3Panel) {
        d3Panel.addEventListener('click', function() {
            document.getElementById('d3_chart_container').style.display = 'block';
            document.getElementById('tv_chart_container').style.display = 'none';
            if (!isD3ChartInitialized) {
                initializeD3Chart();
            }
        });
    }

    function initializeD3Chart() {
        console.log("Initializing D3 Chart...");

        d3.json("/static/data/usd_jpy_5min_data.json").then(function(data) {
            const margin = { top: 20, right: 50, bottom: 30, left: 10 };
            const width = document.getElementById('d3_chart_container').clientWidth - margin.left - margin.right;
            const height = document.getElementById('d3_chart_container').clientHeight - margin.top - margin.bottom;

            const svg = d3.select("#d3_chart_container")
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
                .style("cursor", "crosshair")
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            data.forEach(function(d) {
                d.time = new Date(d.datetime);
                d.open = +d.Open;
                d.high = +d.High;
                d.low = +d.Low;
                d.close = +d.Close;
            });

            const x = d3.scaleTime()
                .domain(d3.extent(data, d => d.time))
                .range([0, width]);

            const y = d3.scaleLinear()
                .domain([d3.min(data, d => d.low) - 0.1, d3.max(data, d => d.high) + 0.1])
                .range([height, 0]);

            svg.append("g")
                .attr("class", "axis axis-x")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%H:%M")).ticks(data.length))
                .selectAll("text")
                .style("fill", "#AAA");

            svg.append("g")
                .attr("class", "axis axis-y")
                .attr("transform", `translate(${width}, 0)`)
                .call(d3.axisRight(y).ticks(6))
                .selectAll("text")
                .style("fill", "#AAA");

            const candlestickWidth = Math.min(10, width / data.length * 0.8);

            svg.selectAll(".candle")
                .data(data)
                .enter()
                .append("rect")
                .attr("class", d => d.open > d.close ? "candle bearish" : "candle bullish")
                .attr("x", d => x(d.time) - candlestickWidth / 2)
                .attr("y", d => y(Math.max(d.open, d.close)))
                .attr("width", candlestickWidth)
                .attr("height", d => Math.max(1, Math.abs(y(d.open) - y(d.close))));

            svg.selectAll(".stem")
                .data(data)
                .enter()
                .append("line")
                .attr("x1", d => x(d.time))
                .attr("x2", d => x(d.time))
                .attr("y1", d => y(d.high))
                .attr("y2", d => y(d.low))
                .attr("stroke", d => d.open > d.close ? "#f44336" : "#4caf50")
                .attr("stroke-width", 1.5);

            const crosshair = svg.append("g")
                .attr("class", "crosshair")
                .style("display", "none");

            crosshair.append("line")
                .attr("id", "crosshairX")
                .attr("class", "crosshair")
                .attr("stroke", "#AAA")
                .attr("stroke-dasharray", "3,3");

            crosshair.append("line")
                .attr("id", "crosshairY")
                .attr("class", "crosshair")
                .attr("stroke", "#AAA")
                .attr("stroke-dasharray", "3,3");

            const overlay = svg.append("rect")
                .attr("class", "overlay")
                .attr("width", width)
                .attr("height", height)
                .style("fill", "none")
                .style("pointer-events", "all")
                .on("mouseover", function() {
                    crosshair.style("display", null);
                })
                .on("mouseout", function() {
                    crosshair.style("display", "none");
                })
                .on("mousemove", function(event) {
                    const [mouseX, mouseY] = d3.pointer(event);

                    crosshair.select("#crosshairX")
                        .attr("x1", x(x.invert(mouseX)))
                        .attr("y1", height)
                        .attr("x2", x(x.invert(mouseX)))
                        .attr("y2", 0);

                    crosshair.select("#crosshairY")
                        .attr("x1", 0)
                        .attr("y1", y(y.invert(mouseY)))
                        .attr("x2", width)
                        .attr("y2", y(y.invert(mouseY)));
                });

            console.log("D3 Chart initialized with USD/JPY data.");
            isD3ChartInitialized = true;
        }).catch(function(error) {
            console.error("Error loading data: ", error);
        });
    }
});
