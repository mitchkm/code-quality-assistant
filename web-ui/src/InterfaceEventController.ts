class InterfaceEventController {
  constructor() {
    const chartSelectButtons: HTMLElement [] = [document.getElementById("treemapChart"), document.getElementById("chart2"), document.getElementById("chart3")];
    let currentChart = chartSelectButtons[0];
    currentChart.className += " active";
    // Loop through the buttons and add the active class to the current/clicked button
    for (let i = 0; i < chartSelectButtons.length; i++) {
      chartSelectButtons[i].addEventListener("click", function () {
        console.log("handling chart change");
        currentChart.className = "";
        this.className = "active";
        currentChart = this;
      });
    }
  }
}

export default InterfaceEventController;