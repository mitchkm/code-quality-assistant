import { MetricData, Metrics } from "./Data/metricData";
import Treemap from "./Treemap/treemap";
import TreemapSetting from "./Treemap/treemapSetting";
import * as d3 from "d3";

const metricOptions = [
  Metrics.NLOC,
  Metrics.CCN,
  Metrics.PARAMS,
  Metrics.LENGTH
];

class TreemapEventController {
  // Singleton
  private static _instance: TreemapEventController;
  public static get instance() {
    if (!TreemapEventController._instance) {
      TreemapEventController._instance = new TreemapEventController();
    }
    return TreemapEventController._instance;
  }

  private mD: MetricData;
  private treemap: Treemap;
  private treemapSettings: TreemapSetting;
  private contextSet = false;

  public setContext(
    metricData: MetricData,
    treemap: Treemap,
    treemapSettings: TreemapSetting
  ) {
    this.mD = metricData;
    this.treemap = treemap;
    this.treemapSettings = treemapSettings;
    this.contextSet = true;
  }

  public init() {
    if (!this.contextSet) {
      return;
    }
    this.initFileSelector();
    this.initSizeMetricSelector();
    this.initColorMetricSelector();
    this.initTreemapColorSelector();
    this.initColorThreshold();
  }

  private updateTreemap() {
    this.mD.clearFilterList();
    this.mD.addToFilterList(this.treemapSettings.fileOption);
    const data = this.mD.toTreemapData(
      this.treemapSettings.sizeOption,
      this.treemapSettings.colorOption
    );
    this.treemap.drawTreemap(data);
  }

  private initFileSelector() {
    const FILE_SELECTOR = "#fileSelector";
    const FILE_LIST = "#fileOptions";
    const FILE_FILTER_BUTTON = "#fileFilterButton";

    // delete existing dropdown options
    if (d3.select(FILE_LIST).select("option") !== undefined) {
      d3.select(FILE_LIST)
        .selectAll("option")
        .remove();
    }

    d3.select(FILE_LIST)
      .selectAll("option")
      .data(this.mD.fileList)
      .enter()
      .append("option")
      .attr("value", function(d) {
        return d;
      });

    d3.select(FILE_FILTER_BUTTON).on("click", () => {
      this.treemapSettings.fileOption = d3
        .select(FILE_SELECTOR)
        .property("value");
      this.updateTreemap();
    });
  }

  private initSizeMetricSelector() {
    const SIZE_SELECTOR = "#sizeSelector";

    // delete existing dropdown options
    if (d3.select(SIZE_SELECTOR).select("option") !== undefined) {
      d3.select(SIZE_SELECTOR)
        .selectAll("option")
        .remove();
    }

    const defaultOption = this.treemapSettings.sizeOption;

    d3.select(SIZE_SELECTOR)
      .selectAll("option")
      .data(metricOptions)
      .enter()
      .append("option")
      .attr("value", function(d) {
        return d;
      })
      .property("selected", function(d) {
        return d === defaultOption;
      })
      .text(function(d) {
        return d;
      });

    d3.select(SIZE_SELECTOR).on("change", () => {
      this.treemapSettings.sizeOption = d3
        .select(SIZE_SELECTOR)
        .property("value");
      this.updateTreemap();
    });
  }

  private initColorMetricSelector() {
    const COLOR_SELECTOR = "#colorSelector";

    // delete existing dropdown options
    if (d3.select(COLOR_SELECTOR).select("option") !== undefined) {
      d3.select(COLOR_SELECTOR)
        .selectAll("option")
        .remove();
    }

    const defaultOption = this.treemapSettings.colorOption;

    d3.select(COLOR_SELECTOR)
      .selectAll("option")
      .data(metricOptions)
      .enter()
      .append("option")
      .attr("value", function(d) {
        return d;
      })
      .property("selected", function(d) {
        return d === defaultOption;
      })
      .text(function(d) {
        return d;
      });

    d3.select(COLOR_SELECTOR).on("change", () => {
      this.treemapSettings.colorOption = d3
        .select(COLOR_SELECTOR)
        .property("value");

      // find min and max values of selected color option
      const colorMetric = this.treemapSettings.colorOption;
      const min = this.mD.getMinColorMetric(colorMetric);
      const max = this.mD.getMaxColorMetric(colorMetric);
      const threshold = (max - min) * 0.75;

      // change colorThreshold
      this.initColorThreshold(min, threshold, max);
      this.updateTreemap();
    });
  }

  private initTreemapColorSelector() {
    const COLOR_FROM = ".colorFromInput";
    const COLOR_TO = ".colorToInput";
    const COLOR_CHANGE_BUTTON = "#treemapColorChange";
    const COLOR_BAR = ".colorGradientBar";
    const colorFromDefault = "green";
    const colorToDefault = "red";

    d3.select(COLOR_CHANGE_BUTTON).on("click", () => {
      const colorFromInput = d3
        .select(COLOR_FROM)
        .property("value");
      const colorToInput = d3
        .select(COLOR_TO)
        .property("value");
      this.treemapSettings.color.colors[0] = colorFromInput ? colorFromInput : colorFromDefault;
      this.treemapSettings.color.colors[1] = colorToInput ? colorToInput : colorToDefault;
      this.treemapSettings.color.colors[2] = colorToInput ? colorToInput : colorToDefault;
      this.updateTreemap();
      const startColor = this.treemapSettings.color.colors[0];
      const endColor = this.treemapSettings.color.colors[1];
      d3.select(COLOR_BAR)
        .style("height", "20px")
        .style(
          "background-image",
          "linear-gradient(to right," + startColor + ", " + endColor + ")"
        );
    });
  }

  /**
   * initializes color threshold option for treemap.
   * @param min the minimum value of selected color option among entire files.
   * @param threshold the calculated threshold (75% of (max - min)).
   * @param max the maximum value of selected color option among entire files.
   */
  private initColorThreshold(min?: number, threshold?: number, max?: number) {
    if (!min && !max && !threshold) {
      // use default min, max, and threshold
      min = this.treemapSettings.color.thresholds[0];
      threshold = this.treemapSettings.color.thresholds[1];
      max = this.treemapSettings.color.thresholds[2];
    }

    // display threshold
    d3.select(".value-selected").text("val: " + threshold);
    d3.select(".selectedValueText").text("value >= " + threshold + " displayed in red");

    // display min and max
    d3.select(".min").text("Min: " + min);
    d3.select(".max").text("Max: " + max);

    // set min, max, and threshold for slider
    d3.select(".range-slider-range")
      .attr("min", min)
      .attr("max", max)
      .attr("value", threshold)
      .on("change", () => {
        const selectedVal = d3.select(".range-slider-range").property("value");
        d3.select(".value-selected").text("val: " + selectedVal);
        // update threshold
        this.treemapSettings.color.thresholds = [min, selectedVal, max];
        this.updateTreemap();
        d3.select(".selectedValueText").text("value >= " + selectedVal + " displayed in red");
      });
  }
}

export default TreemapEventController;
