class InterfaceEventController {
  static init(initialState?: string) {

    const charts = [
      "treemap",
      "chart2",
      "chart3"
    ];

    let chart = charts.indexOf(initialState);
    chart = chart !== -1 ? chart : 0;

    const chartSelectButtons: HTMLElement[] = [
      document.getElementById("treemapChartButton"),
      document.getElementById("chart2Button"),
      document.getElementById("chart3Button")
    ];

    const chartOptionsCards: HTMLElement[] = [
      document.getElementById("treemapOptionsSidebarCard"),
      document.getElementById("chart2OptionsSidebarCard"),
      document.getElementById("chart3OptionsSidebarCard")
    ];

    let currentChart = chartSelectButtons[chart];
    let currentCard = chartOptionsCards[chart];
    currentChart.className += " active";
    currentCard.style.display = "block";


    // Loop through the buttons and add the active class to the current/clicked button
    for (let i = 0; i < chartSelectButtons.length; i++) {
      chartSelectButtons[i].addEventListener("click", function() {

        currentChart.className = "";
        this.className = "active";

        currentCard.style.display = "none";
        chartOptionsCards[chartSelectButtons.indexOf(this)].style.display = "block";

        currentCard = chartOptionsCards[chartSelectButtons.indexOf(this)];
        currentChart = this;
      });
    }
  }
  //static init
}

export default InterfaceEventController;
