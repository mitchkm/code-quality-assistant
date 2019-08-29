import SelectorFactory from "../Selector/selectorFactory";
import d3 = require("d3");
import Treemap from "./treemap";

class TreemapOptions {
    processedData: any;

    constructor(processedData) {
        this.processedData = processedData;
    }

    setUpTreemapOptions(treemap: Treemap) {
        const selectors = new SelectorFactory(this.processedData);

        const fileSelector = selectors.getSelector("file");

        const colorSelector = selectors.getSelector("color");

        const sizeSelector = selectors.getSelector("size");

        fileSelector.createDropDown();
        this.changeFileOption(treemap);

        colorSelector.createDropDown();
        this.changeColorOption(treemap);

        sizeSelector.createDropDown();
        this.changeSizeOption(treemap);
    }

    private changeSizeOption(treemap: Treemap) {
        d3.select("#sizeSelector")
            .on("change", (d) => {
                treemap.updateTreemap();
            });
    }

    private changeColorOption(treemap: Treemap) {
        d3.select("#colorSelector")
            .on("change", (d) => {
                treemap.updateTreemap();
            });
    }

    private changeFileOption(treemap: Treemap) {
        d3.select("#fileSelectButton")
            .on("click", (d) => {
                treemap.updateTreemap();
            });
    }
}

export default TreemapOptions;