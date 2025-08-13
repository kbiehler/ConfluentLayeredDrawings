import { EdgeLayout } from "@/model/layout/GraphLayout";
import { Point2d } from "@/model/types/Point";

export function mergeEdgeDrawings(edgeDrawings: EdgeLayout[]): EdgeLayout[] {
  const merged: EdgeLayout[] = [];

  const horizontal = edgeDrawings
    .filter((edge) => edge.points.length == 2 && edge.points[0].y === edge.points[1].y)
    .map((edge) => (edge.points[0].x < edge.points[1].x ? [edge.points[0], edge.points[1]] : [edge.points[1], edge.points[0]]))
    .reduce((map, points) => {
      if (!map.has(points[0].y)) {
        map.set(points[0].y, []);
      }
      map.get(points[0].y)!.push(points);
      return map;
    }, new Map<number, Point2d[][]>());

  horizontal.forEach((edges, y) => {
    edges.sort((a, b) => a[0].x - b[0].x);
    let currentStart = edges[0][0].x;
    let currentEnd = edges[0][1].x;

    for (const edge of edges) {
      if (edge[0].x <= currentEnd) {
        currentEnd = Math.max(currentEnd, edge[1].x);
      } else {
        merged.push({
          id: `unused`,
          points: [
            { x: currentStart, y: y },
            { x: currentEnd, y: y },
          ],
        });
        currentStart = edge[0].x;
        currentEnd = edge[1].x;
      }
    }
    merged.push({
      id: `unused`,
      points: [
        { x: currentStart, y: y },
        { x: currentEnd, y: y },
      ],
    });
  });

  const vertical = edgeDrawings
    .filter((edge) => edge.points.length == 2 && edge.points[0].x === edge.points[1].x)
    .map((edge) => (edge.points[0].y < edge.points[1].y ? [edge.points[0], edge.points[1]] : [edge.points[1], edge.points[0]]))
    .reduce((map, points) => {
      if (!map.has(points[0].x)) {
        map.set(points[0].x, []);
      }
      map.get(points[0].x)!.push(points);
      return map;
    }, new Map<number, Point2d[][]>());

  vertical.forEach((edges, x) => {
    edges.sort((a, b) => a[0].y - b[0].y);
    let currentStart = edges[0][0].y;
    let currentEnd = edges[0][1].y;

    for (const edge of edges) {
      if (edge[0].y <= currentEnd) {
        currentEnd = Math.max(currentEnd, edge[1].y);
      } else {
        merged.push({
          id: `unused`,
          points: [
            { x: x, y: currentStart },
            { x: x, y: currentEnd },
          ],
        });
        currentStart = edge[0].y;
        currentEnd = edge[1].y;
      }
    }
    merged.push({
      id: `unused`,
      points: [
        { x: x, y: currentStart },
        { x: x, y: currentEnd },
      ],
    });
  });

  edgeDrawings
    .filter((edge) => edge.points.length == 3)
    .forEach((edge) =>
      merged.push({
        id: `unused`,
        points: [
          { x: edge.points[0].x, y: edge.points[0].y },
          { x: edge.points[1].x, y: edge.points[1].y },
          { x: edge.points[2].x, y: edge.points[2].y },
        ],
      })
    );

  return merged;
}
