import { EdgeLayout, GraphLayout, VertexLayout } from "@/model/layout/GraphLayout";
import * as d3 from "d3";
import { V } from "vitest/dist/chunks/environment.d8YfPkTm.js";

export interface RenderCfg {
  vertexColor: string;
  highlightColor: string;
  edgeColor: string;
}

export class GraphSVGRenderer {
  render(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>, //
    graphLayout: GraphLayout,
    renderCfg: RenderCfg,
    highlightVertex: (vertexId: string) => boolean,
    highlightEdge: (edgeId: string) => boolean,
    isSelectedVertex: (vertexId: string) => boolean,
    markVertex: (vertexId: string) => boolean
  ) {
    const lineGenerator = d3.line<[number, number]>().curve(d3.curveBasis);

    //draw first non-highlighed edges, then highlighted
    const edges = graphLayout.getEdgeDrawings().sort((a, b) => {
      if (highlightEdge(a.id) === highlightEdge(b.id)) return 0;
      return highlightEdge(a.id) ? 1 : -1;
    });

    svg
      .selectAll<SVGPathElement, EdgeLayout>("path")
      .data(edges)
      .join("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", (d: EdgeLayout) => (highlightEdge(d.id) ? renderCfg.highlightColor : renderCfg.edgeColor))
      .attr("stroke-width", (d: EdgeLayout) => (highlightEdge(d.id) ? 5 : 1))
      .attr("d", (d: EdgeLayout) => {
        return lineGenerator(d.points.map((p) => [p.x, p.y]));
      });

    svg
      .selectAll<SVGRectElement, VertexLayout>("rect")
      .data(graphLayout.getVertices().filter((v) => v.draw))
      .join("rect")
      .attr("width", 150)
      .attr("height", 40)
      .attr("x", (v) => v.position.x - 75)
      .attr("y", (v) => v.position.y - 20)
      .attr("rx", 5) // Smooth corners
      .attr("ry", 5) // Smooth corners
      .attr("stroke", "black")
      .attr("stroke-width", (d) => (isSelectedVertex(d.id) || markVertex(d.id) ? 3 : 1))
      .style("fill", (d: VertexLayout) => (highlightVertex(d.id) ? renderCfg.highlightColor : renderCfg.vertexColor))
      .on("mouseover", function (event, d) {
        d3.select(this).append("title").text(d.label);
      })
      .on("mouseout", function () {
        d3.select(this).select("title").remove();
      });

    svg
      .selectAll<SVGTextElement, VertexLayout>(".vertex-label")
      .data(graphLayout.getVertices())
      .data(graphLayout.getVertices().filter((v) => v.draw))
      .enter()
      .append("text")
      .attr("class", "vertex-label")
      .attr("x", (d) => d.position.x)
      .attr("y", (d) => d.position.y + 5)
      .attr("text-anchor", "middle")
      .text((d) => d.label.substring(0, 15))
      .on("mouseover", function (event, d) {
        d3.select(this).append("title").text(d.label);
      })
      .on("mouseout", function () {
        d3.select(this).select("title").remove();
      });
  }
}
