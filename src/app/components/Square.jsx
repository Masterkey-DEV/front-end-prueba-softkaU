import { useState } from "react";
export function Square({ children, gameStarted }) {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    if (gameStarted) {
      setIsSelected(!isSelected);
      return;
    }
    return;
  };

  return (
    <div
      className={`square ${isSelected ? "isSelected" : ""}`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
