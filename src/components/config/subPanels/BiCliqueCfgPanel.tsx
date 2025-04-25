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
            <td>Use BiClique:</td>
            <td>
              <input type="checkbox" checked={config.biClique} onChange={(e) => handleChange("biClique", Number(e.target.value))} />
            </td>
          </tr>
          <tr>
            <td>Post Process Shift:</td>
            <td>
              <input type="checkbox" checked={config.postProcessShift} onChange={(e) => handleChange("postProcessShift", e.target.checked)} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BiCliqueConfigPanel;
