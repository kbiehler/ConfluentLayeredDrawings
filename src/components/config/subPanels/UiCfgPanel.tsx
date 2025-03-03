import React from "react";
import { UiCfgDto } from "@/cfg/ConfigDtos";

type Props = {
  config: UiCfgDto;
  handleChange: (field: keyof UiCfgDto, value: any) => void;
};

const UiConfigPanel: React.FC<Props> = ({ config, handleChange }) => {
  return (
    <div>
      <h3>Ui Configuration</h3>
      <table className="config-table">
        <tbody>
          <tr>
            <td>Vertex Color:</td>
            <td>
              <input type="color" value={config.vertexColor} onChange={(e) => handleChange("vertexColor", e.target.value)} />
            </td>
          </tr>
          <tr>
            <td>Highlight Color:</td>
            <td>
              <input type="color" value={config.highlightColor} onChange={(e) => handleChange("highlightColor", e.target.value)} />
            </td>
          </tr>
          <tr>
            <td>Edge Color:</td>
            <td>
              <input type="color" value={config.edgeColor} onChange={(e) => handleChange("edgeColor", e.target.value)} />
            </td>
          </tr>
          <tr>
            <td>Vertex distance:</td>
            <td>
              <input type="number" value={config.yDist} onChange={(e) => handleChange("yDist", Number(e.target.value))} />
            </td>
          </tr>
          <tr>
            <td>Show clique centers</td>
            <td>
              <input type="checkbox" checked={config.showCliqueCenter} onChange={(e) => handleChange("showCliqueCenter", e.target.checked)} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UiConfigPanel;
