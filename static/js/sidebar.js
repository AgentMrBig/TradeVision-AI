document.addEventListener('DOMContentLoaded', function() {
    const tvPanel = document.getElementById('tvPanel');
    const d3Panel = document.getElementById('d3Panel');
    const aiOverlayPanel = document.getElementById('aiOverlayPanel');

    if (tvPanel) {
        tvPanel.addEventListener('click', function() {
            // Your existing code here
        });
    }

    if (d3Panel) {
        d3Panel.addEventListener('click', function() {
            // Your existing code here
        });
    }

    if (aiOverlayPanel) {
        aiOverlayPanel.addEventListener('click', function() {
            // Your existing code here
        });
    }

    document.addEventListener('click', function(event) {
        if (aiOverlayPanel && aiOverlayPanel.contains(event.target)) {
            // Your existing code here
        }
    });
});
