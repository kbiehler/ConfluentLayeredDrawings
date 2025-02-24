import { LayerGraph, layerToBipartite } from "@/model/ds/";
import { GraphLayout } from "./GraphLayout";
import { VertexPositioner, VertexPositionCfg } from "./VertexPositioner";
import { Point2d } from "@/model/types/Point";
import { v4 as uuidv4 } from "uuid";
import { createConflictGraph } from "./VerticalBundeling";
import { rlfColoring } from "../alg/Coloring";
import { InteractionInfo } from "../renderer/InteractionManager";

export type GraphLayoutCfg = {
  vertexPosition: VertexPositionCfg;
};

export function generateLayout<V>(g: LayerGraph<V, any>, cfg: GraphLayoutCfg): [GraphLayout, InteractionInfo] {
  const drawing = new GraphLayout();

  const vertexPositions = new VertexPositioner(cfg.vertexPosition).barycenterPositions(g);

  vertexPositions.forEach((pos, vertex) => {
    drawing.addVertex(vertex, pos, true, String(vertex));
  });

  // drawStaightLine(drawing, vertexPositions, g);

  const adjEdges = new Map<V, Set<string>>();
  g.getVertices().forEach((v) => adjEdges.set(v, new Set()));

  const nLayers = g.getNumLayers();

  for (let layer = 0; layer < nLayers - 1; layer++) {
    const conflictGraph = createConflictGraph(layerToBipartite(g, layer), vertexPositions);
    const edgeColoring = rlfColoring(conflictGraph);

    const diff = (cfg.vertexPosition.layerSpacing - 100) / (edgeColoring.length + 1);
    let x = vertexPositions.get(g.getVerticesInLayer(layer)[0])!.x + 50;

    edgeColoring.forEach((color, _) => {
      x += diff;
      color.forEach((edge) => {
        const edgeIds = drawOnGrid(drawing, vertexPositions.get(edge.source)!, vertexPositions.get(edge.target)!, x);
        edgeIds.forEach((id) => adjEdges.get(edge.source)!.add(id));
        edgeIds.forEach((id) => adjEdges.get(edge.target)!.add(id));
      });
    });
  }

  return [drawing, { adjEdges }];
}

function drawOnGrid(
  graphDrawing: GraphLayout, //
  source: Point2d,
  target: Point2d,
  xVertical: number
): Set<string> {
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

  const ids = new Set<string>();

  ids.add(addEdge(graphDrawing, l1));
  ids.add(addEdge(graphDrawing, l2));
  ids.add(addEdge(graphDrawing, l3));
  ids.add(addEdge(graphDrawing, l4));
  ids.add(addEdge(graphDrawing, l5));
  ids.add(addEdge(graphDrawing, l6));
  ids.add(addEdge(graphDrawing, l7));
  return ids;
}

function addEdge(
  graphDrawing: GraphLayout, //
  points: number[][]
) {
  const id = uuidv4();
  graphDrawing.addEdgeDrawing({ id: id, points: points.map((p) => ({ x: p[0], y: p[1] })) });
  return id;
}
