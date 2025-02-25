import { solve } from "yalps";
import { Graph, Edge } from "../../../src/model/ds/Graph";

export function solveLp(g: Graph<any, any>) {
  const variables = new Map<any, Map<any, number>>();

  g.getVertices().forEach((v) => {
    const m = new Map();
    m.set("deg", g.inDegree(v) - g.outDegree(v));
    g.getIncident(v).forEach((e) => {
      if (e.source === v) {
        m.set(e, -1);
      } else {
        m.set(e, 1);
      }
    });
    variables.set(v, m);
  });

  const constraints = new Map<any, any>();
  g.getEdges().forEach((e) => {
    constraints.set(e, { min: 1 });
  });

  const model = {
    direction: "minimize" as const,
    objective: "deg",
    constraints: constraints,
    variables: variables,
  };

  const solution = solve(model);

  const result = new Map<any, number>();
  solution.variables.forEach((v) => {
    result.set(v[0], v[1]);
  });
  return result;
}
