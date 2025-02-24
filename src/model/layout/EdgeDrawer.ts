import { Point2d } from "../types/Point";
import { GraphLayout } from "./GraphLayout";
import { v4 as uuidv4 } from "uuid";
import { LayerGraph } from "@/model/ds/LayerGraph";

export function drawStaightLine<V>(drawing: GraphLayout, vertexPositions: Map<V, Point2d>, g: LayerGraph<V, any>) {
  g.getEdges().forEach((edge) => {
    drawing.addEdgeDrawing({ id: uuidv4(), points: [vertexPositions.get(edge.source)!, vertexPositions.get(edge.target)!] });
  });
}
