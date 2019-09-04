import ColorSetting from "./colorSetting";

interface TreemapSetting {
    width: number;
    height: number;
    // [paddingTop, paddingBottom, paddingLeft, paddingRight]
    paddings: number[];
    color: ColorSetting;
    sizeOption: string;
    colorOption: string;
    fileOption: string;
}

export default TreemapSetting;