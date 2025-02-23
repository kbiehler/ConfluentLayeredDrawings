import "./ConfigPanel.css";
import React, { useState } from "react";
import { VertexPositionCfg } from "@/model/drawing/VertexPositioner";

type Props = {
  cfg: VertexPositionCfg;
  setConfig: (cfg: VertexPositionCfg) => void;
};

const ConfigPanel: React.FC<Props> = ({ cfg, setConfig }) => {
  const [localCfg, setLocalCfg] = useState<VertexPositionCfg>({ ...cfg });
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleChange = (field: keyof VertexPositionCfg, value: string | boolean | number) => {
    setLocalCfg((prev) => ({ ...prev, [field]: value }));
  };

  const handleRedraw = () => {
    setConfig(new VertexPositionCfg());
    setConfig(localCfg);
  };

  return (
    <div className={`panel ${isOpen ? "open" : "closed"}`}>
      <button className="panel-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "▼ Config" : "▶ Hide Config"}
      </button>
      {isOpen && (
        <div className="panel-content">
          <h3 className="panel-title">Vertex Position Configuration</h3>
          <table className="config-table">
            <tbody>
              <tr>
                <td>Barycenter Depth:</td>
                <td>
                  <input type="number" value={localCfg.barycenterDepth} onChange={(e) => handleChange("barycenterDepth", Number(e.target.value))} />
                </td>
              </tr>
              <tr>
                <td>Barycenter Random Start:</td>
                <td>
                  <input type="checkbox" checked={localCfg.barycenterRandomStart} onChange={(e) => handleChange("barycenterRandomStart", e.target.checked)} />
                </td>
              </tr>
              <tr>
                <td>Layer Spacing:</td>
                <td>
                  <input type="number" value={localCfg.layerSpacing} onChange={(e) => handleChange("layerSpacing", Number(e.target.value))} />
                </td>
              </tr>
              <tr>
                <td>Vertex Spacing:</td>
                <td>
                  <input type="number" value={localCfg.vertexSpacing} onChange={(e) => handleChange("vertexSpacing", Number(e.target.value))} />
                </td>
              </tr>
            </tbody>
          </table>
          <button className="redraw-button" onClick={handleRedraw}>
            Redraw
          </button>
        </div>
      )}
    </div>
  );
};

export default ConfigPanel;
