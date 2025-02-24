import { LayerGraph } from "@/model/ds/";
import { GraphLayout } from "./GraphLayout";
import { VertexPositioner, VertexPositionCfg } from "./VertexPositioner";
import { Point2d } from "@/model/types/Point";
import { v4 as uuidv4 } from "uuid";
import { createConflictGraph } from "./VerticalBundeling";

export type GraphLayoutCfg = {
  vertexPosition: VertexPositionCfg;
};

export function straightLineDrawing<V>(g: LayerGraph<V, any>, cfg: GraphLayoutCfg): GraphLayout {
  const drawing = new GraphLayout();

  const vertexPositions = new VertexPositioner(cfg.vertexPosition).barycenterPositions(g);

  vertexPositions.forEach((pos, vertex) => {
    drawing.addVertex(String(vertex), pos, true, String(vertex));
  });

  createConflictGraph(g.getAsBipartite(0), vertexPositions);

  // drawStaightLine(drawing, vertexPositions, g);

  const nLayers = g.getNumLayers();

  for (let layer = 0; layer < nLayers - 1; layer++) {
    const edges = g.getEdgesBetween(layer);
    const diff = (cfg.vertexPosition.layerSpacing - 100) / (edges.length + 1);
    let x = vertexPositions.get(g.getVerticesInLayer(layer)[0])!.x + 50;
    edges.forEach((edge) => {
      drawOnGrid(drawing, vertexPositions.get(edge.source)!, vertexPositions.get(edge.target)!, x);
      x += diff;
    });
  }

  return drawing;
}

function drawOnGrid(
  graphDrawing: GraphLayout, //
  source: Point2d,
  target: Point2d,
  xVertical: number
) {
  const radius = 25;
  const [xSource, ySource] = [source.x, source.y];
  const [xTarget, yTarget] = [target.x, target.y];
  const down = ySource < yTarget ? 1 : ySource === yTarget ? 0 : -1;

  const l1 = [
    [xSource, ySource],
    [xVertical - radius, ySource],
  ];

  const l2 = [
    [xSource, ySource],
    [xVertical - radius, ySource],
  ];

  const l3 = [
    [xVertical - radius, ySource],
    [xVertical, ySource],
    [xVertical, ySource + radius * down],
  ];

  const l4 = [
    [xVertical - radius, ySource],
    [xVertical, ySource],
    [xVertical, ySource + radius * down],
  ];

  const l5 = [
    [xVertical, ySource + radius * down],
    [xVertical, yTarget - radius * down],
  ];

  const l6 = [
    [xVertical, yTarget - radius * down],
    [xVertical, yTarget],
    [xVertical + radius, yTarget],
  ];

  const l7 = [
    [xVertical + radius, yTarget],
    [xTarget, yTarget],
  ];
  addEdge(graphDrawing, l1);
  addEdge(graphDrawing, l2);
  addEdge(graphDrawing, l3);
  addEdge(graphDrawing, l4);
  addEdge(graphDrawing, l5);
  addEdge(graphDrawing, l6);
  addEdge(graphDrawing, l7);
}

function addEdge(
  graphDrawing: GraphLayout, //
  points: number[][]
) {
  graphDrawing.addEdgeDrawing({ id: uuidv4(), points: points.map((p) => ({ x: p[0], y: p[1] })) });
}
