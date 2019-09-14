import TreemapSetting from "./Treemap/treemapSetting";
import InterfaceEventController from "./EventController/InterfaceEventController";
import d3 = require("d3");

export function getUrlVars() {
    const vars = {};
    const parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value): string {
        vars[key] = decodeURIComponent(value);
        return;
    });
    return vars;
}

export function generateUrlParams(treemapSettings: TreemapSetting) {
    const tSettings = encodeURI(JSON.stringify(treemapSettings));
    return "?chart=" + InterfaceEventController.curChartName + "&" + "treemapSettings=" + tSettings;
}

export function fillURLText(treemapSettings: TreemapSetting) {
    console.log("trrigered!");
    const params = generateUrlParams(treemapSettings);
    const mainLink = window.location.href.split("?");
    d3.select("#urlOptionsString").property("value", mainLink[0] + params);
}