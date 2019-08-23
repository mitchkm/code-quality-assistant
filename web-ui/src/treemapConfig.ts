import d3 = require("d3");
import { MetricData } from "./metricData";
import { exampleData } from "./example";
import FileSelector from "./fileSelector";

class TreemapConfig {

    width: number;

    height: number;

    sizeOption: string;

    colorOption: string;

    fileOption: string;

    constructor(width: number, height: number, sizeOption: string, colorOption: string, fileOption = "none") {
        this.width = width;

        this.height = height;

        this.sizeOption = sizeOption;

        this.colorOption = colorOption;

        this.fileOption = fileOption;
    }

    private readData() {
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

        if (this.fileOption !== "none") {
            // Need to fix this
            mD.ignore(this.fileOption);
        }

        const processedData: any = mD.toTreemapData(this.sizeOption, this.colorOption);
        return processedData;
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

    private createDropdownForFiles(processedData) {
        const fileSelector = new FileSelector(processedData);
        fileSelector.createDropDown();
    }

    protected createNodes() {
        const processedData = this.readData();

        // create dropdown menu for files
        if (this.fileOption === "none") {
            this.createDropdownForFiles(processedData);
        }

        const root = d3.hierarchy(processedData);
        const treemap = this.createTreemap(0.3, 0.3, 0.3, 0.3);
        const nodes = treemap(root
                                .sort(d => d.value)
                                .sort((a, b) => a.value - b.value));
        return nodes;
    }
}

export default TreemapConfig;