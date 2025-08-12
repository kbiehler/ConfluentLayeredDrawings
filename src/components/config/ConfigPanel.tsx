import "./ConfigPanel.css";
import React, { useState } from "react";
import { ConfigDto } from "@/cfg/ConfigDtos";
import UiConfigPanel from "./subPanels/UiCfgPanel";
import BarycenterCfgPanel from "./subPanels/BarycenterCfgPanel";
import GraphConfigPanel from "./subPanels/GraphCfgPanel";
import AlgorithmConfigPanel from "./subPanels/AlgorithmCfgPanel";
import BiCliqueCfgPanel from "./subPanels/BiCliqueCfgPanel";
import LayerSpacingCfgPanel from "./subPanels/LayerSpacingCfgPanel";
import VertexSpacingCfgPanel from "./subPanels/VertexSpacingCfgPanel";
import OptimizationCfgPanel from "./subPanels/OptimizationCfgPanel";

type Props = {
  config: ConfigDto;
  setConfig: (cfg: ConfigDto) => void;
};

const ConfigPanel: React.FC<Props> = ({ config, setConfig }) => {
  const [localConfig, setLocalConfig] = useState<ConfigDto>({ ...config });
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleChange = (category: keyof ConfigDto, field: string, value: any) => {
    setLocalConfig((prev) => ({
      ...prev,
      [category]: { ...prev[category], [field]: value },
    }));
  };

  const handleApply = () => {
    setConfig(new ConfigDto(localConfig));
  };

  return (
    <div className={`panel ${isOpen ? "open" : "closed"}`}>
      <button className="panel-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "▼ Hide Config" : "▶ Show Config"}
      </button>
      {isOpen && (
        <div className="panel-content">
          <div className="config-grid" style={{ display: "flex", gap: "50px" }}>
            <GraphConfigPanel config={localConfig.graphCfg} handleChange={(field, value) => handleChange("graphCfg", field, value)} />
            <UiConfigPanel config={localConfig.uiCfg} handleChange={(field, value) => handleChange("uiCfg", field, value)} />
            <BarycenterCfgPanel config={localConfig.barycenterCfg} handleChange={(field, value) => handleChange("barycenterCfg", field, value)} />
            <AlgorithmConfigPanel config={localConfig.algCfg} handleChange={(field, value) => handleChange("algCfg", field, value)} />
            <BiCliqueCfgPanel config={localConfig.biCliqueCfg} handleChange={(field, value) => handleChange("biCliqueCfg", field, value)} />
            <LayerSpacingCfgPanel config={localConfig.layerSpacingCfg} handleChange={(field, value) => handleChange("layerSpacingCfg", field, value)} />
            <VertexSpacingCfgPanel config={localConfig.vertexSpacingCfg} handleChange={(field, value) => handleChange("vertexSpacingCfg", field, value)} />
            <OptimizationCfgPanel config={localConfig.optimizationCfg} handleChange={(field, value) => handleChange("optimizationCfg", field, value)} />
          </div>
          <button className="redraw-button" onClick={handleApply}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default ConfigPanel;
