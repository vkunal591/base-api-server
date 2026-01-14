import dayjs from "dayjs";
import Actions from "./Actions";
import { useState } from "react";
import { functionList } from "@/hooks/customFunction";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import MultiPurposeComponent from "../MultiPurposeComponentProps";
import Modal from "../Modal";
import ConfirmModal from "@/components/crud/ConfirmModal";

interface Column {
  key: string;
  label: string;
  isDate?: boolean;
  sortable?: boolean;
  isCurrency?: string;
  status?: boolean;
}

interface OperationsAllowed {
  read?: boolean;
  update?: boolean;
  delete?: boolean;
}

interface TableProps {
  sort: any;
  type: string;
  columns: Column[];
  filteredData: any;
  setSortConfig: any;
  fetchFilteredData: any;
  setData: (data: any) => void;
  setFilteredData: (data: any) => void;
  operationsAllowed: OperationsAllowed;
  setPaginate: (pagination: any) => void;
  setIsModalVisible: (isVisible: boolean) => void;
}


const getStatusClass = (status:any) => {
  switch (status) {
    case "Paid":
      return "bg-green-50 text-green-600";
    case "Pending":
      return "bg-yellow-50 text-yellow-600";
    case "Unpaid":
      return "bg-red-50 text-red-600";
    case "Overdue":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-50 text-gray-600";
  }
};

const Table: React.FC<TableProps> = ({
  sort,
  type,
  columns,
  setData,
  setPaginate,
  filteredData,
  setSortConfig,
  setFilteredData,
  setIsModalVisible,
  operationsAllowed,
  fetchFilteredData,
}) => {
  const [confirmation, setConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState<any>({});
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" | null = "asc";
    if (sort.key === key && sort.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    fetchFilteredData({ key, dir: direction });
  };

  const formatRowValue = (
    row: Record<string, any>,
    col: {
      key: string;
      isDate?: boolean;
      isPercent?: string;
      isCurrency?: string;
      isMultiPurpose?: boolean;
      multiPurposeProps?: {
        options?: string[];
        type: "label" | "button" | "select";
      };
    }
  ) => {
    const value = row[col.key];

    if (
      col.isMultiPurpose &&
      col.multiPurposeProps &&
      value !== undefined &&
      value !== null &&
      value.toString()
    ) {
      const { multiPurposeProps } = col;
      const onClickHandler = async (data: any) => {
        try {
          const action = functionList[type];
          if (!action) throw new Error(`No handler found for type: ${type}`);

          const result = await action(data);
          if (result) await fetchFilteredData({});
          else console.log("Action failed to complete successfully.");
        } catch (error) {
          console.log("Error executing onClickHandler:", error);
        } finally {
          setConfirmation(false);
        }
      };

      const handleConfirmation = (data: any) => {
        setConfirmation(true);
        setConfirmationData(data);
      };

      return (
        <>
          <Modal
            width="w-fit"
            isVisible={confirmation}
            onClose={() => setConfirmation(false)}
          >
            <ConfirmModal
              data={confirmationData}
              handleAction={onClickHandler}
              onClose={() => setConfirmation(false)}
            />
          </Modal>
          <MultiPurposeComponent
            _id={row?._id}
            {...multiPurposeProps}
            text={value.toString()}
            onClick={handleConfirmation}
            onSelectChange={handleConfirmation}
          />
        </>
      );
    }
    if (col.key === "_id") return null;
    // if (col.key === "_id") return value?.slice(-8);
    if (col.isDate && value) return dayjs(value).format("YYYY-MM-DD");
    if (col.isCurrency && value) return `${col.isCurrency} ${value}`;
    if (col.isPercent) return `${value} ${col.isPercent}`;

    if (typeof value === "number") return value;
    if (typeof value === "boolean") return value.toString();

    if (value)
      return value.toString().length > 50
        ? value.toString().slice(0, 50) + " ..."
        : value.toString();
    else return "-";
  };

  return (<div className="overflow-x-scroll no-scrollbar">
    <div className="overflow-y-auto no-scrollba" style={{ maxHeight: '70vh' }}>
      <table className="min-w-full bg-white text-center">
        <thead className="sticky top-0 bg-white z-10">
          <tr className="whitespace-nowrap">
            <th className="p-4 border text-left text-iconBlack border-info font-bold">
              Sr. No.
            </th>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  maxWidth: `calc(100% / ${columns.length + 1})`,
                }}
                className="p-4 text-iconBlack font-bold border border-info text-left cursor-pointer"
                onClick={() => col.sortable && handleSort(col.key)}
              >
                {col.label}
                {col.sortable && (
                  <>
                    {sort.key === col.key && sort.direction === "asc" ? (
                      <FaSortUp className="inline ml-2" />
                    ) : sort.key === col.key && sort.direction === "desc" ? (
                      <FaSortDown className="inline ml-2" />
                    ) : (
                      <FaSort className="inline ml-2" />
                    )}
                  </>
                )}
              </th>
            ))}
            {operationsAllowed?.read && (
              <th className="p-4 border text-left text-iconBlack border-info font-bold">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredData?.length > 0 ? (
            filteredData.map((row: any, index: number) => (
              <tr
                key={index}
                className="border text-black border-info cursor-pointer"
              >
                <th className="p-4 border text-left text-iconBlack border-info font-bold">
                  {index + 1}
                </th>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="text-sm border text-iconBlack whitespace-nowrap border-info px-4 py-3"
                  >
                    {col.status ? (
                      <span
                      className={`flex justify-center items-center rounded-md ${getStatusClass(formatRowValue(row, col))} px-2 py-1 text-xs font-medium ring-1 ring-gray-500/10 ring-inset`}

                      >
                        {formatRowValue(row, col)}
                      </span>
                    ) : (
                      formatRowValue(row, col)
                    )}
                  </td>
                ))}
                {operationsAllowed?.read && (
                  <td className="text-nowrap border border-info px-4 py-3">
                    <Actions
                      row={row}
                      type={type}
                      setData={setData}
                      setPaginate={setPaginate}
                      setFilteredData={setFilteredData}
                      setIsModalVisible={setIsModalVisible}
                      operationsAllowed={operationsAllowed}
                    />
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (operationsAllowed?.read ? 1 : 0)}
                className="text-center p-4 text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default Table;
