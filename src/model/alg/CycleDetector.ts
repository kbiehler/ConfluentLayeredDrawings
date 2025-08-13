import { Graph, Vertex } from "@/model/ds";

export function hasCycleDirected(g: Graph<Vertex>): boolean {
  const visited = new Set<Vertex>();
  const inPath = new Set<Vertex>(); // nodes on current DFS path
  const parent = new Map<Vertex, Vertex | null>();

  const dfs = (u: Vertex, p: Vertex | null): boolean => {
    visited.add(u);
    inPath.add(u);
    parent.set(u, p);

    for (const v of g.getAdjacentOut(u) ?? []) {
      if (v === p) continue;

      if (!visited.has(v)) {
        if (dfs(v, u)) return true;
      } else if (inPath.has(v)) {
        // Found a back edge to an ancestor v → reconstruct cycle v ... u → v
        const path: Vertex[] = [v];
        let x: Vertex | null = u;
        while (x && x !== v) {
          path.push(x);
          x = parent.get(x) ?? null;
        }
        console.log("Cycle detected:", path.map((n) => n.label).join(" -> "));
        return true;
      }
    }

    inPath.delete(u);
    return false;
  };

  // handle disconnected graphs
  for (const u of g.getVertices()) {
    if (!visited.has(u)) {
      if (dfs(u, null)) return true;
    }
  }
  return false;
}
