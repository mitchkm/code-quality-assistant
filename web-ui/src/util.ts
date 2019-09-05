import TreemapSetting from "./Treemap/treemapSetting";

export function getUrlVars() {
    const vars = {};
    const parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value): string {
        vars[key] = decodeURIComponent(value);
        return;
    });
    return vars;
}

export function generateUrlParams(chart: string, treemapSettings: TreemapSetting) {
    const tSettings = encodeURI(JSON.stringify(treemapSettings));
    return "?chart=" + chart + "&" + "treemapSettings=" + tSettings;
}