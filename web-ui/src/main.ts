import { MetricData, Metrics } from "./Data/metricData";
import { exampleData } from "./Data/example";
import * as util from "./util";
import Treemap from "./Treemap/treemap";
import TreemapData from "./Data/treemapData";
import treemapSetting from "./Treemap/treemapSetting";
import InterfaceEventController from "./EventController/InterfaceEventController";
import TreemapEventController from "./EventController/TreemapEventController";
import { DangerThresholds, WarningThresholds } from "./Treemap/thresholds";

// Process Data
let data;
try {
  data = JSON.parse(document.getElementById("rawData").textContent);
} catch (err) {
  console.log("Could not parse injected rawData!" + err);
  console.log("Displaying example data. NOT meaningful data!");
  data = exampleData;
}

// create metric data helper class
const mD = new MetricData(data);

// default color thresholds
const colorMetric = Metrics.CCN;
const defaultMin = mD.getMinColorMetric(colorMetric);
const defaultMax = mD.getMaxColorMetric(colorMetric);
const dangerThreshold = DangerThresholds[colorMetric];
const warningThreshold = WarningThresholds[colorMetric];
let defaultColorThresholds = [
  defaultMin,
  warningThreshold,
  dangerThreshold,
  defaultMax
];

// default treemap colors [safeColor, warningColor, dangerColor, dangerColor]
let defaultTreemapColors = ["green", "orange", "red", "red"];

// change threshold if none of the values are in danger
if (defaultMax < dangerThreshold) {
  defaultColorThresholds = [defaultMin, warningThreshold, dangerThreshold];
}
// change threshold if none of the values are in warning
if (defaultMax < warningThreshold) {
  defaultColorThresholds = [defaultMin, warningThreshold];
  defaultTreemapColors = ["green", "orange", "orange", "orange"];
}

// Get URL injected paramters
const urlParams: any = util.getUrlVars();

// Treemap Default Settings
const treemapSettings: treemapSetting = {
  width: 100,
  height: 100,
  paddings: [0.3, 0.3, 0.3, 0.3],
  color: {
    colors: defaultTreemapColors,
    thresholds: defaultColorThresholds
  },
  sizeOption: Metrics.NLOC,
  colorOption: Metrics.CCN,
  fileOption: "none"
};

// Check for custom treemap settings
let tSettings = {};
try {
  tSettings = JSON.parse(urlParams.treemapSettings);
} catch {}
for (const key in treemapSettings) {
  if (tSettings[key]) {
    treemapSettings[key] = tSettings[key];
  }
}

// create treemap
const processedData: TreemapData = mD.toTreemapData(
  treemapSettings.sizeOption,
  treemapSettings.colorOption
);
const treemap = new Treemap(processedData, treemapSettings);
treemap.drawTreemap();

// set up DOM elements
InterfaceEventController.init(urlParams["chart"]);

const treemapController = TreemapEventController.instance;
treemapController.setContext(mD, treemap, treemapSettings);
treemapController.init();

console.log(util.generateUrlParams("treemap", treemapSettings));
