import { Edge, LayerGraph, Vertex } from "@/model/ds";
import { EdgePlan } from "../plan/EdgePlan";
import { GraphLayout } from "../../GraphLayout";
import _ from "lodash";
import { LayerSpacer } from "../../spacing/LayerSpacer";
import { v4 as uuidv4 } from "uuid";

// radius of the quater circles in the confluent drawing
const RADIUS = 25;

export function draw(
  g: LayerGraph, //
  layout: GraphLayout,
  yPosition: (v: Vertex) => number,
  isCliqueCenter: (v: Vertex) => boolean,
  plan: EdgePlan[],
  layerSpacer: LayerSpacer
): Map<Vertex, Set<string>> {
  const numVertLayers = countVertLayers(plan);
  layerSpacer.setGraph(g);
  layerSpacer.setNumVertLayer(numVertLayers);

  let edgeToX = new Map<Edge<Vertex>, number>();

  for (let edgePlan of plan) {
    edgeToX.set(edgePlan.edge, layerSpacer.xPositionVertical(edgePlan.layer, edgePlan.relativeVertLayer));
  }
  return drawEdges(g, edgeToX, layout, layerSpacer, yPosition, isCliqueCenter);
}

function countVertLayers(plan: EdgePlan[]): number[] {
  const byLayer = _.groupBy(plan, (spec) => spec.layer);
  const maxVal = _.mapValues(byLayer, (group) => _.maxBy(group, "relativeVertLayer")!.relativeVertLayer);
  const result = Array.from({ length: Object.keys(maxVal).length }, (_, i) => maxVal[i] + 1);
  return result;
}

function drawEdges(
  g: LayerGraph, //
  edgeToX: Map<Edge<Vertex>, number>,
  layout: GraphLayout,
  xPositions: LayerSpacer,
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
