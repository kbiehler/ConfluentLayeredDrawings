import { Edge, LayerGraph, Vertex } from "@/model/ds";
import { EdgePlan } from "../plan/EdgePlan";
import { GraphLayout } from "../../GraphLayout";
import _ from "lodash";
import { LayerSpacer } from "../../spacing/LayerSpacer";
import { v4 as uuidv4 } from "uuid";

// radius of the quater circles in the confluent drawing
const RADIUS = 25;
//grid for line-drawing. lines that are identical between to grid-points are drawn once
const SEGMENT_LENGTH = 30;

export function drawEdges(
  g: LayerGraph, //
  layout: GraphLayout,
  yPosition: (v: Vertex) => number,
  plan: EdgePlan[],
  layerSpacer: LayerSpacer
): { adjEdges: Map<Vertex, Set<string>>; ink: number; bends: number } {
  let edgeToX = new Map<Edge<Vertex>, number>();
  for (let edgePlan of plan) {
    edgeToX.set(edgePlan.edge, layerSpacer.xPositionVertical(edgePlan.layer, edgePlan.relativeVertLayer));
  }
  return draw(g, edgeToX, layout, layerSpacer, yPosition);
}

function draw(
  g: LayerGraph, //
  edgeToX: Map<Edge<Vertex>, number>,
  layout: GraphLayout,
  xPositions: LayerSpacer,
  yPosition: (v: Vertex) => number
): { adjEdges: Map<Vertex, Set<string>>; ink: number; bends: number } {
  const adjEdges = new Map<Vertex, Set<string>>(); //vertex to edge ids of drawn edges
  g.getVertices().forEach((v) => adjEdges.set(v, new Set()));

  const drawer = new Drawer();
  edgeToX.forEach((x, edge) => {
    const edgeIds = drawer.drawEdge(
      layout,
      xPositions.xPosition(edge.source),
      yPosition(edge.source),
      xPositions.xPosition(edge.target),
      yPosition(edge.target),
      x
    );

    //source vertices, ignores clique centers and dummy vertices
    const sourceVertices = getPreviousDrawnVertices(g, edge.source);
    sourceVertices.forEach((v) => edgeIds.forEach((id) => adjEdges.get(v)!.add(id)));
    const targetVertices = getnextDrawnVertices(g, edge.target);
    targetVertices.forEach((v) => edgeIds.forEach((id) => adjEdges.get(v)!.add(id)));
  });
  console.log("bends", drawer.bends);
  console.log("ink", drawer.ink);
  return { adjEdges: adjEdges, ink: drawer.ink, bends: drawer.bends };
}

class Drawer {
  drawnEdgesToID: Map<string, string> = new Map();
  bends = 0;
  ink = 0;

  drawEdge(
    layout: GraphLayout, //
    xSource: number,
    ySource: number,
    xTarget: number,
    yTarget: number,
    xVertical: number
  ): Set<string> {
    if (ySource == yTarget) {
      return this.addHorizontalSegment(layout, ySource, xSource, xTarget);
    }
    const ids = new Set<string>();

    const down = ySource < yTarget ? 1 : ySource === yTarget ? 0 : -1;

    this.addHorizontalSegment(layout, ySource, xSource, xVertical - RADIUS).forEach((s) => ids.add(s));

    const bend1 = [
      [xVertical - RADIUS, ySource],
      [xVertical, ySource],
      [xVertical, ySource + RADIUS * down],
    ];

    this.addVerticalSegment(layout, xVertical, ySource + RADIUS * down, yTarget - RADIUS * down).forEach((s) => ids.add(s));

    const bend2 = [
      [xVertical, yTarget - RADIUS * down],
      [xVertical, yTarget],
      [xVertical + RADIUS, yTarget],
    ];

    this.addHorizontalSegment(layout, yTarget, xVertical + RADIUS, xTarget).forEach((s) => ids.add(s));

    ids.add(this.addSegment(layout, bend1));
    ids.add(this.addSegment(layout, bend2));

    return ids;
  }

  addHorizontalSegment(layout: GraphLayout, y: number, startX: number, endX: number) {
    const ids = new Set<string>();

    const start = Math.min(startX, endX);
    const end = Math.max(startX, endX);

    if (end - start <= SEGMENT_LENGTH) {
      let segment = [
        [start, y],
        [end, y],
      ];
      ids.add(this.addSegment(layout, segment));
      return ids;
    }

    const gridStart = start + (SEGMENT_LENGTH - (start % SEGMENT_LENGTH));
    const gridEnd = end - (end % SEGMENT_LENGTH);
    if (start < gridStart) {
      let segment = [
        [start, y],
        [gridStart, y],
      ];
      ids.add(this.addSegment(layout, segment));
    }
    if (gridEnd < end) {
      let segment = [
        [gridEnd, y],
        [end, y],
      ];
      ids.add(this.addSegment(layout, segment));
    }

    let currentY = gridStart;

    while (currentY < gridEnd) {
      const nextY = currentY + SEGMENT_LENGTH;
      let segment = [
        [currentY, y],
        [nextY, y],
      ];
      ids.add(this.addSegment(layout, segment));
      currentY = nextY;
    }
    return ids;
  }

  addVerticalSegment(layout: GraphLayout, x: number, startY: number, endY: number) {
    const ids = new Set<string>();

    const start = Math.min(startY, endY);
    const end = Math.max(startY, endY);

    if (end - start <= SEGMENT_LENGTH) {
      let segment = [
        [x, start],
        [x, end],
      ];
      ids.add(this.addSegment(layout, segment));
      return ids;
    }

    const gridStart = start + (SEGMENT_LENGTH - (start % SEGMENT_LENGTH));
    const gridEnd = end - (end % SEGMENT_LENGTH);
    if (start < gridStart) {
      let segment = [
        [x, start],
        [x, gridStart],
      ];
      ids.add(this.addSegment(layout, segment));
    }
    if (gridEnd < end) {
      let segment = [
        [x, gridEnd],
        [x, end],
      ];
      ids.add(this.addSegment(layout, segment));
    }

    let currentY = gridStart;

    while (currentY < gridEnd) {
      const nextY = currentY + SEGMENT_LENGTH;
      let segment = [
        [x, currentY],
        [x, nextY],
      ];
      ids.add(this.addSegment(layout, segment));
      currentY = nextY;
    }
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
    if (points.length == 3) {
      this.bends += 1;
      this.ink += 1.5 * RADIUS; //about (1/2) * pi * radius
    } else if (points.length == 2) {
      this.ink += Math.abs(points[0][0] - points[1][0]) + Math.abs(points[0][1] - points[1][1]);
    }
    const id = uuidv4();
    layout.addEdgeDrawing({ id: id, points: points.map((p) => ({ x: p[0], y: p[1] })) });
    this.drawnEdgesToID.set(pointsKey, id);
    return id;
  }
}
function getPreviousDrawnVertices(g: LayerGraph<Vertex, Edge<Vertex>>, v: Vertex): Vertex[] {
  if (v.isCliqueCenter() || v.isDummyVertex()) {
    return g.getAdjacentIn(v).flatMap((v) => getPreviousDrawnVertices(g, v));
  } else {
    return [v];
  }
}

function getnextDrawnVertices(g: LayerGraph<Vertex, Edge<Vertex>>, v: Vertex): Vertex[] {
  if (v.isCliqueCenter() || v.isDummyVertex()) {
    return g.getAdjacentOut(v).flatMap((v) => getnextDrawnVertices(g, v));
  } else {
    return [v];
  }
}
