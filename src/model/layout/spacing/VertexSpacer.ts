import { LayerGraph, Vertex } from "@/model/ds";
import _ from "lodash";

export interface VertexSpacer {
  width(layer: number): number;
  height(layer: number): number;
  label(v: Vertex): string;
}

export class CliqueCenterVertexSpacer implements VertexSpacer {
  g: LayerGraph;
  layerToWidth: Map<number, number>;

  constructor(g: LayerGraph) {
    this.g = g;
    this.layerToWidth = new Map<number, number>();
    for (let i = 0; i < g.getLayerCount(); i++) {
      if (g.getVerticesInLayer(i).some((v) => v.isCliqueCenter())) {
        this.layerToWidth.set(i, 0);
      } else {
        const width = _.max(g.getVerticesInLayer(i).map((v) => getTextSize(v.getLabel()).width))! + 50;
        this.layerToWidth.set(i, Math.min(Math.max(100, width), 250));
      }
    }
  }

  width(layer: number): number {
    return this.layerToWidth.get(layer)!;
  }

  height(_: number): number {
    return 50;
  }

  label(v: Vertex): string {
    if (v.isCliqueCenter()) {
      return "";
    }
    const width = this.width(this.g.getLayer(v));
    const label = v.getLabel();
    if (getTextSize(label).width < width - 20) {
      return label;
    }
    for (let i = label.length - 1; i > 0; i--) {
      const substring = label.substring(0, i) + "...";
      if (getTextSize(substring).width < width - 20) {
        return substring;
      }
    }
    return "...";
  }
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
