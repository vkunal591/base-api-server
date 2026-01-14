import { FaFileUpload, FaFilter } from "react-icons/fa";
import { debounce } from "@/hooks/general";
import GenerateExcelButton from "../GenerateExcel";

interface HeaderProps {
  type: string;
  suffix?: string;
  filteredData: any[];
  handleReset: () => void;
  handleAdd: () => void;
  handleCSVUpload?: () => void;
  operationsAllowed: {
    create?: boolean;
    [key: string]: boolean | undefined;
  };
}

const Header: React.FC<HeaderProps> = ({
  type,
  suffix,
  handleAdd,
  handleReset,
  filteredData,
  operationsAllowed,
  handleCSVUpload,
}) => {
  return (
    <div className="flex bg-whiteBg p-5 rounded-2xl justify-between items-center">
      {/* Title */}
      <h2 className="text-3xl text-iconBlack font-semibold w-fit">
        All {type} <span className="font-normal text-xl">{suffix}</span>
      </h2>

      {/* Actions */}
      <div className="space-x-2 flex">
        {/* Export to Excel */}
        <GenerateExcelButton data={filteredData} />

        {/* Clear Filters Button */}
        <button
          type="button"
          onClick={debounce(handleReset, 1000)}
          className="bg-secondary text-white flex gap-2 justify-center items-center outline-none px-4 text-lg py-2 rounded-xl active:bg-gray-500"
        >
          Refresh <FaFilter className="text-sm" />
        </button>

        {/* Add Button */}
        {operationsAllowed?.create && (
          <button
            type="button"
            onClick={handleAdd}
            className="bg-secondary text-white px-4 py-1 rounded-xl"
          >
            Add {type}
            <sup>+</sup>
          </button>
        )}
        {/* Upload Button */}
        {operationsAllowed?.upload && (
          <button
            type="button"
            onClick={handleCSVUpload}
            className="bg-green-500 flex items-center justify-center gap-1 text-white px-4 py-1 rounded-xl"
            // className="bg-green-500  text-white px-4 py-2 flex items-center justify-center gap-1 w-full h-fit rounded-md"

          >
            <FaFileUpload /> Upload Excel
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
