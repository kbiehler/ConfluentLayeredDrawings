import { Vertex, LayerGraph, Edge } from "@/model/ds";

export function fixCenterPositions(
  yPos: Map<Vertex, number>, //
  g: LayerGraph,
  vertBundeling: Map<Edge, number>,
  minSpacing: number
) {
  g.getVertices().forEach((center) => {
    if (center.isCliqueCenter()) {
      //check if left side is end
      if (g.getAdjacentOut(center).some((v) => v.getLabel() == "Control Algorithm")) {
        console.log("No sensor_4 measurement");
      }
      // g.getAdjacentOut(center).map((v) => g.outDegree(v) > 0);
      const hasRightAncenstor = g.getAdjacentOut(center).some((v) => g.outDegree(v) > 0);
      if (!hasRightAncenstor) {
        const leftV = g.getAdjacentIn(center);
        const rightV = g.getAdjacentOut(center);
        if (leftV.length < rightV.length) {
          return;
        }
        //check if all on right side have ONLY center as predecessor
        rightV.map((v) => g.getAdjacentIn(v).length);
        const rightSideFitting = rightV.every((v) => g.getAdjacentIn(v).length == 1);
        if (!rightSideFitting) {
          return;
        }

        const minY = Math.min(...leftV.map((v) => yPos.get(v)!));
        const maxY = Math.max(...leftV.map((v) => yPos.get(v)!));

        //check if vertex lies between minY and maxY
        const allInLayer = g.getVerticesInLayer(g.getLayer(center));
        const allPositions = allInLayer.filter((v) => v != center).map((v) => yPos.get(v)!);
        const isBetween = allPositions.some((pos) => pos >= minY && pos <= maxY);
        if (isBetween) {
          return;
        }

        //check if any other vertex on the right not adjacent to CENTER is between minY and maxY
        const otherVerticesRight = g
          .getVerticesInLayer(g.getLayer(center) + 1)
          .filter((v) => !rightV.includes(v))
          .map((v) => yPos.get(v)!);
        const rightIsBetween = otherVerticesRight.some((pos) => pos >= minY && pos <= maxY);
        if (rightIsBetween) {
          return;
        }

        // can now set positions
        let optPos = (minY + maxY) / 2;
        optPos = Math.round(optPos / 50) * 50;
        yPos.set(center, optPos);

        let startPosition = 0;
        if (rightV.length % 2 == 0) {
          startPosition = optPos - minSpacing / 2 - (minSpacing * (rightV.length - 2)) / 2;
        } else {
          startPosition = optPos - (minSpacing * (rightV.length - 1)) / 2;
        }
        rightV.forEach((v) => {
          yPos.set(v, startPosition);
          startPosition += minSpacing;
        });
      }
    }
  });
}
