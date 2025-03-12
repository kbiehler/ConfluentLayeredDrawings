import { Vertex } from "@/model/ds";
import { EdgePlan } from "../edges/plan/EdgePlan";
import _ from "lodash";

export function crossingsOfPlan(plan: EdgePlan[], position: (v: Vertex) => number) {
  const groupedPlans = _.groupBy(plan, (edge) => edge.layer);
  let totalCrossings = 0;

  for (const layer of Object.values(groupedPlans)) {
    totalCrossings += crossingsSameLayer(layer, position);
  }

  return totalCrossings;
}

export function crossingsSameLayer(plan: EdgePlan[], position: (v: Vertex) => number): number {
  const edges: E[] = plan.map((edgePlan) => ({
    startY: position(edgePlan.edge.source),
    endY: position(edgePlan.edge.target),
    vertLayer: edgePlan.relativeVertLayer,
  }));

  return calcCrossings(edges);
}

type E = {
  startY: number;
  endY: number;
  vertLayer: number;
};

function calcCrossings(edges: E[]): number {
  const crossings = new Set<String>();
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    const isStraight = e.startY == e.endY;

    for (let j = 0; j < edges.length; j++) {
      if (i === j) continue;
      const ee = edges[j];

      if (ee.startY < e.startY && e.startY < ee.endY && (ee.vertLayer < e.vertLayer || isStraight)) {
        crossings.add(JSON.stringify({ x: ee.vertLayer, y: e.startY }));
      }
      if (ee.endY < e.startY && e.startY < ee.startY && (ee.vertLayer < e.vertLayer || isStraight)) {
        crossings.add(JSON.stringify({ x: ee.vertLayer, y: e.startY }));
      }
      if (ee.startY < e.endY && e.endY < ee.endY && (e.vertLayer < ee.vertLayer || isStraight)) {
        crossings.add(JSON.stringify({ x: ee.vertLayer, y: e.endY }));
      }

      if (ee.endY < e.endY && e.endY < ee.startY && (e.vertLayer < ee.vertLayer || isStraight)) {
        crossings.add(JSON.stringify({ x: ee.vertLayer, y: e.endY }));
      }
    }
  }
  return crossings.size;
}
