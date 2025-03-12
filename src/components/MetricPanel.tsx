import { LayoutMetrics } from "@/model/metrics/LayoutMetrics";
import React from "react";
import "./MetricPanel.css";

type MetricPanelProps = {
  metric: LayoutMetrics;
};

const MetricPanel: React.FC<MetricPanelProps> = ({ metric }) => {
  const [isVisible, setIsVisible] = React.useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className={`panel2 ${isVisible ? "open" : "closed"}`}>
      <button className="panel-toggle" onClick={toggleVisibility}>
        {isVisible ? "▼ Hide Metrics" : "▶ Show Metrics"}
      </button>
      {isVisible && (
        <div className="panel-content">
          <table className="metric-table">
            <tbody>
              <tr>
                <td>Vertical Layer:</td>
                <td>{metric.totalVerticalLayer}</td>
              </tr>
              <tr>
                <td>Bends:</td>
                <td>{metric.bends}</td>
              </tr>
              <tr>
                <td>Crossings:</td>
                <td>{metric.crossings}</td>
              </tr>
              <tr>
                <td>Ink:</td>
                <td>{metric.ink.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MetricPanel;
