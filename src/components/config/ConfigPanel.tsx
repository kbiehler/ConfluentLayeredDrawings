import "./ConfigPanel.css";
import React, { useState } from "react";
import { ConfigDto } from "@/model/cfg/ConfigDtos";
import UiConfigComponent from "./UiCfgPanel";
import VertexPositionCfgPanel from "./VertexPositionCfgPanel";

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
    setConfig(new ConfigDto());
    setConfig(localConfig);
  };

  return (
    <div className={`panel ${isOpen ? "open" : "closed"}`}>
      <button className="panel-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "▼ Hide Config" : "▶ Show Config"}
      </button>
      {isOpen && (
        <div className="panel-content">
          <div className="config-grid" style={{ display: "flex", gap: "50px" }}>
            <UiConfigComponent config={localConfig.uiConfig} handleChange={(field, value) => handleChange("uiConfig", field, value)} />
            <VertexPositionCfgPanel config={localConfig.vertexPositionCfg} handleChange={(field, value) => handleChange("vertexPositionCfg", field, value)} />
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
