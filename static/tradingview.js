document.addEventListener('DOMContentLoaded', function() {
    const tvPanel = document.getElementById('tvPanel');
    let isTvChartInitialized = false;

    function initializeTvWidget() {
        new TradingView.widget({
            "width": "100%",
            "height": "100%",
            "symbol": "FX:USDJPY",
            "interval": "5",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "hide_top_toolbar": true,
            "save_image": false,
            "container_id": "tradingview_c8c48",
            "studies": [
                "MAExp@tv-basicstudies",
                "MAExp@tv-basicstudies",
                "MAExp@tv-basicstudies",
                "BB@tv-basicstudies"
            ],
            "overrides": {
                "paneProperties.background": "#131722",
                "paneProperties.vertGridProperties.color": "#363c4e",
                "paneProperties.horzGridProperties.color": "#363c4e",
                "symbolWatermarkProperties.transparency": 90,
                "scalesProperties.textColor": "#AAA"
            }
        });
        isTvChartInitialized = true;
    }

    if (tvPanel) {
        tvPanel.addEventListener('click', function() {
            document.getElementById('tv_chart_container').style.display = 'block';
            document.getElementById('d3_chart_container').style.display = 'none';
            if (!isTvChartInitialized) {
                initializeTvWidget();
            }
        });
    }

    // Automatically initialize the TradingView chart when the page loads
    initializeTvWidget();
});
