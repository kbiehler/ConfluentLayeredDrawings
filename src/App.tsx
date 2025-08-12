import { useState } from "react";
import ConfigPanel from "@/components/config/ConfigPanel";
import { ConfigDto } from "./cfg/ConfigDtos";
import GraphsPanel from "./components/GraphsPanel";
import "./App.css";

function App() {
  const [config, setConfig] = useState(() => new ConfigDto());

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {" "}
      <div style={{ flexShrink: 0, padding: "10px", display: "flex", gap: "10px" }}>
        <GraphsPanel config={config} />
      </div>
      <div style={{ flexShrink: 0 }}>
        {" "}
        <ConfigPanel config={config} setConfig={setConfig} />{" "}
      </div>{" "}
    </div>
  );
}

export default App;
