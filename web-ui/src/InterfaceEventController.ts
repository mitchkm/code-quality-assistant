class InterfaceEventController {
  static init() {
    const chartSelectButtons: HTMLElement[] = [
      document.getElementById("treemapChartButton"),
      document.getElementById("chart2Button"),
      document.getElementById("chart3Button")
    ];
    let currentChart = chartSelectButtons[0];
    currentChart.className += " active";
    // Loop through the buttons and add the active class to the current/clicked button
    for (let i = 0; i < chartSelectButtons.length; i++) {
      chartSelectButtons[i].addEventListener("click", function() {
        currentChart.className = "";
        this.className = "active";
        currentChart = this;
      });
    }
  }
}

export default InterfaceEventController;
