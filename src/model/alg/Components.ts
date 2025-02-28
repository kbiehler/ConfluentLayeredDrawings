import { Graph } from "@/model/ds";

/**
 * Finds all connected components in a graph
 * 
 * @param g
 * @returns
 */
export function findComponents<V>(g: Graph<V>): Set<V>[] {
  const visited = new Set<V>();
  let components: Set<V>[] = [];
  let component: Set<V> = new Set();

  function dfs(node: V) {
    if (visited.has(node)) {
      return;
    }
    visited.add(node);
    component.add(node);
    for (const neighbor of g.getAdjacent(node)) {
      dfs(neighbor);
    }
  }

  g.getVertices().forEach((v) => {
    if (!visited.has(v)) {
      component = new Set();
      dfs(v);
      components.push(component);
    }
  });

  return components;
}
