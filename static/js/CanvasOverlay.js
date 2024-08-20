document.addEventListener('DOMContentLoaded', function() {
    const aiOverlayPanel = document.getElementById('aiOverlayPanel');
    const canvasOverlay = document.getElementById('canvas-overlay');
    const ctx = canvasOverlay.getContext('2d');
    let isDrawing = false;

    aiOverlayPanel.addEventListener('click', function() {
        const isActive = canvasOverlay.style.display !== 'none';

        if (isActive) {
            canvasOverlay.style.display = 'none'; // Hide overlay if already active
        } else {
            canvasOverlay.style.display = 'block'; // Show overlay on click
        }
    });

    // Handle mouse events for drawing
    canvasOverlay.addEventListener('mousedown', function(event) {
        if (event.button === 0) { // Left mouse button
            isDrawing = true;
            ctx.beginPath();
            ctx.moveTo(event.offsetX, event.offsetY);
        }
    });

    canvasOverlay.addEventListener('mousemove', function(event) {
        if (isDrawing) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.lineTo(event.offsetX, event.offsetY);
            ctx.stroke();
        }
    });

    canvasOverlay.addEventListener('mouseup', function(event) {
        if (event.button === 0) { // Left mouse button
            isDrawing = false;
            ctx.closePath();
        }
    });

    canvasOverlay.addEventListener('mouseleave', function(event) {
        isDrawing = false;
        ctx.closePath();
    });
});
