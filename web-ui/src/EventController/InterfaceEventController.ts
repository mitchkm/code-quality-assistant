import d3 = require("d3");
import * as util from "../util";

class InterfaceEventController {
  public static curChartName = "treemap";
  // static init
  static init(initialState?: string) {

    const charts = [
      "treemap",
      "chart2",
      "chart3"
    ];

    const chartElements = [
      document.getElementById("treeMapCard"),
      document.getElementById("codeDuplicationCard"),
      document.getElementById("statsCard")
    ];

    let chart = charts.indexOf(initialState);
    chart = chart !== -1 ? chart : 0;
    InterfaceEventController.curChartName = charts[chart];

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

    let currentChartButton = chartSelectButtons[chart];
    let currentOptionsCard = chartOptionsCards[chart];
    let currentChart       = chartElements[chart];
    currentChartButton.className += " active";
    currentOptionsCard.style.display = "block";
    currentChart.style.display = "block";


    // Loop through the buttons and add the active class to the current/clicked button
    for (let i = 0; i < chartSelectButtons.length; i++) {
      chartSelectButtons[i].addEventListener("click", function () {

        currentChartButton.className = "";
        this.className = "active";
        InterfaceEventController.curChartName = charts[i];

        currentOptionsCard.style.display = "none";
        currentChart.style.display = "none";
        chartOptionsCards[chartSelectButtons.indexOf(this)].style.display = "block";
        chartElements[chartSelectButtons.indexOf(this)].style.display = "block";

        currentOptionsCard = chartOptionsCards[chartSelectButtons.indexOf(this)];
        currentChart =  chartElements[chartSelectButtons.indexOf(this)];
        currentChartButton = this;
        util.fillURLText(undefined);
      });
    }

    // Add copy button functionality for copying URL + params
    d3.select("#copyURLOptionsButton").on("click", () => {
      const text = d3.select("#urlOptionsString").property("value");
      navigator.clipboard.writeText(text).then(() => {
        alert("Link with URL Parameters copied to clipboard: " + text);
      });
    });
    util.fillURLText(undefined);
  }
}

export default InterfaceEventController;
