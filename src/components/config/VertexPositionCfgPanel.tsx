import React from "react";
import { VertexPositionCfgDto } from "@/cfg/ConfigDtos";

type Props = {
  config: VertexPositionCfgDto;
  handleChange: (field: keyof VertexPositionCfgDto, value: any) => void;
};

const VertexPositionCfgPanel: React.FC<Props> = ({ config, handleChange }) => {
  return (
    <div>
      <h3>Vertex Position Configuration</h3>
      <table className="config-table">
        <tbody>
          <tr>
            <td>Barycenter Depth:</td>
            <td>
              <input type="number" value={config.barycenterDepth} onChange={(e) => handleChange("barycenterDepth", Number(e.target.value))} />
            </td>
          </tr>
          <tr>
            <td>Barycenter Random Start:</td>
            <td>
              <input type="checkbox" checked={config.barycenterRandomStart} onChange={(e) => handleChange("barycenterRandomStart", e.target.checked)} />
            </td>
          </tr>
          <tr>
            <td>Layer Spacing:</td>
            <td>
              <input type="number" value={config.layerSpacing} onChange={(e) => handleChange("layerSpacing", Number(e.target.value))} />
            </td>
          </tr>
          <tr>
            <td>Vertex Spacing:</td>
            <td>
              <input type="number" value={config.vertexSpacing} onChange={(e) => handleChange("vertexSpacing", Number(e.target.value))} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default VertexPositionCfgPanel;
