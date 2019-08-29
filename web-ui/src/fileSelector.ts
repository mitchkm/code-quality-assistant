import d3 = require("d3");

class FileSelector implements Selector {

    processedData: any;

    constructor(processedData) {
        this.processedData = processedData;
    }

    createDropDown() {
        const fileNames = this.createOptions();
        // delete existing dropdown options
        if (d3.select("#fileOptions").select("option") !== undefined) {
            d3.select("#fileOptions").selectAll("option").remove();
        }

        d3.select("#fileOptions")
            .selectAll("option")
            .data(fileNames)
            .enter()
            .append("option")
            .attr("value", function(d) { return d; });
    }

    private createOptions() {
        const fileList = ["none"];
        let i;
        for (i = 0; i < this.processedData.children.length; i++) {
            fileList.push(this.processedData.children[i].name);
        }
        return fileList;
    }
}

export default FileSelector;