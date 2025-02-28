import { Point2d } from "@/model/types/Point";
import { GraphLayout } from "@/model/layout/GraphLayout";
import { v4 as uuidv4 } from "uuid";
import { LayerGraph, convertLayerToBiGraph, Edge, BipartiteGraph } from "@/model/ds/";
import { createConflictGraph } from "./VerticalBundelingConflict";
import { rlfColoring } from "@/model/alg/Coloring";
import { verticalLayerOrdering } from "./VerticalLayerOrdering";

//space between vertexPositon (later centerPoint of the vertex in the drawing) and first vertical line.
//(should maybe depend on the drawing size of a vertex, for now a constant)
const SPACING_VERTEX_LAYER = 150;
// radius of the quater circles in the confluent drawing
const RADIUS = 25;

export function drawVerticalBundeling<V>(g: LayerGraph<V, any>, vertexPositions: Map<V, Point2d>, layout: GraphLayout): Map<V, Set<string>> {
  let edgeToX = new Map<Edge<V>, number>();

  const nLayers = g.getLayerCount();
  for (let layer = 0; layer < nLayers - 1; layer++) {
    const biGraph = convertLayerToBiGraph(g, layer);
    const relativeAssignment = assignLayers(biGraph, vertexPositions);

    const xLeft = vertexPositions.get(biGraph.getVerticesA()[0])!.x;
    const xRight = vertexPositions.get(biGraph.getVerticesB()[0])!.x;

    const tmpEdgeToX = layersToXvalues(xLeft, xRight - xLeft, relativeAssignment);
    tmpEdgeToX.forEach((x, edge) => edgeToX.set(edge, x));
  }

  return drawEdges(g, edgeToX, layout, vertexPositions);
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
function assignLayers<V>(biGraph: BipartiteGraph<V, any>, vertexPositions: Map<V, Point2d>): Set<Edge<V>>[] {
  const conflictGraph = createConflictGraph(biGraph, vertexPositions);
  let bundeling = rlfColoring(conflictGraph);
  let orderedEdges = verticalLayerOrdering(vertexPositions, bundeling);
  return orderedEdges;
}

function layersToXvalues<V>(layerStart: number, layerWidth: number, relativeAssignment: Set<Edge<V>>[]) {
  const edgeToX = new Map<Edge<V>, number>();
  const diff = (layerWidth - SPACING_VERTEX_LAYER) / (relativeAssignment.length + 1);
  let x = layerStart + SPACING_VERTEX_LAYER / 2;
  relativeAssignment.forEach((layer, _) => {
    x += diff;
    layer.forEach((edge) => {
      edgeToX.set(edge, x);
    });
  });
  return edgeToX;
}

function drawEdges<V>(g: LayerGraph<V, any>, edgeToX: Map<Edge<V>, number>, layout: GraphLayout, vertexPositions: Map<V, Point2d>) {
  const adjEdges = new Map<V, Set<string>>(); //vertex to edge ids of drawn edges
  g.getVertices().forEach((v) => adjEdges.set(v, new Set()));

  const drawer = new Drawer();
  edgeToX.forEach((x, edge) => {
    const edgeIds = drawer.drawEdge(layout, vertexPositions.get(edge.source)!, vertexPositions.get(edge.target)!, x);
    edgeIds.forEach((id) => adjEdges.get(edge.source)!.add(id));
    edgeIds.forEach((id) => adjEdges.get(edge.target)!.add(id));
  });
  return adjEdges;
}

class Drawer {
  drawnEdgesToID: Map<string, string> = new Map();

  drawEdge(
    layout: GraphLayout, //
    source: Point2d,
    target: Point2d,
    xVertical: number
  ): Set<string> {
    const [xSource, ySource] = [source.x, source.y];
    const [xTarget, yTarget] = [target.x, target.y];
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
