import React from "react";
import GraphSvg from "@/components/GraphSvg";
import { useEffect, useState } from "react";
import { ConfigDto, GraphCfgDto, mapToRenderCfg } from "@/cfg/ConfigDtos";
import { GraphLayout } from "@/model/layout/GraphLayout";
import { InteractionManager, MarkVertexInteractionManager } from "@/model/renderer/InteractionManager";
import { Graph } from "@/model/ds";
import { draw, redrawImpl, redrawNbr } from "@/model/DrawModel";
import { RedrawState } from "@/model/redraw/RedrawState";
import { Empty_Layout_Metric } from "@/model/metrics/LayoutMetrics";

interface GraphsPanelProps {
  config: ConfigDto;
  graphCfg: GraphCfgDto;
  scale: number;
  panelSelect: "main" | "nbr" | "impl";
  setPanelSelect: React.Dispatch<React.SetStateAction<"main" | "nbr" | "impl">>;
}

const GraphsPanel: React.FC<GraphsPanelProps> = ({ config, graphCfg, scale, panelSelect, setPanelSelect }) => {
  if (graphCfg.type === "empty") {
    return null;
  }

  const [layout, setLayout] = useState(() => new GraphLayout());
  const [redrawState, setRedrawState] = useState(() => new RedrawState(new Graph()));
  const [interactMgr, setInteractMgr] = useState(() => new InteractionManager());
  const [renderCfg, setRenderCfg] = useState(() => mapToRenderCfg(config));
  const [metric, setMetric] = useState(Empty_Layout_Metric);
  const [avgMetric, setAvgMetric] = useState(Empty_Layout_Metric);

  useEffect(() => {
    const [redrawState, tmpLayout, tmpInteractInfo, tmpMetric, tmpAvgMetric] = draw(config, graphCfg);
    setRedrawState(redrawState);
    setLayout(tmpLayout);
    setInteractMgr(new InteractionManager(tmpInteractInfo));
    setRenderCfg(mapToRenderCfg(config));
    setMetric(tmpMetric);
    setAvgMetric(tmpAvgMetric);
  }, [config, graphCfg]);

  const [nbrLayout, setNbrLayout] = useState(() => new GraphLayout());
  const [nbrMetric, setNbrMetric] = useState(Empty_Layout_Metric);
  const [nbrInteractMgr, setNbrInteractMgr] = useState(() => new InteractionManager());

  const [implLayout, setImplLayout] = useState(() => new GraphLayout());
  const [implInteractMgr, setImplInteractMgr] = useState(() => new InteractionManager());
  const [implMetric, setImplMetric] = useState(Empty_Layout_Metric);

  useEffect(() => {
    if (panelSelect === "main") {
      return;
    } else if (panelSelect === "nbr") {
      const [, tmpLayout, _, tmpMetrics] = redrawNbr(redrawState, interactMgr.state.selectedVertices, config);
      setNbrInteractMgr(new MarkVertexInteractionManager(interactMgr.state.selectedVertices));
      setNbrLayout(tmpLayout);
      setNbrMetric(tmpMetrics);
    } else if (panelSelect === "impl") {
      const [, tmpLayout, _, tmpMetrics] = redrawImpl(redrawState, interactMgr.state.selectedVertices, config);
      setImplInteractMgr(new MarkVertexInteractionManager(interactMgr.state.selectedVertices));
      setImplLayout(tmpLayout);
      setImplMetric(tmpMetrics);
    }
  }, [panelSelect]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        setPanelSelect((prevPanel) => {
          if (prevPanel === "main") return "nbr";
          if (prevPanel === "nbr") return "impl";
          return "main";
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div>
      <div style={{ flexGrow: 1 }}>
        {panelSelect === "main" ? (
          <GraphSvg graphLayout={layout} renderCfg={renderCfg} interactionManager={interactMgr} scale={scale} />
        ) : panelSelect === "nbr" ? (
          <GraphSvg graphLayout={nbrLayout} renderCfg={renderCfg} interactionManager={nbrInteractMgr} scale={scale} />
        ) : (
          <GraphSvg graphLayout={implLayout} renderCfg={renderCfg} interactionManager={implInteractMgr} scale={scale} />
        )}
      </div>
    </div>
  );
};

export default GraphsPanel;
