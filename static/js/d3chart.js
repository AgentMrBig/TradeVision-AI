document.addEventListener('DOMContentLoaded', function () {
    let isD3ChartInitialized = false;

    const d3Panel = document.getElementById('d3Panel');

    if (d3Panel) {
        d3Panel.addEventListener('click', function () {
            document.getElementById('d3_chart_container').style.display = 'block';
            document.getElementById('tv_chart_container').style.display = 'none';
            if (!isD3ChartInitialized) {
                initializeD3Chart();
            }
        });
    }

    function initializeD3Chart() {
        console.log("Initializing D3 Chart...");

        d3.json("/static/data/usd_jpy_5min_data.json").then(function (data) {
            const margin = { top: 20, right: 70, bottom: 30, left: 10 }; // Increased right margin by 20 pixels
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

            data.forEach(function (d) {
                d.time = new Date(d.datetime);
                d.open = +d.Open;
                d.high = +d.High;
                d.low = +d.Low;
                d.close = +d.Close;
            });

            let x = d3.scaleTime()
                .domain(d3.extent(data, d => d.time))
                .range([0, width]);

            let y = d3.scaleLinear()
                .domain([d3.min(data, d => d.low) - 0.1, d3.max(data, d => d.high) + 0.1])
                .range([height, 0]);

            const timeFormatTimeOnly = d3.timeFormat("%H:%M"); // Format for timescale (time only)
            const timeFormatFull = d3.timeFormat("%Y-%m-%d %H:%M:%S"); // Full date and time format for the time panel

            const xAxis = svg.append("g")
                .attr("class", "axis axis-x")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x).tickFormat(timeFormatTimeOnly)) // Update x-axis to show only time of day
                .selectAll("text")
                .style("fill", "#AAA");

            const yAxis = svg.append("g")
                .attr("class", "axis axis-y")
                .attr("transform", `translate(${width}, 0)`)
                .call(d3.axisRight(y).ticks(10).tickFormat(d => d.toFixed(3)))
                .selectAll("text")
                .style("fill", "#AAA");

            const candlestickWidth = Math.min(5, width / data.length * 0.6);

            let candles = svg.selectAll(".candle")
                .data(data)
                .enter()
                .append("rect")
                .attr("class", d => d.open > d.close ? "candle bearish" : "candle bullish")
                .attr("x", d => x(d.time) - candlestickWidth / 2)
                .attr("y", d => y(Math.max(d.open, d.close)))
                .attr("width", candlestickWidth)
                .attr("height", d => Math.max(1, Math.abs(y(d.open) - y(d.close))));

            let stems = svg.selectAll(".stem")
                .data(data)
                .enter()
                .append("line")
                .attr("class", "stem")
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

            const pricePanel = svg.append("rect")
                .attr("class", "floating-panel price-panel")
                .attr("x", width + margin.right - 60)  // Adjusted to move 20 pixels further to the right
                .attr("width", 60)
                .attr("height", 25)
                .attr("rx", 5)
                .attr("ry", 5)
                .style("fill", "rgba(255, 255, 255, 0.7)")
                .style("pointer-events", "none");

            const priceText = svg.append("text")
                .attr("class", "floating-panel price-text")
                .attr("x", 0)  // Adjusted to move 20 pixels further to the right
                .attr("y", 0)
                .attr("dy", "0.35em")
                .attr("text-anchor", "end")
                .style("fill", "#000");

            const timePanel = svg.append("rect")
                .attr("class", "floating-panel time-panel")
                .attr("y", height + 10)
                .attr("width", 160)  // Adjusted width to accommodate full date and time
                .attr("height", 20)
                .attr("rx", 5)
                .attr("ry", 5)
                .style("fill", "rgba(255, 255, 255, 0.7)")
                .style("pointer-events", "none");

            const timeText = svg.append("text")
                .attr("class", "floating-panel time-text")
                .attr("x", 0)  // Removed the previous adjustment
                .attr("y", height + 25)
                .attr("text-anchor", "middle")
                .style("fill", "#000");

            const overlay = svg.append("rect")
                .attr("class", "overlay")
                .attr("width", width)
                .attr("height", height)
                .style("fill", "none")
                .style("pointer-events", "all")
                .on("mouseover", function () {
                    crosshair.style("display", null);
                    pricePanel.style("display", null);
                    timePanel.style("display", null);
                    priceText.style("display", null);
                    timeText.style("display", null);
                })
                .on("mouseout", function () {
                    crosshair.style("display", "none");
                    pricePanel.style("display", "none");
                    timePanel.style("display", "none");
                    priceText.style("display", "none");
                    timeText.style("display", "none");
                })
                .on("mousemove", function (event) {
                    const [mouseX, mouseY] = d3.pointer(event);

                    const timeValue = x.invert(mouseX);
                    const priceValue = y.invert(mouseY);

                    crosshair.select("#crosshairX")
                        .attr("x1", x(timeValue))
                        .attr("y1", height)
                        .attr("x2", x(timeValue))
                        .attr("y2", 0);

                    crosshair.select("#crosshairY")
                        .attr("x1", 0)
                        .attr("y1", y(priceValue))
                        .attr("x2", width)
                        .attr("y2", y(priceValue));

                    pricePanel.attr("y", y(priceValue) - 12.5);
                    priceText
                        .attr("y", y(priceValue))
                        .attr("x", width + margin.right - 30)  // Adjusted to be centered within the panel
                        .attr("text-anchor", "middle")  // Center the text within the panel
                        .text(priceValue.toFixed(3));

                    timePanel.attr("x", x(timeValue) - 80); // Adjust position to center the panel around the cursor
                    timeText
                        .attr("x", x(timeValue))  // Center the time text correctly
                        .text(timeFormatFull(timeValue)); // Update time panel to show full date and time
                });

            function drawGrid(step = 1) {
                svg.selectAll(".grid-line").remove();
            }

            drawGrid();

            const zoom = d3.zoom()
                .scaleExtent([1, 10])
                .translateExtent([[0, 0], [width + 200, height]])
                .extent([[0, 0], [width, height]])
                .on("zoom", zoomed);

            svg.call(zoom);

            function zoomed(event) {
                const transform = event.transform;
                const updatedX = transform.rescaleX(x);
                const updatedY = transform.rescaleY(y);
                const zoomLevel = event.transform.k;
                const newCandlestickWidth = Math.min(20, (width / data.length * 0.6) * zoomLevel); // Candles grow as you zoom in

                svg.select(".axis-x")
                    .call(d3.axisBottom(updatedX).tickFormat(timeFormatTimeOnly)); // Update x-axis to show only time of day

                svg.select(".axis-y")
                    .call(d3.axisRight(updatedY).ticks(10).tickFormat(d => d.toFixed(3)));

                svg.selectAll(".candle")
                    .attr("x", d => updatedX(d.time) - newCandlestickWidth / 2)
                    .attr("y", d => updatedY(Math.max(d.open, d.close)))
                    .attr("width", newCandlestickWidth)
                    .attr("height", d => Math.max(1, Math.abs(updatedY(d.open) - updatedY(d.close))));

                svg.selectAll(".stem")
                    .attr("x1", d => updatedX(d.time))
                    .attr("x2", d => updatedX(d.time))
                    .attr("y1", d => updatedY(d.high))
                    .attr("y2", d => updatedY(d.low));

                overlay.on("mousemove", function (event) {
                    const [mouseX, mouseY] = d3.pointer(event);

                    const timeValue = updatedX.invert(mouseX);
                    const priceValue = updatedY.invert(mouseY);




                    crosshair.select("#crosshairX")
                        .attr("x1", updatedX(timeValue))
                        .attr("y1", height)
                        .attr("x2", updatedX(timeValue))
                        .attr("y2", 0);

                    crosshair.select("#crosshairY")
                        .attr("x1", 0)
                        .attr("y1", updatedY(priceValue))
                        .attr("x2", width)
                        .attr("y2", updatedY(priceValue));

                    pricePanel.attr("y", updatedY(priceValue) - 12.5);
                    priceText
                        .attr("y", updatedY(priceValue))
                        .attr("x", width + margin.right - 30)  // Adjusted to be centered within the panel
                        .attr("text-anchor", "middle")  // Center the text within the panel
                        .text(priceValue.toFixed(3));

                    timePanel.attr("x", updatedX(timeValue) - 80); // Adjust position to center the panel around the cursor
                    timeText
                        .attr("x", updatedX(timeValue))  // Center the time text correctly
                        .text(timeFormatFull(timeValue)); // Update time panel to show full date and time
                });

                let step = 1;

                if (zoomLevel < 2) step = 2;
                if (zoomLevel < 1.5) step = 5;
                if (zoomLevel < 1) step = 15;

                drawGrid(step);
            }

            overlay.on("contextmenu", function (event) {
                event.preventDefault();
                //showCustomMenu(event);
            });

            console.log("D3 Chart initialized with USD/JPY data.");
            isD3ChartInitialized = true;
        }).catch(function (error) {
            console.error("Error loading data: ", error);
        });
    }

    // function showCustomMenu(event) {
    //     const menu = document.getElementById('rightClickMenu');

    //     console.log("Event object:", event);
    //     console.log("Menu object:", menu);
    //     console.log("Menu.style:", menu ? menu.style : "Menu is null or undefined");

    //     if (menu) {  // Check if the menu element exists
    //         menu.style.left = `${event.pageX}px`;
    //         menu.style.top = `${event.pageY}px`;
    //         menu.style.display = 'block';

    //         document.addEventListener('click', () => {
    //             menu.style.display = 'none';
    //         }, { once: true });
    //     } else {
    //         console.error("Context menu element not found");
    //     }
    // }

});
