import { EdgeLayout, GraphLayout, VertexLayout } from "@/model/layout/GraphLayout";
import * as d3 from "d3";
import { path as d3path } from "d3-path";
import { VertexId } from "@/model/types";

export interface RenderCfg {
  vertexColor: string;
  highlightColor: string;
  edgeColor: string;
  showCliqueCenter: boolean;
}

export class GraphSVGRenderer {
  render(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>, //
    graphLayout: GraphLayout,
    renderCfg: RenderCfg,
    highlightVertex: (vertexId: VertexId) => boolean,
    highlightEdge: (edgeId: string) => boolean,
    isSelectedVertex: (vertexId: VertexId) => boolean,
    markVertex: (vertexId: VertexId) => boolean
  ) {
    const lineGenerator = d3.line<[number, number]>().curve(d3.curveBasis);

    //draw first non-highlighed edges, then highlighted
    const edges = graphLayout.getEdgeDrawings().sort((a, b) => {
      if (highlightEdge(a.id) === highlightEdge(b.id)) return 0;
      return highlightEdge(a.id) ? 1 : -1;
    });

    // graphLayout.getEdgeDrawings2().forEach((edges) => {
    //   const p = d3path();
    //   edges.forEach((edge) => {
    //     if (edge.points.length === 2) {
    //       p.moveTo(edge.points[0].x, edge.points[0].y);

    //       edge.points.slice(1).forEach((point) => {
    //         p.lineTo(point.x, point.y);
    //       });
    //     } else if (edge.points.length > 2) {
    //       p.moveTo(edge.points[0].x, edge.points[0].y);
    //       p.quadraticCurveTo(edge.points[1].x, edge.points[1].y, edge.points[2].x, edge.points[2].y);
    //     }
    //   });
    //   svg
    //     .append("path")
    //     .attr("d", p.toString())
    //     .attr("fill", "none")
    //     .attr("stroke", "#9a9a9a")
    //     .attr("stroke-width", 1)
    //     .attr("stroke-linecap", "round")
    //     .attr("stroke-linejoin", "round")
    //     .attr("transform", "translate(0.5,0.5)")
    //     .attr("stroke-opacity", 1)
    //     .attr("stroke-miterlimit", 1);
    // });

    svg
      .selectAll<SVGPathElement, EdgeLayout>("path")
      .data(edges)
      .join("path")
      // .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", (d: EdgeLayout) => (highlightEdge(d.id) ? renderCfg.highlightColor : renderCfg.edgeColor))
      .attr("stroke-width", (d: EdgeLayout) => (highlightEdge(d.id) ? 5 : 1))
      // .attr("stroke-linecap", "butt")
      // .attr("shape-rendering", "crispEdges")
      .attr("d", (d: EdgeLayout) => {
        return lineGenerator(d.points.map((p) => [p.x, p.y]));
      })
      .attr("transform", "translate(0.5,0.5)")
      .attr("stroke-opacity", 1)
      .attr("stroke-miterlimit", 1);

    const defs = svg.append("defs");

    const shadow = defs.append("filter").attr("id", "drop-shadow").attr("height", "150%");
    shadow
      .append("feDropShadow")
      .attr("dx", 3) // Shadow x-offset
      .attr("dy", 3) // Shadow y-offset
      .attr("stdDeviation", 3) // Blur amount
      .attr("flood-color", "rgba(0,0,0,0.5)");

    const vertexGroups = svg
      .selectAll<SVGGElement, VertexLayout>(".vertex-group")
      .data(graphLayout.getVertices().filter((v) => v.draw))
      .join("g")
      .attr("class", "vertex-group")
      .attr("transform", (v) => `translate(${v.position.x}, ${v.position.y})`)
      .on("mouseenter", function (_, v) {
        d3.select(this)
          .select("rect")
          .attr("filter", "url(#drop-shadow)")
          .transition()
          .duration(200)
          .style("fill", d3.color(renderCfg.highlightColor)?.brighter(1).toString() || "lightgray");
      })
      .on("mouseleave", function (_, v) {
        d3.select(this)
          .select("rect")
          .attr("filter", null)
          .transition()
          .duration(200)
          .style("fill", highlightVertex(v.id) ? renderCfg.highlightColor : renderCfg.vertexColor)
          .attr("stroke-width", isSelectedVertex(v.id) || markVertex(v.id) ? 3 : 1);
      })
      .on("mouseover", function (_, d) {
        d3.select(this).append("title").text(d.label);
      })
      .on("mouseout", function () {
        d3.select(this).select("title").remove();
      });

    vertexGroups
      .append("rect")
      .attr("width", (v) => v.width)
      .attr("height", (v) => v.height)
      .attr("x", (v) => -v.width / 2)
      .attr("y", (v) => -v.height / 2)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("stroke", "black")
      .attr("stroke-width", (v) => (isSelectedVertex(v.id) || markVertex(v.id) ? 3 : 1))
      .style("fill", (v) => (highlightVertex(v.id) ? renderCfg.highlightColor : renderCfg.vertexColor));

    vertexGroups
      .append("text")
      .attr("class", "vertex-label")
      .attr("x", 0)
      .attr("y", 5)
      .attr("text-anchor", "middle")
      .text((d) => d.displayLabel);

    if (renderCfg.showCliqueCenter) {
      svg
        .selectAll<SVGRectElement, VertexLayout>("centers")
        .data(graphLayout.getVertices().filter((v) => !v.draw))
        .join("rect")
        .attr("width", (v) => 10)
        .attr("height", (v) => 10)
        .attr("x", (v) => v.position.x - 5)
        .attr("y", (v) => v.position.y - 5);
    }
  }
}
