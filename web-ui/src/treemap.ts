import d3 = require("d3");

// singleton
let instance = undefined;

class Treemap {

    width: number;
    height: number;
    constructor(width, height, data) {
        if (!instance) {
            instance = this;
        }

        this.width = width;

        this.height = height;

        (this as any).data = data;

        (this as any).root = d3.hierarchy(data);

        return instance;
    }

    private createTreemap(paddingTop, paddingBottom, paddingLeft, paddingRight) {
        const treemap = d3.treemap()
                        .size([this.width, this.height])
                        // .tile(d3.treemapResquarify)
                        .round(false)
                        .paddingTop(paddingTop)
                        .paddingBottom(paddingBottom)
                        .paddingLeft(paddingLeft)
                        .paddingRight(paddingRight);
        return treemap;
    }

    createNodes() {
        const treemap = this.createTreemap(0.3, 0.3, 0.3, 0.3);
        const nodes = treemap((this as any).root
                                .sort(d => d.value)
                                .sort((a, b) => a.value - b.value));
        return nodes;
    }
}

export default Treemap;