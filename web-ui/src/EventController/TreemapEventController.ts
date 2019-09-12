import { MetricData, Metrics } from "../Data/metricData";
import Treemap from "../Treemap/treemap";
import TreemapSetting from "../Treemap/treemapSetting";
import * as d3 from "d3";
import { DangerThresholds, WarningThresholds } from "../Treemap/thresholds";

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
    this.mD.useBlackList();
    this.mD.addToFilterList(this.treemapSettings.fileOption.list);
    if (this.treemapSettings.fileOption.type === "white") {
      this.mD.useWhiteList();
    }
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
      this.treemapSettings.fileOption.list.push(d3
        .select(FILE_SELECTOR)
        .property("value"));
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

      // initialize colorThreshold for new colorMetric
      this.initColorThreshold();
      this.updateTreemap();
    });
  }

  /**
   * updates colors of treemap according to the user's safe, warning, and danger color inputs.
   */
  private initTreemapColorSelector() {
    const SAFE_COLOR = ".safeColorInput";
    const DANGER_COLOR = ".dangerColorInput";
    const COLOR_CHANGE_BUTTON = "#treemapColorChange";
    const COLOR_BAR = ".colorGradientBar";
    const currentSafeColor = this.treemapSettings.color.colors[0];
    const currentDangerColor = this.treemapSettings.color.colors[2];

    d3.select(COLOR_CHANGE_BUTTON).on("click", () => {
      const safeColorInput = d3.select(SAFE_COLOR).property("value");
      const dangerColorInput = d3.select(DANGER_COLOR).property("value");
      this.treemapSettings.color.colors[0] = safeColorInput
        ? safeColorInput
        : currentSafeColor;
      this.treemapSettings.color.colors[1] = dangerColorInput
        ? dangerColorInput
        : currentDangerColor;
      this.treemapSettings.color.colors[2] = dangerColorInput
        ? dangerColorInput
        : currentDangerColor;

      // update Color Bar
      d3.select(COLOR_BAR)
        .style("height", "20px")
        .style(
          "background-image",
          "linear-gradient(to right," +
            safeColorInput +
            ", " +
            dangerColorInput +
            ")"
        );
      // update color in threshold description
      this.initColorThresholdDescription();
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
    const dangerThreshold = DangerThresholds[colorMetric];

    // set default threshold value
    this.setThreshold(min, dangerThreshold, max);

    // display default threshold value
    d3.select(".dangerThresholdInput").property("value", dangerThreshold);

    // display default threshold message
    this.initColorThresholdDescription(dangerThreshold);

    // display min and max
    d3.select(".min").text("Min: " + min);
    d3.select(".max").text("Max: " + max);

    // update treemap color based on threshold
    d3.select("#applyThresholdButton").on("click", () => {
      const selectedVal = parseInt(
        d3.select(".dangerThresholdInput").property("value")
      );
      this.setThreshold(min, selectedVal, max);
      this.updateTreemap();
      this.initColorThresholdDescription(selectedVal);
    });
  }

  /**
   * set the threshold for treemap
   * @param min minimum value of selected colorMetric
   * @param threshold threshold value for danger
   * @param max maximum value of selected colorMetric
   */
  private setThreshold(min, threshold, max) {
    if (threshold < max) {
      this.treemapSettings.color.thresholds = [min, threshold, max];
    } else {
      this.treemapSettings.color.thresholds = [min, threshold];
    }
  }

  /**
   * describes the threshold for danger.
   * @param threshold threshold for danger.
   */
  private initColorThresholdDescription(threshold?: number) {
    const DANGER_COLOR = ".dangerColorInput";
    const dangerColor = d3.select(DANGER_COLOR).property("value");
    if (!threshold) {
      threshold = this.treemapSettings.color.thresholds[1];
    }

    // threshold description for danger
    d3.select(".selectedValueText").text(
      "values >= " +
        threshold +
        " colored in " +
        dangerColor +
        " are in danger."
    );
  }
}

export default TreemapEventController;
