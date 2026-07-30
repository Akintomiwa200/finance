declare module "dotted-map" {
  export interface DottedMapPin {
    lat: number;
    lng: number;
    svgOptions?: {
      color?: string;
      radius?: number;
    };
  }

  export interface DottedMapSvgOptions {
    shape?: "circle" | "hexagon";
    backgroundColor?: string;
    color?: string;
    radius?: number;
  }

  export interface DottedMapSettings {
    height?: number;
    width?: number;
    grid?: "vertical" | "diagonal";
    countries?: string[];
  }

  export default class DottedMap {
    constructor(settings?: DottedMapSettings);
    addPin(pin: DottedMapPin): void;
    getSVG(options?: DottedMapSvgOptions): string;
  }

  export function getMapJSON(settings?: DottedMapSettings): string;
}
