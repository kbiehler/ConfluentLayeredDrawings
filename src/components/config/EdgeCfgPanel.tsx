import React from "react";
import { EdgeDrawingCfgDto } from "@/cfg/ConfigDtos";
import { EdgeDrawingAlgorithm } from "@/model/layout/EdgeDrawer";

type Props = {
  config: EdgeDrawingCfgDto;
  handleChange: (field: keyof EdgeDrawingCfgDto, value: any) => void;
};

const EdgeDrawingConfigPanel: React.FC<Props> = ({ config, handleChange }) => {
  return (
    <div>
      <h3>Edge Drawing Configuration</h3>
      <table className="config-table">
        <tbody>
          <tr>
            <td>Algorithm:</td>
            <td>
              <select value={config.alg} onChange={(e) => handleChange("alg", e.target.value as EdgeDrawingCfgDto["alg"])}>
                {Object.values(EdgeDrawingAlgorithm).map((alg) => (
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

export default EdgeDrawingConfigPanel;
