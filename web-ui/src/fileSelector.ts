import d3 = require("d3");
import Treemap from "./treemap";

class FileSelector {

    processedData: any;

    fileNames: string[];

    constructor(processedData) {
        this.processedData = processedData;
    }

    createDropDown() {
        const fileNames = this.getFileNames(this.processedData);
        // delete existing dropdown
        if (d3.select("option") !== undefined) {
            d3.selectAll("option").remove();
        }

        d3.select("#fileSelector")
            .append("option")
            .text("none")
            .attr("value", "none");

        let i;
        for (i = 0; i < fileNames.length; i++) {
            d3.select("#fileSelector")
                .append("option")
                .text(fileNames[i])
                .attr("value", fileNames[i]);
        }
    }

    private getFileNames(processedData) {
        const fileList = [];
        let i;
        for (i = 0; i < processedData.children.length; i++) {
            fileList.push(processedData.children[i].name);
        }
        return fileList;
    }
}

export default FileSelector;