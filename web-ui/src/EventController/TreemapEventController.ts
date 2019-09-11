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

      // reinitialize colorThreshold based on change
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
    const currentSafeColor = this.treemapSettings.color.colors[0];
    const currentWarningColor = this.treemapSettings.color.colors[1];
    const currentDangerColor = this.treemapSettings.color.colors[2];

    d3.select(COLOR_CHANGE_BUTTON).on("click", () => {
      const safeColorInput = d3.select(SAFE_COLOR).property("value");
      const warningColorInput = d3.select(WARNING_COLOR).property("value");
      const dangerColorInput = d3.select(DANGER_COLOR).property("value");
      this.treemapSettings.color.colors[0] = safeColorInput
        ? safeColorInput
        : currentSafeColor;
      this.treemapSettings.color.colors[1] = warningColorInput
        ? warningColorInput
        : currentWarningColor;
      this.treemapSettings.color.colors[2] = dangerColorInput
        ? dangerColorInput
        : currentDangerColor;
      this.treemapSettings.color.colors[3] = dangerColorInput
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
            warningColorInput +
            ", " +
            dangerColorInput +
            ")"
        );
      // reinitialize thresholds based on change
      this.initColorThreshold();
      this.updateTreemap();
    });
  }

  /**
   * initializes color threshold option for treemap.
   */
  private initColorThreshold() {
    const SAFE_COLOR = ".safeColorInput";
    const WARNING_COLOR = ".warningColorInput";
    const DANGER_COLOR = ".dangerColorInput";
    const colorMetric = this.treemapSettings.colorOption;
    const min = this.mD.getMinColorMetric(colorMetric);
    const max = this.mD.getMaxColorMetric(colorMetric);
    const dangerThreshold = DangerThresholds[colorMetric];
    const warningThreshold = WarningThresholds[colorMetric];

    // reset threshold based on colorMetric
    this.resetThresholdsColors(colorMetric, min, max);

    // set initial threshold value
    let threshold = dangerThreshold;
    if (max < warningThreshold) {
      threshold = warningThreshold;
    }

    // decide if threshold is for warning or danger
    const warning = this.isWarning(threshold);

    // display threshold value
    d3.select(".value-selected").text("val: " + threshold);

    // display threshold message
    this.initColorThresholdDescription(warning, threshold);

    // display min and max
    d3.select(".min").text("Min: " + min);
    d3.select(".max").text("Max: " + max);

    // set min, max, and threshold for slider
    d3.select(".range-slider-range")
      .attr("min", min)
      .attr("max", max)
      .attr("value", threshold)
      .on("change", () => {
        const selectedVal = parseInt(
          d3.select(".range-slider-range").property("value")
        );
        d3.select(".value-selected").text("val: " + selectedVal);

        const safeColor = d3.select(SAFE_COLOR).property("value");
        const warningColor = d3.select(WARNING_COLOR).property("value");
        const dangerColor = d3.select(DANGER_COLOR).property("value");

        // update threshold for danger
        if (warningThreshold < selectedVal) {
          this.treemapSettings.color.thresholds = [
            min,
            warningThreshold,
            selectedVal,
            max
          ];
          this.treemapSettings.color.colors = [
            safeColor,
            warningColor,
            dangerColor,
            dangerColor
          ];
        } else {
          this.treemapSettings.color.thresholds = [min, selectedVal, max];
          // check if threshold is for warning or not
          if (warning) {
            this.treemapSettings.color.colors = [
              safeColor,
              warningColor,
              warningColor,
              warningColor
            ];
          } else {
            this.treemapSettings.color.colors = [
              safeColor,
              dangerColor,
              dangerColor,
              dangerColor
            ];
          }
        }
        this.updateTreemap();
        // update threshold description
        this.initColorThresholdDescription(warning, selectedVal);
      });
  }

  /**
   * describes the threshold for danger or warning.
   * @param threshold current threshold for danger or warning.
   */
  private initColorThresholdDescription(warning: boolean, threshold: number) {
    // if (threshold !== 0 && !threshold) {
    //   const colorMetric = this.treemapSettings.colorOption;
    //   const dangerThreshold = DangerThresholds[colorMetric];
    //   const warningThreshold = WarningThresholds[colorMetric];
    //   threshold = warning ? warningThreshold : dangerThreshold;
    // }
    const WARNING_COLOR = ".warningColorInput";
    const DANGER_COLOR = ".dangerColorInput";
    const warningColor = d3.select(WARNING_COLOR).property("value");
    const dangerColor = d3.select(DANGER_COLOR).property("value");

    // threshold description for warning
    if (warning) {
      d3.select(".selectedValueText").text(
        "values >= " +
          threshold +
          " colored in " +
          warningColor +
          " are in warning."
      );
    }
    // threshold description for danger
    else {
      d3.select(".selectedValueText").text(
        "values >= " +
          threshold +
          " colored in " +
          dangerColor +
          " are in danger."
      );
    }
  }

  /**
   * decides whether threshold is for warning or for danger.
   * @param threshold default threshold value
   */
  private isWarning(threshold) {
    const colorMetric = this.treemapSettings.colorOption;
    const warningThreshold = WarningThresholds[colorMetric];
    if (threshold === warningThreshold) {
      return true;
    }
    return false;
  }

  /**
   * updates thresholds and colors if any of the values are in danger or in warning.
   * @param colorMetric the current colorOption of treemap.
   * @param min the minimum value of the current color option in the entire files.
   * @param max the maximum value of the current color option in the entire files.
   */
  private resetThresholdsColors(colorMetric, min, max) {
    const SAFE_COLOR = ".safeColorInput";
    const WARNING_COLOR = ".warningColorInput";
    const DANGER_COLOR = ".dangerColorInput";
    const safeColor = d3.select(SAFE_COLOR).property("value");
    const warningColor = d3.select(WARNING_COLOR).property("value");
    const dangerColor = d3.select(DANGER_COLOR).property("value");

    // get warning and danger thresholds of selected color option
    const dangerThreshold = DangerThresholds[colorMetric];
    const warningThreshold = WarningThresholds[colorMetric];

    // set basic thresholds and colors
    this.treemapSettings.color.thresholds = [
      min,
      warningThreshold,
      dangerThreshold,
      max
    ];
    this.treemapSettings.color.colors = [
      safeColor,
      warningColor,
      dangerColor,
      dangerColor
    ];

    // change thresholds if none of the values are in danger
    if (max < dangerThreshold) {
      // check params because params do not have warning threshold
      if (colorMetric === "params") {
        this.treemapSettings.color.thresholds = [
          min,
          dangerThreshold,
          dangerThreshold
        ];
        this.treemapSettings.color.colors[1] = dangerColor;
      } else {
        this.treemapSettings.color.thresholds = [
          min,
          warningThreshold,
          dangerThreshold
        ];
      }
    }

    // change thresholds and color if none of the values are in warning
    if (colorMetric !== "params" && max < warningThreshold) {
      this.treemapSettings.color.thresholds = [min, warningThreshold];
      this.treemapSettings.color.colors[2] = warningColor;
      this.treemapSettings.color.colors[3] = warningColor;
    }
  }
}

export default TreemapEventController;
