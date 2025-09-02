import React from "react";

interface HeaderProps {
  fit: () => void;
  zoom: (scale: number) => void;
  reset: () => void;
}

const Header: React.FC<HeaderProps> = ({ fit, zoom, reset }) => {
  return (
    <header className="header">
      <h1>Confluent Layered Drawer</h1>
      <div className="toolbar">
        <button className="btn" onClick={fit}>
          Fit
        </button>
        <button className="btn" onClick={() => zoom(1.1)}>
          ＋
        </button>
        <button className="btn" onClick={() => zoom(0.9)}>
          －
        </button>
        <button className="btn" onClick={reset}>
          Reset
        </button>
      </div>
    </header>
  );
};

export default Header;
