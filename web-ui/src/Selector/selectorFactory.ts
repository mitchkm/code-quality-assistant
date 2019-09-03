import FileSelector from "./fileSelector";
import ColorSelector from "./colorSelector";
import SizeSelector from "./sizeSelector";

class SelectorFactory {

    processedData: any;

    constructor(processedData) {
        this.processedData = processedData;
    }

    getSelector(selectorType: string) {
        if (selectorType === undefined) {
            return undefined;
        }
        if (selectorType.toLowerCase() === "file") {
            const fileSelector = new FileSelector(this.processedData);
            return fileSelector;
        }
        if (selectorType.toLowerCase() === "color") {
            const colorSelector = new ColorSelector();
            return colorSelector;
        }
        if (selectorType.toLowerCase() === "size") {
            const sizeSelector = new SizeSelector();
            return sizeSelector;
        }
    }
}

export default SelectorFactory;