import { LayerGraph, Vertex } from "@/model/ds";
import _ from "lodash";

export enum VertexSpacerType {
  FIXED_SIZE = "fixedSize",
  MIN_MAX = "minMax",
  DYNAMIC = "dynamic",
}

export type VertexSpacerConfig = {
  type: VertexSpacerType;
  textPadding: number;
  v_height: number;
  v_width?: number; // Only for FixedSizeVertexSpacer
  width_min?: number; // Only for MinMaxVertexSpacer and DynamicVertexSpacer
  width_max?: number; // Only for MinMaxVertexSpacer and DynamicVertexSpacer
  show_percentage?: number; // Only for DynamicVertexSpacer
};

export function createVertexSpacer(g: LayerGraph, cfg: VertexSpacerConfig): VertexSpacer {
  switch (cfg.type) {
    case VertexSpacerType.FIXED_SIZE:
      return new FixedSizeVertexSpacer(g, cfg.textPadding, cfg.v_width!, cfg.v_height);
    case VertexSpacerType.MIN_MAX:
      return new MinMaxVertexSpacer(g, cfg.textPadding, cfg.v_height, cfg.width_min!, cfg.width_max!);
    case VertexSpacerType.DYNAMIC:
      return new DynamicVertexSpacer(g, cfg.textPadding, cfg.v_height, cfg.width_min!, cfg.width_max!, cfg.show_percentage!);
    default:
      throw new Error("Invalid VertexSpacer type");
  }
}

export abstract class VertexSpacer {
  cliqueCenter: Set<number>;

  constructor(protected g: LayerGraph, protected textPadding: number = 20) {
    this.cliqueCenter = new Set<number>();
    for (let i = 0; i < g.getLayerCount(); i++) {
      if (g.getVerticesInLayer(i).some((v) => v.isCliqueCenter())) {
        this.cliqueCenter.add(i);
      }
    }
  }

  abstract width(layer: number): number;
  abstract height(layer: number): number;
  label(v: Vertex): string {
    if (v.isCliqueCenter()) {
      return "";
    }
    const width = this.width(this.g.getLayer(v));
    const label = v.getLabel();
    if (getTextSize(label).width < width - this.textPadding) {
      return label;
    }
    for (let i = label.length - 1; i > 0; i--) {
      const substring = label.substring(0, i) + "...";
      if (getTextSize(substring).width <= width - this.textPadding) {
        return substring;
      }
    }
    return "...";
  }
}

export class FixedSizeVertexSpacer extends VertexSpacer {
  constructor(
    g: LayerGraph, //
    textPadding: number,
    private v_width: number,
    private v_height: number
  ) {
    super(g, textPadding);
  }

  width(layer: number): number {
    if (this.cliqueCenter.has(layer)) {
      return 0;
    }
    return this.v_width;
  }
  height(layer: number): number {
    if (this.cliqueCenter.has(layer)) {
      return 0;
    }
    return this.v_height;
  }
}

export class MinMaxVertexSpacer extends VertexSpacer {
  layerToWidth: Map<number, number>;

  constructor(
    g: LayerGraph, //
    textPadding: number,
    private v_height: number,
    width_min: number,
    width_max: number
  ) {
    super(g, textPadding);
    this.layerToWidth = new Map<number, number>();
    for (let i = 0; i < g.getLayerCount(); i++) {
      if (this.cliqueCenter.has(i)) {
        this.layerToWidth.set(i, 0);
      } else {
        const width = _.max(g.getVerticesInLayer(i).map((v) => getTextSize(v.getLabel()).width))! + this.textPadding;
        this.layerToWidth.set(i, Math.min(Math.max(width_min, width), width_max));
      }
    }
  }

  width(layer: number): number {
    return this.layerToWidth.get(layer)!;
  }

  height(_: number): number {
    return this.v_height;
  }
}

export class DynamicVertexSpacer extends VertexSpacer {
  layerToWidth: Map<number, number>;

  constructor(
    g: LayerGraph, //
    textPadding: number,
    private v_height: number,
    width_min: number,
    width_max: number,
    show_percentage: number
  ) {
    super(g, textPadding);
    this.layerToWidth = new Map<number, number>();
    for (let i = 0; i < g.getLayerCount(); i++) {
      if (this.cliqueCenter.has(i)) {
        this.layerToWidth.set(i, 0);
      } else {
        const allWidths = g.getVerticesInLayer(i).map((v) => getTextSize(v.getLabel()).width);
        const width = getPercentile(allWidths, show_percentage) + this.textPadding + 1; //+1 for rounding errors
        this.layerToWidth.set(i, Math.min(Math.max(width_min, width), width_max));
      }
    }
  }

  width(layer: number): number {
    return this.layerToWidth.get(layer)!;
  }

  height(_: number): number {
    return this.v_height;
  }
}

function getPercentile(arr: number[], percentile: number): number {
  const sorted = _.sortBy(arr);
  const index = Math.min(Math.ceil(arr.length * percentile), arr.length - 1);
  return sorted[index];
}

function getTextSize(text: string, fontSize: number = 17, fontFamily: string = "Arial"): { width: number; height: number } {
  // Create an offscreen canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas rendering context not available");
  }

  // Set the font style
  ctx.font = `${fontSize}px ${fontFamily}`;

  // Measure text width
  const metrics = ctx.measureText(text);
  const width = metrics.width;

  // Approximate height using font size (more reliable than measureText().actualBoundingBoxAscent)
  const height = fontSize;

  return { width, height };
}
