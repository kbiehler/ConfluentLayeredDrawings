import GraphSvg from "@/components/GraphSvg";
import { createRandomLayeredGraph } from "./model/ExampleGraphs";
import { straightLineDrawing } from "./model/layout/GraphLayoutGenerator";
import { useEffect, useState } from "react";
import ConfigPanel from "./components/config/ConfigPanel";
import { ConfigDto, mapToDrawCfg, mapToGraphLayoutCfg } from "./model/cfg/ConfigDtos";

function App() {
  const G = createRandomLayeredGraph([5, 5, 5], 0.2);
  const [config, setConfig] = useState(new ConfigDto());
  const [drawing, setDrawing] = useState(straightLineDrawing(G, mapToGraphLayoutCfg(config)));
  const [drawCfg, setDrawCfg] = useState(mapToDrawCfg(config));

  useEffect(() => {
    setDrawing(straightLineDrawing(G, mapToGraphLayoutCfg(config)));
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
