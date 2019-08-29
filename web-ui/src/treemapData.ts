import { MetricData } from "./metricData";
import { exampleData } from "./example";

class TreemapData {

    sizeOption: string;

    colorOption: string;

    fileOption: string;

    constructor(sizeOption = "nloc", colorOption = "ccn", fileOption = "none") {

        this.sizeOption = sizeOption;

        this.colorOption = colorOption;

        this.fileOption = fileOption;
    }

    processData() {
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
            mD.ignore(this.fileOption);
        }

        const processedData: any = mD.toTreemapData(this.sizeOption, this.colorOption);
        return processedData;
    }
}

export default TreemapData;