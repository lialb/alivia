import classNames from "classnames";

import { CellProps } from "./crosswordData";

export const Cell: React.FC<CellProps> = ({
  cell,
  isSelected,
  isHighlighted,
  onClick,
}) => {
  return (
    <div
      className={classNames(
        "border border-gray-400 relative flex items-center justify-center font-bold",
        {
          "bg-black": cell.isBlack,
          "bg-white": !cell.isBlack && !isSelected && !isHighlighted,
          "bg-blue-300": isSelected, // Dark blue for the selected cell
          "bg-blue-100": !isSelected && isHighlighted, // Light blue for the rest of the word
        }
      )}
      style={{ width: "40px", height: "40px" }}
      onClick={onClick}
    >
      {cell.number && (
        <div className="absolute top-0 left-0 text-[9px] p-1">
          {cell.number}
        </div>
      )}
      {!cell.isBlack && (
        <div className="relative flex items-center justify-center w-full h-full">
          {cell.value}
        </div>
      )}
    </div>
  );
};
