import React from "react";
import { UiCfgDto } from "@/model/cfg/ConfigDtos";

type Props = {
  config: UiCfgDto;
  handleChange: (field: keyof UiCfgDto, value: any) => void;
};

const UiConfigComponent: React.FC<Props> = ({ config, handleChange }) => {
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
        </tbody>
      </table>
    </div>
  );
};

export default UiConfigComponent;
