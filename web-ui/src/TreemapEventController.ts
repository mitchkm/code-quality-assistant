import { MetricData, Metrics } from "./Data/metricData";
import Treemap from "./Treemap/treemap";
import TreemapSetting from "./Treemap/treemapSetting";
import * as d3 from "d3";
import { DangerThresholds, WarningThresholds } from "./Treemap/thresholds";

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

  /**
   * updates treemap according to the change in sizeOption, colorOption, and filtered files
   */
  private updateTreemap() {
    this.mD.clearFilterList();
    this.mD.addToFilterList(this.treemapSettings.fileOption);
    const data = this.mD.toTreemapData(
      this.treemapSettings.sizeOption,
      this.treemapSettings.colorOption
    );
    this.treemap.drawTreemap(data);
  }

  /**
   * creates file filtering Options
   */
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

  /**
   * creates sizeOption
   */
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

  /**
   * creates colorOption
   */
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

      // update colorThreshold according to selected colorOption
      this.initColorThreshold();
      this.updateTreemap();
    });
  }

  /**
   * updates colors of treemap according to the user's safe, warning, and danger color inputs.
   */
  private initTreemapColorSelector() {
    const SAFE_COLOR = ".safeColorInput";
    const WARNING_COLOR = ".warningColorInput";
    const DANGER_COLOR = ".dangerColorInput";
    const COLOR_CHANGE_BUTTON = "#treemapColorChange";
    const COLOR_BAR = ".colorGradientBar";
    const safeColorDefault = "green";
    const dangerColorDefault = "red";

    d3.select(COLOR_CHANGE_BUTTON).on("click", () => {
      const safeColorInput = d3
        .select(SAFE_COLOR)
        .property("value");
      const dangerColorInput = d3
        .select(DANGER_COLOR)
        .property("value");
      this.treemapSettings.color.colors[0] = safeColorInput ? safeColorInput : safeColorDefault;
      this.treemapSettings.color.colors[1] = dangerColorInput ? dangerColorInput : dangerColorDefault;
      this.treemapSettings.color.colors[2] = dangerColorInput ? dangerColorInput : dangerColorDefault;

      // update Color Bar
      const startColor = d3.select(SAFE_COLOR).property("value");
      const middleColor = d3.select(WARNING_COLOR).property("value");
      const endColor = d3.select(DANGER_COLOR).property("value");
      d3.select(COLOR_BAR)
        .style("height", "20px")
        .style(
          "background-image",
          "linear-gradient(to right," + startColor + ", " + middleColor + ", " + endColor + ")"
      );
      // update thresholds
      this.initColorThreshold();
      this.updateTreemap();
    });
  }

  /**
   * initializes color threshold option for treemap.
   */
  private initColorThreshold() {
    const colorMetric = this.treemapSettings.colorOption;
    const min = this.mD.getMinColorMetric(colorMetric);
    const max = this.mD.getMaxColorMetric(colorMetric);

    // check threshold based on colorMetric
    this.checkColorMetricValues(colorMetric, min, max);

    // get threshold value
    const threshold = this.treemapSettings.color.thresholds[1];

    // display threshold value
    d3.select(".value-selected").text("val: " + threshold);

    // display threshold message
    this.initColorThresholdDescription(threshold);

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
        // update threshold description
        this.initColorThresholdDescription(selectedVal);
      });
  }

  /**
   * describes the threshold for danger or warning.
   * @param threshold current threshold for danger or warning.
   */
  private initColorThresholdDescription(threshold: number) {
    const WARNING_COLOR = ".warningColorInput";
    const DANGER_COLOR = ".dangerColorInput";
    const middleColor = d3.select(WARNING_COLOR).property("value");
    const endColor = d3.select(DANGER_COLOR).property("value");

    if (this.treemapSettings.color.colors[2] === middleColor) {
      d3.select(".selectedValueText").text("values >= " + threshold + " colored in " + middleColor + " are in warning.");
    }
    else if (this.treemapSettings.color.colors[2] === endColor) {
      d3.select(".selectedValueText").text("values >= " + threshold + " colored in " + endColor + " are in danger.");
    }
  }

  /**
   * updates thresholds and colors if any of the values are in danger or in warning.
   * @param colorMetric the current colorOption of treemap.
   * @param min the minimum value of the current color option in the entire files.
   * @param max the maximum value of the current color option in the entire files.
   */
  private checkColorMetricValues(colorMetric, min, max) {
    const WARNING_COLOR = ".warningColorInput";

     // get warning and danger thresholds of selected color option
     const dangerThreshold = DangerThresholds[colorMetric];
     const warningThreshold = WarningThresholds[colorMetric];

     // get treemap warning color
     const warningColor = d3.select(WARNING_COLOR).property("value");

     // change thresholds if none of the values are in danger
     if (max < dangerThreshold) {
       this.treemapSettings.color.thresholds = [min, dangerThreshold];
     }

     // change thresholds and color if none of the values are in warning
     if (colorMetric !== "params" && max < warningThreshold) {
       this.treemapSettings.color.thresholds = [min, warningThreshold];
       this.treemapSettings.color.colors[1] = warningColor;
       this.treemapSettings.color.colors[2] = warningColor;
     }
  }
}

export default TreemapEventController;
