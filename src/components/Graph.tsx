import * as d3 from "d3";
import { EdgeDrawing, GraphDrawing, VertexDrawing } from "@/model/drawing/GraphDrawing";
import React, { useEffect, useRef, useState } from "react";

interface GraphProps {
  graphDrawing: GraphDrawing;
  title: string;
}

const Graph: React.FC<GraphProps> = ({ graphDrawing, title }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedVertices, setSelectedVertices] = useState(new Set<String>());

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    let [width, height] = graphDrawing.getSize();

    width += 100;
    height += 100;

    svg.attr("width", width).attr("height", height);
    //g contains actual drawing, shifted by 50, 50
    const g = svg.append("g").attr("transform", `translate(50, 50)`);

    g.selectAll<SVGCircleElement, VertexDrawing>("circle")
      .data(graphDrawing.getVertices())
      .join("circle")
      .attr("r", 10)
      .attr("cx", (v) => v.x)
      .attr("cy", (v) => v.y)
      .style("fill", (d: any) => (selectedVertices.has(d.id) ? "blue" : "red"));
    g.selectAll<SVGCircleElement, VertexDrawing>("circle").on("click", (event, value) => {
      selectedVertices.add(value.id);
      setSelectedVertices(new Set(selectedVertices));
    });

    g.selectAll(".circle-label")
      .data(graphDrawing.getVertices().filter((d: any) => d.label.length < 10))
      .enter()
      .append("text")
      .attr("class", "vertex-label")
      .attr("x", (d: any) => d.x)
      .attr("y", (d: any) => d.y)
      .attr("dy", -15)
      .attr("text-anchor", "middle")
      .text((d: any) => d.label);

    const lineGenerator = d3.line<[number, number]>().curve(d3.curveBasis);

    g.selectAll<SVGPathElement, EdgeDrawing>("path")
      .data(graphDrawing.getEdgeDrawings())
      .join("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#999")
      .attr("stroke-width", 1)
      .attr("d", (d: EdgeDrawing) => {
        return lineGenerator(d.points);
      });
  }, [selectedVertices, graphDrawing]);

  return (
    <div style={{ display: "inline-block" }}>
      <p>{title}</p>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default Graph;
