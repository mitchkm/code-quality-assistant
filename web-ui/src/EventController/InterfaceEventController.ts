import d3 = require("d3");
import * as util from "../util";
import { MetricData } from "../Data/metricData";

class InterfaceEventController {
  public static curChartName = "treemap";
  public static mD: MetricData;
  // static init
  static init(initialState: string, mD: MetricData) {
    InterfaceEventController.mD = mD;
    const charts = ["treemap", "duplicate", "statistics"];

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
    let currentChart = chartElements[chart];
    currentChartButton.className += " active";
    currentOptionsCard.style.display = "block";
    currentChart.style.display = "block";

    // Loop through the buttons and add the active class to the current/clicked button
    for (let i = 0; i < chartSelectButtons.length; i++) {
      chartSelectButtons[i].addEventListener("click", function() {
        currentChartButton.className = "";
        this.className = "active";
        InterfaceEventController.curChartName = charts[i];

        currentOptionsCard.style.display = "none";
        currentChart.style.display = "none";
        chartOptionsCards[chartSelectButtons.indexOf(this)].style.display =
          "block";
        chartElements[chartSelectButtons.indexOf(this)].style.display = "block";

        currentOptionsCard =
          chartOptionsCards[chartSelectButtons.indexOf(this)];
        currentChart = chartElements[chartSelectButtons.indexOf(this)];
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

  public static initDonut(dupRate: number){
    this.updateDonut(dupRate);
  }

  public static updateDonut(dupRate: number){
    const donutElement = d3.select("#donutElement");
    const percentElement = document.getElementById("donutPercent");
    const attrString = this.dupRateToAttributeString(dupRate);
    donutElement.attr("stroke-dasharray", attrString);
    percentElement.textContent = (Math.round(dupRate * 10) / 10).toString() + "%";
  }

  public static initDuplicates(mD: MetricData) {
    const dupList = d3.select("#duplicatesList").select(".card-columns");
    dupList.selectAll("div").remove();
    console.log(dupList);
    mD.duplicateInfo.duplicates.forEach(dups => {
      const card = dupList
        .append("div")
        .attr("class", "card")
        .append("div")
        .attr("id", "gridContainer");
      // add top row info
      const labelRow = card
        .append("div")
        .attr("class", "row")
        .attr("id", "labelRow");
      labelRow
        .append("div")
        .attr("class", "col-md-6")
        .append("span")
        .text("file");
      labelRow
        .append("div")
        .attr("class", "col-md-3")
        .append("span")
        .text("start");
      labelRow
        .append("div")
        .attr("class", "col-md-3")
        .append("span")
        .text("end");
      // add actual info
      dups.forEach(dup => {
        const filesRow = card
          .append("div")
          .attr("class", "row")
          .attr("id", "filesRow");
        filesRow
          .append("div")
          .attr("class", "col-6")
          .append("span")
          .text(MetricData.parseRelativeName(dup.filename, mD.path));
        filesRow
          .append("div")
          .attr("class", "col-3")
          .append("span")
          .text(dup.startLine);
        filesRow
          .append("div")
          .attr("class", "col-3")
          .append("span")
          .text(dup.endLine);
      });
    });
  }

  private static dupRateToAttributeString(dupRate: number) {
    const percentage = Math.round(dupRate * 10) / 10;
    return percentage.toString() + " " + (100 - percentage).toString();
  }
}

export default InterfaceEventController;
