import { BiCliqueCfg } from "@/cfg/ConfigDtos";

import React from "react";

type Props = {
  config: BiCliqueCfg;
  handleChange: (field: keyof BiCliqueCfg, value: any) => void;
};

const BiCliqueConfigPanel: React.FC<Props> = ({ config, handleChange }) => {
  return (
    <div>
      <h3>BiClique Configuration:</h3>
      <table className="config-table">
        <tbody>
          <tr>
            <td>BiClique Depth:</td>
            <td>
              <input type="number" value={config.bicliqueDepth} onChange={(e) => handleChange("bicliqueDepth", Number(e.target.value))} min={1} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BiCliqueConfigPanel;
