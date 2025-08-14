import React from "react";
import GraphSvg from "@/components/GraphSvg";
import { useEffect, useState } from "react";
import { ConfigDto, mapToRenderCfg } from "@/cfg/ConfigDtos";
import { GraphLayout } from "@/model/layout/GraphLayout";
import { InteractionManager, MarkVertexInteractionManager } from "@/model/renderer/InteractionManager";
import { Graph } from "@/model/ds";
import { draw, redrawImpl, redrawNbr } from "@/model/DrawModel";
import { RedrawState } from "@/model/redraw/RedrawState";
import { Empty_Layout_Metric } from "@/model/metrics/LayoutMetrics";
import MetricPanel from "./MetricPanel";
import "./GraphsPanel.css";

interface GraphsPanelProps {
  config: ConfigDto;
}

const GraphsPanel: React.FC<GraphsPanelProps> = ({ config }) => {
  const [layout, setLayout] = useState(() => new GraphLayout());
  const [redrawState, setRedrawState] = useState(() => new RedrawState(new Graph()));
  const [interactMgr, setInteractMgr] = useState(() => new InteractionManager());
  const [renderCfg, setRenderCfg] = useState(() => mapToRenderCfg(config));
  const [panelSelect, setPanelSelect] = useState<"main" | "nbr" | "impl">("main");
  const [metric, setMetric] = useState(Empty_Layout_Metric);
  const [avgMetric, setAvgMetric] = useState(Empty_Layout_Metric);

  useEffect(() => {
    const [redrawState, tmpLayout, tmpInteractInfo, tmpMetric, tmpAvgMetric] = draw(config);
    setRedrawState(redrawState);
    setLayout(tmpLayout);
    setInteractMgr(new InteractionManager(tmpInteractInfo));
    setRenderCfg(mapToRenderCfg(config));
    setMetric(tmpMetric);
    setAvgMetric(tmpAvgMetric);
  }, [config]);

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
      <div style={{ flexShrink: 0, padding: "10px", display: "flex", gap: "10px" }}>
        <button onClick={() => setPanelSelect("main")} className={panelSelect === "main" ? "active" : ""}>
          Main Graph
        </button>
        <button onClick={() => setPanelSelect("nbr")} className={panelSelect === "nbr" ? "active" : ""}>
          Show selected + neighbours
        </button>
        <button onClick={() => setPanelSelect("impl")} className={panelSelect === "impl" ? "active" : ""}>
          Show implied
        </button>
      </div>
      <div style={{ flexGrow: 1 }}>
        {panelSelect === "main" ? (
          <GraphSvg graphLayout={layout} renderCfg={renderCfg} interactionManager={interactMgr} />
        ) : panelSelect === "nbr" ? (
          <GraphSvg graphLayout={nbrLayout} renderCfg={renderCfg} interactionManager={nbrInteractMgr} />
        ) : (
          <GraphSvg graphLayout={implLayout} renderCfg={renderCfg} interactionManager={implInteractMgr} />
        )}
      </div>
      {process.env.NODE_ENV === "development" && (
        <div style={{ flexGrow: 1 }}>
          {panelSelect === "main" ? (
            <div>
              <MetricPanel metric={metric} />
              <MetricPanel metric={avgMetric} />
            </div>
          ) : panelSelect === "nbr" ? (
            <MetricPanel metric={nbrMetric} />
          ) : (
            <MetricPanel metric={implMetric} />
          )}
        </div>
      )}
    </div>
  );
};

export default GraphsPanel;
