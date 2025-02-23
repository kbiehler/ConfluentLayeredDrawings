import GraphSvg from "@/components/GraphSvg";
import { createRandomLayeredGraph } from "./model/ExampleGraphs";
import { straightLineDrawing } from "./model/layout/GraphLayoutGenerator";
import { useEffect, useState } from "react";
import ConfigPanel from "./components/config/ConfigPanel";
import { ConfigDto, mapToDrawCfg, mapToDrawingAlgorithmCfg } from "./model/cfg/ConfigDtos";

function App() {
  const G = createRandomLayeredGraph([5, 5, 5], 0.5);
  const [config, setConfig] = useState(new ConfigDto());
  const [drawing, setDrawing] = useState(straightLineDrawing(G, mapToDrawingAlgorithmCfg(config)));
  const [drawCfg, setDrawCfg] = useState(mapToDrawCfg(config));

  useEffect(() => {
    setDrawing(straightLineDrawing(G, mapToDrawingAlgorithmCfg(config)));
    setDrawCfg(mapToDrawCfg(config));
  }, [config]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {" "}
      <div style={{ flexShrink: 0 }}>
        {" "}
        <ConfigPanel config={config} setConfig={setConfig} />{" "}
      </div>{" "}
      <div style={{ flexGrow: 1 }}>
        {" "}
        <GraphSvg graphDrawing={drawing} title={"test"} renderCfg={drawCfg} />{" "}
      </div>{" "}
    </div>
  );
}

export default App;
