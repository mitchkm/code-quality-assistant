import TreemapSetting from "./Treemap/treemapSetting";
import InterfaceEventController from "./EventController/InterfaceEventController";

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