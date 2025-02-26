import React from "react";
import { BarycenterCfgDto } from "@/cfg/ConfigDtos";

type Props = {
  config: BarycenterCfgDto;
  handleChange: (field: keyof BarycenterCfgDto, value: any) => void;
};

const BarycenterCfgPanel: React.FC<Props> = ({ config, handleChange }) => {
  return (
    <div>
      <h3>Barycenter Configuration</h3>
      <table className="config-table">
        <tbody>
          <tr>
            <td>Depth:</td>
            <td>
              <input type="number" value={config.barycenterDepth} onChange={(e) => handleChange("barycenterDepth", Number(e.target.value))} />
            </td>
          </tr>
          <tr>
            <td>Init. random:</td>
            <td>
              <input type="checkbox" checked={config.barycenterRandomInit} onChange={(e) => handleChange("barycenterRandomInit", e.target.checked)} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BarycenterCfgPanel;
