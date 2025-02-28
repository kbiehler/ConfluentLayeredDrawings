import { GraphLayout } from "@/model/layout/GraphLayout";
import { v4 as uuidv4 } from "uuid";
import { LayerGraph, convertLayerToBiGraph, Edge, BipartiteGraph } from "@/model/ds/";
import { createConflictGraph } from "./VerticalBundelingConflict";
import { rlfColoring } from "@/model/alg/Coloring";
import { verticalLayerOrdering } from "./VerticalLayerOrdering";
import { DynamicalLayerSpacer } from "../spacing/LayerSpacer";
import { Vertex } from "@/model/ds/Vertex";

// radius of the quater circles in the confluent drawing
const RADIUS = 25;

export function drawVerticalBundeling(
  g: LayerGraph, //
  yPosition: (v: Vertex) => number,
  layout: GraphLayout,
  isCliqueCenter: (v: Vertex) => boolean
): [Map<Vertex, Set<string>>, DynamicalLayerSpacer] {
  let edgeToX = new Map<Edge<Vertex>, number>();

  const nLayers = g.getLayerCount();
  const verticLayers: Set<Edge<Vertex>>[][] = [];
  for (let layer = 0; layer < nLayers - 1; layer++) {
    const biGraph = convertLayerToBiGraph(g, layer);
    const tmpVerticLayers = assignLayers(biGraph, yPosition);
    verticLayers.push(tmpVerticLayers);
  }
  const vericLayerSpacer = new DynamicalLayerSpacer(
    g,
    verticLayers.map((l) => l.length)
  );
  for (let i = 0; i < verticLayers.length; i++) {
    const layer = verticLayers[i];
    for (let j = 0; j < layer.length; j++) {
      const edges = layer[j];
      const x = vericLayerSpacer.xPositionVertical(i, j);
      edges.forEach((edge) => edgeToX.set(edge, x));
    }
  }

  return [drawEdges(g, edgeToX, layout, vericLayerSpacer, yPosition, isCliqueCenter), vericLayerSpacer];
}

/**
 * assigns each edge to a layer,
 * using a coloring heuristic to bundle the edges and a
 * greedy FAS algorithm to order the bundled edges s.t. crossings are minimized
 *
 * @param g
 * @param vertexPositions
 * @returns integers (starting at 0) that map each edge to its vert layer
 */
function assignLayers(biGraph: BipartiteGraph, vertexPosition: (v: Vertex) => number): Set<Edge<Vertex>>[] {
  const conflictGraph = createConflictGraph(biGraph, vertexPosition);
  let bundeling = rlfColoring(conflictGraph);
  let orderedEdges = verticalLayerOrdering(vertexPosition, bundeling);
  return orderedEdges;
}

function vertLayersToXvalues<V>(vertLayerStart: number, vertLayerEnd: number, relativeAssignment: Set<Edge<V>>[]) {
  const edgeToX = new Map<Edge<V>, number>();
  const diff = (vertLayerEnd - vertLayerStart) / (relativeAssignment.length + 1);
  let x = vertLayerStart;
  relativeAssignment.forEach((layer, _) => {
    x += diff;
    layer.forEach((edge) => {
      edgeToX.set(edge, x);
    });
  });
  return edgeToX;
}

function drawEdges(
  g: LayerGraph, //
  edgeToX: Map<Edge<Vertex>, number>,
  layout: GraphLayout,
  xPositions: DynamicalLayerSpacer,
  yPosition: (v: Vertex) => number,
  isCliqueCenter: (v: Vertex) => boolean
): Map<Vertex, Set<string>> {
  const adjEdges = new Map<Vertex, Set<string>>(); //vertex to edge ids of drawn edges
  g.getVertices().forEach((v) => adjEdges.set(v, new Set()));

  const drawer = new Drawer();
  edgeToX.forEach((x, edge) => {
    const edgeIds = drawer.drawEdge(layout, xPositions.xPosition(edge.source), yPosition(edge.source), xPositions.xPosition(edge.target), yPosition(edge.target), x);
    if (isCliqueCenter(edge.source)) {
      //add ids to vertices infront of TreeCenter
      g.getIncendentIn(edge.source).forEach((e) => edgeIds.forEach((id) => adjEdges.get(e.source)!.add(id)));
    } else {
      edgeIds.forEach((id) => adjEdges.get(edge.source)!.add(id));
    }
    if (isCliqueCenter(edge.target)) {
      g.getIncidentOut(edge.target).forEach((e) => edgeIds.forEach((id) => adjEdges.get(e.target)!.add(id)));
    } else {
      edgeIds.forEach((id) => adjEdges.get(edge.target)!.add(id));
    }
  });
  return adjEdges;
}

class Drawer {
  drawnEdgesToID: Map<string, string> = new Map();

  drawEdge(
    layout: GraphLayout, //
    xSource: number,
    ySource: number,
    xTarget: number,
    yTarget: number,
    xVertical: number
  ): Set<string> {
    const down = ySource < yTarget ? 1 : ySource === yTarget ? 0 : -1;

    const l1 = [
      [xSource, ySource],
      [xVertical - RADIUS, ySource],
    ];

    const l2 = [
      [xSource, ySource],
      [xVertical - RADIUS, ySource],
    ];

    const l3 = [
      [xVertical - RADIUS, ySource],
      [xVertical, ySource],
      [xVertical, ySource + RADIUS * down],
    ];

    const l4 = [
      [xVertical - RADIUS, ySource],
      [xVertical, ySource],
      [xVertical, ySource + RADIUS * down],
    ];

    const l5 = [
      [xVertical, ySource + RADIUS * down],
      [xVertical, yTarget - RADIUS * down],
    ];

    const l6 = [
      [xVertical, yTarget - RADIUS * down],
      [xVertical, yTarget],
      [xVertical + RADIUS, yTarget],
    ];

    const l7 = [
      [xVertical + RADIUS, yTarget],
      [xTarget, yTarget],
    ];

    const ids = new Set<string>();

    ids.add(this.addSegment(layout, l1));
    ids.add(this.addSegment(layout, l2));
    ids.add(this.addSegment(layout, l3));
    ids.add(this.addSegment(layout, l4));
    ids.add(this.addSegment(layout, l5));
    ids.add(this.addSegment(layout, l6));
    ids.add(this.addSegment(layout, l7));
    return ids;
  }

  addSegment(
    layout: GraphLayout, //
    points: number[][]
  ) {
    const pointsKey = JSON.stringify(points);
    if (this.drawnEdgesToID.has(pointsKey)) {
      return this.drawnEdgesToID.get(pointsKey)!;
    }
    const id = uuidv4();
    layout.addEdgeDrawing({ id: id, points: points.map((p) => ({ x: p[0], y: p[1] })) });
    this.drawnEdgesToID.set(pointsKey, id);
    return id;
  }
}
