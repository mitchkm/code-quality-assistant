import { MetricData, Metrics } from "../Data/metricData";
import Treemap from "../Treemap/treemap";
import TreemapSetting from "../Treemap/treemapSetting";
import * as d3 from "d3";
import { DangerThresholds } from "../Treemap/thresholds";
import * as util from "../util";
import convert = require("color-convert");

const metricOptions = [
  Metrics.NLOC,
  Metrics.CCN,
  Metrics.TOKENS,
  Metrics.PARAMS,
  Metrics.LENGTH,
  Metrics.FAN_IN,
  Metrics.FAN_OUT,
  Metrics.GENERAL_FAN_OUT,
  Metrics.MAX_NESTING_DEPTH,
  Metrics.MAX_NESTED_STRUCTURES
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
    this.initDropdownStyling();
    this.initColorThreshold();
    this.updateTreemap();
  }

  /**
   * updates treemap according to the change in sizeOption, colorOption, and filtered files
   */
  private updateTreemap() {
    this.mD.clearFilterList();
    this.mD.clearFileTypeFilterList();
    this.mD.useBlackList();
    this.mD.addToFilterList(this.treemapSettings.fileOption.files);
    if (this.treemapSettings.fileOption.type === "white") {
      this.mD.useWhiteList();
    }
    this.treemapSettings.fileOption.types.forEach(type => {
      this.mD.addToFileTypeFilterList(type);
    });
    const data = this.mD.toTreemapData(
      this.treemapSettings.sizeOption,
      this.treemapSettings.colorOption
    );
    this.treemap.drawTreemap(data);
    util.fillURLText(this.treemapSettings);
  }

  private processFile(file: string) {
    // detect basic globbing
    if (file.indexOf("*") !== -1) {
      const glob = file.split("*");
      if (glob[1]) { // for filetypes: *.type
        const type = glob[1].substr(1);
        if (
          this.mD.allTypes.indexOf(type) !== -1 &&
          this.treemapSettings.fileOption.types.indexOf(type) === -1
        ) {
          this.treemapSettings.fileOption.types.push(type);
          this.addFileTypeToListUI(type);
        }
      }
      else { // for folders: /path/to/folder/*
        const folder = glob[0];
        this.mD.allFiles.forEach(file => {
          if (file.split(folder)[1]) {
            this.processFile(file);
          }
        });
      }
      return true;
    }
    // check if normal file
    else if (
      this.mD.allFiles.indexOf(file) !== -1 &&
      this.treemapSettings.fileOption.files.indexOf(file) === -1
    ) {
      this.treemapSettings.fileOption.files.push(file);
      this.addFileToListUI(file);
      return true;
    }

    return false;
  }

  /**
   * creates file filtering Options
   */
  private initFileSelector() {
    const FILE_SELECTOR = "#fileSelector";
    const FILE_LIST = "#fileOptions";
    const FILE_FILTER_BUTTON = "#fileFilterButton";
    const FILE_CLEAR = "#clearAllButton";
    const LIST_TYPE_SLIDER = "#togBtn";

    // delete existing dropdown options
    if (d3.select(FILE_LIST).select("option") !== undefined) {
      d3.select(FILE_LIST)
        .selectAll("option")
        .remove();
    }

    d3.select(FILE_LIST)
      .selectAll("option")
      .data(this.mD.allFiles)
      .enter()
      .append("option")
      .attr("value", function(d) {
        return d;
      });

    d3.select(FILE_FILTER_BUTTON).on("click", () => {
      const file = d3.select(FILE_SELECTOR).property("value");
      const update = this.processFile(file);
      d3.select(FILE_SELECTOR).property("value", "");
      if (update) {
        this.updateTreemap();
      }
    });

    d3.select(FILE_CLEAR).on("click", () => {
      this.treemapSettings.fileOption.files = [];
      d3.select("#fileList")
        .select(".row")
        .selectAll("div")
        .remove();
      this.updateTreemap();
    });

    d3.select(LIST_TYPE_SLIDER).on("change", () => {
      if (d3.select(LIST_TYPE_SLIDER).property("checked")) {
        this.treemapSettings.fileOption.type = "white";
      } else {
        this.treemapSettings.fileOption.type = "black";
      }
      this.updateTreemap();
    });

    if (this.treemapSettings.fileOption.files.length > 0) {
      this.treemapSettings.fileOption.files.forEach(file => {
        this.addFileToListUI(file);
      });
    }
    if (this.treemapSettings.fileOption.types.length > 0) {
      this.treemapSettings.fileOption.types.forEach(type => {
        this.addFileTypeToListUI(type);
      });
    }
    if (this.treemapSettings.fileOption.type === "white") {
      d3.select(LIST_TYPE_SLIDER).property("checked", true);
    }
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

  private initDropdownStyling() {
    d3.selectAll("option")
      .style("color", "$my-text-color")
      .style("background-color", "#313131");
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
    const SAFE_LABEL = "#fakeSafePicker";
    const DANGER_LABEL = "#fakeDangerPicker";
    const defaultSafeColor = "#008000";
    const defaultDangerColor = "#ff0000";

    d3.select(SAFE_COLOR).on("change", () => {
      const safeColorInput = d3.select(SAFE_COLOR).property("value");
      const dangerColorInput = d3.select(DANGER_COLOR).property("value");
      this.treemapSettings.color.colors[0] = safeColorInput
        ? safeColorInput
        : defaultSafeColor;

      d3.select(SAFE_LABEL).style("background-color", safeColorInput);

      // update Color Bar
      this.updateColorBar(safeColorInput, dangerColorInput);
      // update color in threshold description
      this.initColorThresholdDescription();
      this.updateTreemap();
    });

    d3.select(DANGER_COLOR).on("change", () => {
      const safeColorInput = d3.select(SAFE_COLOR).property("value");
      const dangerColorInput = d3.select(DANGER_COLOR).property("value");

      d3.select(DANGER_LABEL).style("background-color", dangerColorInput);

      this.treemapSettings.color.colors[1] = dangerColorInput
        ? dangerColorInput
        : defaultDangerColor;
      this.treemapSettings.color.colors[2] = dangerColorInput
        ? dangerColorInput
        : defaultDangerColor;

      // update Color Bar
      this.updateColorBar(safeColorInput, dangerColorInput);
      // update color in threshold description
      this.initColorThresholdDescription();
      this.updateTreemap();
    });

    const safeColor = this.treemapSettings.color.colors[0];
    const dangerColor = this.treemapSettings.color.colors[1];
    d3.select(SAFE_COLOR).property("value", safeColor);
    d3.select(DANGER_COLOR).property("value", dangerColor);
    d3.select(SAFE_LABEL).style("background-color", safeColor);
    d3.select(DANGER_LABEL).style("background-color", dangerColor);
    this.updateColorBar(safeColor, dangerColor);
  }

  private updateColorBar(safeColorInput, dangerColorInput) {
    const COLOR_BAR = ".colorGradientBar";
    // update Color Bar
    d3.select(COLOR_BAR)
      .style("height", "36px")
      .style(
        "background-image",
        "linear-gradient(to right," +
          safeColorInput +
          ", " +
          dangerColorInput +
          ")"
      );
  }

  /**
   * initializes color threshold option for treemap.
   */
  private initColorThreshold() {
    const colorMetric = this.treemapSettings.colorOption;
    const min = this.mD.getMinColorMetric(colorMetric);
    const max = this.mD.getMaxColorMetric(colorMetric);
    let dangerThreshold = DangerThresholds[colorMetric];
    dangerThreshold =
      dangerThreshold !== -1 ? dangerThreshold : Math.floor(max * 2);
    const DANGER_THRESHOLD = ".dangerThresholdInput";

    // set default threshold value
    this.setThreshold(min, dangerThreshold, max);

    // display default threshold value
    d3.select(DANGER_THRESHOLD).property("value", dangerThreshold);

    // display default threshold message
    this.initColorThresholdDescription(dangerThreshold);

    // display min and max
    d3.select(".minMaxText").text(
      "Codebase Min " +
        colorMetric +
        ": " +
        min +
        "\n" +
        "Codebase Max " +
        colorMetric +
        ": " +
        max
    );

    // update treemap color based on threshold
    d3.select(DANGER_THRESHOLD).on("change", () => {
      let selectedVal = parseInt(d3.select(DANGER_THRESHOLD).property("value"));
      // check the validity of danger threshold
      if (isNaN(selectedVal) || selectedVal <= 0) {
        selectedVal = this.treemapSettings.color.thresholds[1];
      }
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
    const dangerColorKeyWord = convert.hex.keyword(dangerColor);
    if (!threshold) {
      threshold = this.treemapSettings.color.thresholds[1];
    }

    // threshold description for danger
    d3.select(".selectedValueText").text(
      "values >= " +
        threshold +
        " colored in " +
        dangerColorKeyWord +
        " are in danger."
    );
  }

  private addFileToListUI(name: string) {
    this.addToFilterListUIHelper(name, () => {
      const index = this.treemapSettings.fileOption.files.indexOf(name);
      if (index !== -1) {
        this.treemapSettings.fileOption.files.splice(index, 1);
      }
    });
  }

  private addFileTypeToListUI(name: string) {
    this.addToFilterListUIHelper("*." + name, () => {
      const index = this.treemapSettings.fileOption.types.indexOf(name);
      if (index !== -1) {
        this.treemapSettings.fileOption.types.splice(index, 1);
      }
    });
  }

  private addToFilterListUIHelper(name: string, on) {
    const item = d3
      .select("#fileList")
      .select(".row")
      .append("div")
      .attr("class", "col-md-6");
    const fileItem = item.append("div").attr("class", "fileFilterPanel");
    const fileCard = fileItem
      .append("div")
      .attr("class", "fileName")
      .attr("id", "file");
    fileCard
      .append("p")
      .text(name);
    const mouseHover = fileCard
      .append("div")
      .attr("class", "filterFileMouseHover");

    const button = fileItem.append("button").attr("class", "btn-circle");
    button.append("i").attr("class", "fa fa-times");
    button.on("click", () => {
      on();
      item.remove();
      this.updateTreemap();
    });

    // hover over to see full name of file in filter list
    fileItem.on("mousemove", () => {
      mouseHover.style("left", d3.event.pageX + 10 + "px");
      mouseHover.style("top", d3.event.pageY - 20 + "px");
      mouseHover.style("display", "inline-block");
      mouseHover.text(name);
    })
    .on("mouseout", () => {
      mouseHover.style("display", "none");
    });
  }
}

export default TreemapEventController;