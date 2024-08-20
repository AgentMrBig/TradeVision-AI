document.addEventListener('DOMContentLoaded', function() {
    let isRightClickHeld = false;
    let svgMenu;

    // Create an SVG container that covers the entire screen
    const svgContainer = d3.select("body").append("svg")
        .attr("width", window.innerWidth)
        .attr("height", window.innerHeight)
        .style("position", "absolute")
        .style("top", 0)
        .style("left", 0)
        .style("pointer-events", "none")
        .style("z-index", 1000); // Ensure it is above other elements

    // Handle right-click and hold
    document.addEventListener('mousedown', function(event) {
        if (event.button === 2) {  // Right mouse button
            isRightClickHeld = true;
            setTimeout(() => {
                if (isRightClickHeld) {
                    showSvgMenu(event.pageX, event.pageY);
                }
            }, 200);  // Delay before showing the menu
        }
    });

    // Remove the menu on mouse release
    document.addEventListener('mouseup', function(event) {
        if (event.button === 2 && svgMenu) {  // Right mouse button
            isRightClickHeld = false;
            if (svgMenu) {
                svgMenu.remove();  // Remove the menu when the right-click is released
                svgMenu = null;  // Reset svgMenu to null
            }
        }
    });

    // Function to display the SVG menu
    function showSvgMenu(x, y) {
        // Ensure any existing menu is removed before creating a new one
        if (svgMenu) {
            svgMenu.remove();
        }

        svgMenu = svgContainer.append("g")
            .attr("transform", `translate(${x}, ${y})`);

        const buttonData = [
            { label: "Ask AI", cx: 0, cy: -100 },
            { label: "Find Patterns", cx: 86, cy: -50 },
            { label: "Find Long Trend", cx: 86, cy: 50 },
            { label: "Find Short Trend", cx: 0, cy: 100 },
            { label: "S/R", cx: -86, cy: 50 },
            { label: "Dummy", cx: -86, cy: -50 } // Dummy item to balance the layout
        ];

        buttonData.forEach(button => {
            const buttonGroup = svgMenu.append("g")
                .attr("class", "context-item")  // Apply the context-item class
                .attr("transform", `translate(${button.cx}, ${button.cy})`)
                .on("mouseover", function() {
                    d3.select(this).classed("hover", true); // Apply hover effect
                })
                .on("mouseout", function() {
                    d3.select(this).classed("hover", false); // Remove hover effect
                });

            // Create a larger circular button
            buttonGroup.append("circle")
                .attr("r", 30)  // Increased radius for larger buttons
                .attr("fill", "#333")  // Match your existing button color
                .attr("stroke", "#666")  // Slightly darker border
                .attr("stroke-width", 2);

            // Add text to the button
            buttonGroup.append("text")
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .attr("fill", "#fff")
                .style("font-size", "12px")  // Slightly larger font size for readability
                .text(button.label);
        });

        svgMenu.style("pointer-events", "all");
    }
});
