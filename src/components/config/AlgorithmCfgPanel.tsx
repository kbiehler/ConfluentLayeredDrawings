import React from "react";
import { AlgorithmCfgDto } from "@/cfg/ConfigDtos";
import { EdgeDrawingAlgorithm } from "@/model/layout/drawEdge/EdgeDrawer";
import { VertexPositionAlgorithm } from "@/model/layout/positioning/VertexPositioner";

type Props = {
  config: AlgorithmCfgDto;
  handleChange: (field: keyof AlgorithmCfgDto, value: any) => void;
};

const AlgorithmConfigPanel: React.FC<Props> = ({ config, handleChange }) => {
  return (
    <div>
      <h3>Algorithms:</h3>
      <table className="config-table">
        <tbody>
          <tr>
            <td>Edge Drawing:</td>
            <td>
              <select value={config.edgeDrawing} onChange={(e) => handleChange("edgeDrawing", e.target.value as AlgorithmCfgDto["edgeDrawing"])}>
                {Object.values(EdgeDrawingAlgorithm).map((alg) => (
                  <option key={alg} value={alg}>
                    {alg}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <td>Vertex Positioning</td>
            <td>
              <select value={config.vertexPositioning} onChange={(e) => handleChange("vertexPositioning", e.target.value as AlgorithmCfgDto["vertexPositioning"])}>
                {Object.values(VertexPositionAlgorithm).map((alg) => (
                  <option key={alg} value={alg}>
                    {alg}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AlgorithmConfigPanel;
