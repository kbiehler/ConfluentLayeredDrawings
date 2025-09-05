import InputError from "@/input/InputError";
import { Graph, Vertex } from "@/model/ds";

export function hasCycleDirected(g: Graph<Vertex>): InputError | null {
  const visited = new Set<Vertex>();
  const inPath = new Set<Vertex>(); // nodes on current DFS path
  const parent = new Map<Vertex, Vertex | null>();

  const dfs = (u: Vertex, p: Vertex | null): InputError | null => {
    visited.add(u);
    inPath.add(u);
    parent.set(u, p);

    for (const v of g.getAdjacentOut(u) ?? []) {
      if (v === p) continue;

      if (!visited.has(v)) {
        const rec = dfs(v, u);
        if (rec) return rec;
      } else if (inPath.has(v)) {
        // Found a back edge to an ancestor v → reconstruct cycle v ... u → v
        const path: Vertex[] = [v];
        let x: Vertex | null = u;
        while (x && x !== v) {
          path.push(x);
          x = parent.get(x) ?? null;
        }
        path.push(v);
        console.log("Cycle detected:", path.map((n) => n.label).join(" -> "));
        return new InputError([
          "The input graph contains a directed cycle. Please provide a directed acyclic graph (DAG).",
          path.map((n) => n.label).join(" -> "),
        ]);
      }
    }

    inPath.delete(u);
    return null;
  };

  // handle disconnected graphs
  for (const u of g.getVertices()) {
    if (!visited.has(u)) {
      const checkCycleError = dfs(u, null);
      if (checkCycleError) return checkCycleError;
    }
  }
  return null;
}
