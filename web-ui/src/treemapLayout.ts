import d3 = require("d3");
import { exampleData } from "./example";
import { MetricData } from "./metricData";

class TreemapLayout {

    width: number;
    height: number;
    sizeOption: string;
    colorOption: string;
    constructor(width: number, height: number, sizeOption: string, colorOption: string) {
        this.width = width;
        this.height = height;
        this.sizeOption = sizeOption;
        this.colorOption = colorOption;
    }

    private createTreemap(paddingTop, paddingBottom, paddingLeft, paddingRight) {
        const treemap = d3.treemap()
                        .size([this.width, this.height])
                        .tile(d3.treemapResquarify)
                        .round(false)
                        .paddingTop(paddingTop)
                        .paddingBottom(paddingBottom)
                        .paddingLeft(paddingLeft)
                        .paddingRight(paddingRight);
        return treemap;
    }

    protected createNodes() {
        let data;
        try {
            data = JSON.parse(document.getElementById("rawData").textContent);
        } catch (err) {
            console.log("Could not parse injected rawData!" + err);
            console.log("Displaying exampleData");
            data = exampleData;
        }

        // TODO process data:
        const mD = new MetricData(data);
        const processedData: any = mD.toTreemapData(this.sizeOption, this.colorOption);
        const root = d3.hierarchy(processedData);
        const treemap = this.createTreemap(0.3, 0.3, 0.3, 0.3);
        const nodes = treemap(root
                                .sort(d => d.value)
                                .sort((a, b) => a.value - b.value));
        // console.log(nodes);
        return nodes;
    }
}

export default TreemapLayout;