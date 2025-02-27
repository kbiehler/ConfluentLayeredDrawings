import { Solution, solve } from "yalps";
import { Graph } from "@/model/ds/Graph";

/**
 * LP for leveling - minmize total edge length
 *
 * min sum_{uv in E} (y(v) + y(u))
 * s.t.
 * y(v) - y(u) >= 1 for all (u, v) in E
 * y(v) >= 0
 *
 * @param g
 * @returns ILP solution: Map<vertex -> y(u)>
 */
export function solveLp<V>(g: Graph<V, any>): Map<V, number> {
  const model = buildLpModel(g);

  const solution = solve(model);

  const result = mapSolutionToResult<V>(solution);
  //solution doesnt contain 0 variables, add
  addMissingVertices<V>(g, result);
  return result;
}

function buildLpModel<V>(g: Graph<V, any>) {
  /*
  LP in standard form
  example for graph with edges {ab, bc, cd, ed}

  direction: min;

  objective: netDeg; 
  Each vertex contributes to the objective as inDeg(v) - outDeg(v) * y(v). This is considered in netDeg = inDeg - outDeg.


  For each edge:
  constraints = {
    ab: { min: 1 },
    bc: { min: 1 },
    cd: { min: 1 },
    ed: { min: 1 },
  }

  For each node: netDeg = inDeg - outDeg; -1 for constrait outgoing edge; 1 for constraint incoming edge
  variables = {
    a: { deg: -1, ab: -1 },
    b: { deg: 0, ab: 1, bc: -1 },
    c: { deg: 0, bc: 1, cd: -1 },
    d: { deg: 0, cd: 1, ed: -1 },
    e: { deg: 1, ed: 1 },
  }


  */
  const constraints = new Map<any, any>();
  g.getEdges().forEach((e) => {
    constraints.set(e, { min: 1 });
  });

  const variables = new Map<V, Map<any, number>>();
  g.getVertices().forEach((v) => {
    const m = new Map();
    m.set("netDeg", g.inDegree(v) - g.outDegree(v));
    g.getIncident(v).forEach((e) => {
      if (e.source === v) {
        m.set(e, -1);
      } else {
        m.set(e, 1);
      }
    });
    variables.set(v, m);
  });

  const model = {
    direction: "minimize" as const,
    objective: "netDeg",
    constraints: constraints,
    variables: variables,
  };
  return model;
}

function mapSolutionToResult<V>(solution: Solution<V>) {
  const result = new Map<V, number>();
  solution.variables.forEach((v) => {
    result.set(v[0], v[1]);
  });
  return result;
}

function addMissingVertices<V>(g: Graph<V, any>, result: Map<V, number>) {
  g.getVertices().forEach((v) => {
    if (!result.has(v)) {
      result.set(v, 0);
    }
  });
}
