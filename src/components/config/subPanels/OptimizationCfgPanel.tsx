import React from "react";
import { OptimizationCfgDto } from "@/cfg/ConfigDtos";

type Props = {
  config: OptimizationCfgDto;
  handleChange: (field: keyof OptimizationCfgDto, value: any) => void;
};

const VertexSpacingCfgPanel: React.FC<Props> = ({ config, handleChange }) => {
  return (
    <div>
      <h3>Optimization</h3>
      <table className="config-table">
        <tbody>
          <tr>
            <td>Tries:</td>
            <td>
              <input type="number" value={config.metricTries} onChange={(e) => handleChange("metricTries", parseFloat(e.target.value))} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default VertexSpacingCfgPanel;
