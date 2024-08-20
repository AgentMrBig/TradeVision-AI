document.addEventListener('DOMContentLoaded', function() {
    const timeframePanel = document.getElementById('timeframePanel');
    const timeframeMenu = document.getElementById('timeframeMenu');

    if (timeframePanel) {
        timeframePanel.addEventListener('click', function() {
            if (timeframeMenu) {
                timeframeMenu.style.display = timeframeMenu.style.display === 'block' ? 'none' : 'block';
            }
        });
    }

    document.addEventListener('click', function(event) {
        if (timeframePanel && timeframeMenu && !timeframePanel.contains(event.target)) {
            timeframeMenu.style.display = 'none';
        }
    });
});
