import { LayerGraph } from "@/model/ds/LayerGraph";
import { GraphLayout } from "./GraphLayout";
import { VertexPositioner, VertexPositionCfg } from "./VertexPositioner";
import { v4 as uuidv4 } from "uuid";

export type DrawingAlgorithmCfg = {
  vertexPosition: VertexPositionCfg;
};

export function straightLineDrawing<V>(g: LayerGraph<V, any>, cfg: DrawingAlgorithmCfg): GraphLayout {
  const drawing = new GraphLayout();

  const vertexPositions = new VertexPositioner(cfg.vertexPosition).barycenterPositions(g);

  vertexPositions.forEach((pos, vertex) => {
    drawing.addVertex(String(vertex), pos, true, String(vertex));
  });

  g.getEdges().forEach((edge) => {
    drawing.addEdgeDrawing({ id: uuidv4(), points: [vertexPositions.get(edge.source)!, vertexPositions.get(edge.target)!] });
  });

  return drawing;
}
