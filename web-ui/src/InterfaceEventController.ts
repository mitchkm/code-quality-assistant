class InterfaceEventController {
  static init() {

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

    let currentChart = chartSelectButtons[0];
    let currentCard = chartOptionsCards[0];
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
}

export default InterfaceEventController;
