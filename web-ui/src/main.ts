import { MetricData, Metrics, AnalysisData } from "./Data/metricData";
import { exampleData } from "./Data/example";
import * as util from "./util";
import Treemap from "./Treemap/treemap";
import TreemapData from "./Data/treemapData";
import treemapSetting from "./Treemap/treemapSetting";
import InterfaceEventController from "./EventController/InterfaceEventController";
import TreemapEventController from "./EventController/TreemapEventController";
import { DangerThresholds } from "./Treemap/thresholds";
import d3 = require("d3");

// Process Data
let data: AnalysisData;
try {
  data = JSON.parse(document.getElementById("rawData").textContent);
} catch (err) {
  console.log("Could not parse injected rawData!" + err);
  console.log("Displaying example data. NOT meaningful data!");
  data = exampleData;
}
// Set path being viewed on webpage
d3.select("#pathInput").property("value", data.path);

// create metric data helper class
const mD = new MetricData(data);

// default color thresholds
const colorMetric = Metrics.CCN;
const defaultMin = mD.getMinColorMetric(colorMetric);
const defaultMax = mD.getMaxColorMetric(colorMetric);
const dangerThreshold = DangerThresholds[colorMetric];
let defaultColorThresholds = [
  defaultMin,
  dangerThreshold,
  defaultMax
];

// default treemap colors [safeColor, dangerColor, dangerColor]
const defaultTreemapColors = ["#008000", "#ff0000", "#ff0000"];

// change threshold if none of the values are in danger
if (defaultMax < dangerThreshold) {
  defaultColorThresholds = [defaultMin, dangerThreshold];
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
  fileOption: {
    list: [],
    type: "black"
  }
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

// Debug fuction
// (window as any).getURLParams = () => {return util.generateUrlParams(treemapSettings); };
