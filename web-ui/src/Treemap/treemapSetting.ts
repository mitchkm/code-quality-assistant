interface TreemapSetting {
    width: number;
    height: number;
    // [paddingTop, paddingBottom, paddingLeft, paddingRight]
    paddings: number[];
    color: d3.ScaleLinear<string, string>;
    sizeOption: string;
    colorOption: string;
    fileOption: string;
}

export default TreemapSetting;