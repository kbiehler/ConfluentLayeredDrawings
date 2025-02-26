import { Point2d } from "../types/Point";
import { GraphLayout } from "./GraphLayout";
import { v4 as uuidv4 } from "uuid";
import { LayerGraph, layerToBipartite, Edge } from "@/model/ds/";
import { createConflictGraph } from "./VerticalBundelingConflict";
import { rlfColoring } from "@/model/alg/Coloring";
import { verticalLayerOrdering } from "./VerticalLayerOrdering";

export enum EdgeDrawingAlgorithm {
  STRAIGHT_LINE = "straight lines",
  VERTICAL_BUNDELING = "vertical bundeling with VC",
  VERTICAL_BUNDELING_ORDERING = "vertical bundeling with VC and FVS",
}

export function drawEdges<V>(alg: EdgeDrawingAlgorithm, g: LayerGraph<V, any>, vertexPositions: Map<V, Point2d>, layout: GraphLayout): Map<V, Set<string>> {
  let adjEdges = new Map<V, Set<string>>();
  g.getVertices().forEach((v) => adjEdges.set(v, new Set()));

  switch (alg) {
    case EdgeDrawingAlgorithm.STRAIGHT_LINE:
      adjEdges = drawStaightLine(g, vertexPositions, layout);
      break;
    case EdgeDrawingAlgorithm.VERTICAL_BUNDELING:
      adjEdges = drawVerticalVC(g, vertexPositions, layout, false);
      break;
    case EdgeDrawingAlgorithm.VERTICAL_BUNDELING_ORDERING:
      adjEdges = drawVerticalVC(g, vertexPositions, layout, true);
      break;
  }
  return adjEdges;
}

export function drawVerticalVC<V>(g: LayerGraph<V, any>, vertexPositions: Map<V, Point2d>, layout: GraphLayout, ordering: boolean): Map<V, Set<string>> {
  const adjEdges = new Map<V, Set<string>>();
  g.getVertices().forEach((v) => adjEdges.set(v, new Set()));

  const edgeToX = edgeToVerticalWithColoring(g, vertexPositions, ordering);

  edgeToX.forEach((x, edge) => {
    const edgeIds = drawEdgeWithVertical(layout, vertexPositions.get(edge.source)!, vertexPositions.get(edge.target)!, x);
    edgeIds.forEach((id) => adjEdges.get(edge.source)!.add(id));
    edgeIds.forEach((id) => adjEdges.get(edge.target)!.add(id));
  });
  return adjEdges;
}

function edgeToVerticalWithColoring<V>(g: LayerGraph<V, any>, vertexPositions: Map<V, Point2d>, ordering: boolean): Map<Edge<V>, number> {
  const map = new Map<Edge<V>, number>();
  const nLayers = g.getNumLayers();

  for (let layer = 0; layer < nLayers - 1; layer++) {
    const conflictGraph = createConflictGraph(layerToBipartite(g, layer), vertexPositions);
    let edgeColoring = rlfColoring(conflictGraph);
    if (ordering) {
      edgeColoring = verticalLayerOrdering(vertexPositions, edgeColoring);
    }
    const layerSpacing = vertexPositions.get(g.getVerticesInLayer(layer + 1)[0])!.x - vertexPositions.get(g.getVerticesInLayer(layer)[0])!.x;

    const diff = (layerSpacing - 150) / (edgeColoring.length + 1);
    let x = vertexPositions.get(g.getVerticesInLayer(layer)[0])!.x + 75;

    edgeColoring.forEach((color, _) => {
      x += diff;
      color.forEach((edge) => {
        map.set(edge, x);
      });
    });
  }
  return map;
}

function drawEdgeWithVertical(
  layout: GraphLayout, //
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

  ids.add(addEdgeToDrawing(layout, l1));
  ids.add(addEdgeToDrawing(layout, l2));
  ids.add(addEdgeToDrawing(layout, l3));
  ids.add(addEdgeToDrawing(layout, l4));
  ids.add(addEdgeToDrawing(layout, l5));
  ids.add(addEdgeToDrawing(layout, l6));
  ids.add(addEdgeToDrawing(layout, l7));
  return ids;
}

function addEdgeToDrawing(
  layout: GraphLayout, //
  points: number[][]
) {
  const id = uuidv4();
  layout.addEdgeDrawing({ id: id, points: points.map((p) => ({ x: p[0], y: p[1] })) });
  return id;
}

export function drawStaightLine<V>(g: LayerGraph<V, any>, vertexPositions: Map<V, Point2d>, layout: GraphLayout): Map<V, Set<string>> {
  const adjEdges = new Map<V, Set<string>>();
  g.getVertices().forEach((v) => adjEdges.set(v, new Set()));
  g.getEdges().forEach((edge) => {
    const id = uuidv4();
    layout.addEdgeDrawing({ id: id, points: [vertexPositions.get(edge.source)!, vertexPositions.get(edge.target)!] });
    adjEdges.get(edge.source)!.add(id);
    adjEdges.get(edge.target)!.add(id);
  });
  return adjEdges;
}
