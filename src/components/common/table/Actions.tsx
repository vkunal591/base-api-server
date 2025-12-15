import Modal from "../Modal";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { endpoints } from "@/data/endpoints";
import { Delete, Fetch } from "@/hooks/apiUtils";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaFileInvoiceDollar,
  FaRegFilePdf,
} from "react-icons/fa";
import ConfirmationModal from "@/components/crud/ConfirmationModal";
import UpdateInvoiceForm from "@/components/crud/UpdateInvoiceForm";
import { GrUpdate } from "react-icons/gr";
import { handleDownloadPDF } from "@/hooks/pdfFormat";
import dayjs from "dayjs";
import { FaFilePen } from "react-icons/fa6";

interface RowData {
  _id: string;
  status?: string;
  dueDate?: string;
  yardPaymentDueDate?: string;
}

interface OperationsAllowed {
  update?: boolean;
  delete?: boolean;
  viewStock?: boolean;
  invoice?: boolean;
  updateStatus?: boolean;
  print?: boolean;
  updateInvoice?: boolean;
}

interface ActionsProps {
  row: RowData;
  type: keyof typeof endpoints;
  setData: (data: any) => void;
  setFilteredData: (data: any) => void;
  operationsAllowed: OperationsAllowed;
  setPaginate: (pagination: any) => void;
  setIsModalVisible: (isVisible: boolean) => void;
}

const Actions: React.FC<ActionsProps> = ({
  type,
  row,
  setData,
  setPaginate,
  setFilteredData,
  setIsModalVisible,
  operationsAllowed,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectIdForDeletion, setSelectIdForDeletion] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dueDate, setDueDate] = useState<any>("");
  const [yardPaymentDueDate, setYardPaymentDueDate] = useState<any>("");

  const handleEdit = async (id?: string) => {
    if (!id) return;

    try {
      const endpoint = endpoints[type]?.read;

      console.log(endpoint)
      if (!endpoint) return;

      const response: any = await Fetch(`${endpoint}${id}`, {}, 5000, true);
      if (
        response?.success &&
        (response?.data?._id || response?.data?.result?._id)
      ) {
        setData(response.data.result ? response.data.result : response.data);
      } else setData({});
      setIsModalVisible(true);
    } catch (error) {
      console.log("Handle Edit", error);
    }
  };

  const currentData = new Date();
  // const notificationParams: Record<string, any> = {
  //   // page: data.current,
  //   // limit: data.limit,
  //   dueDateFrom: dayjs(currentData).subtract(3, 'day').format("YYYY-MM-DD"),
  //   dueDateTo: dayjs(currentData).format("YYYY-MM-DD"),
  //   status: "Unpaid"
  // };
  const notificationRange =
    type === "Notifications"
      ? `?dueDateFrom=${dayjs(currentData).format(
        "YYYY-MM-DD"
      )}&dueDateTo=${dayjs(currentData)
        .add(4, "day")
        .format("YYYY-MM-DD")}&status=Unpaid`
      : "";
  const yardNotificationRange =
    type === "Notifications"
      ? `?yardPaymentDueDateFrom=${dayjs(currentData).format(
        "YYYY-MM-DD"
      )}&yardPaymentDueDateTo=${dayjs(currentData)
        .add(5, "day")
        .format("YYYY-MM-DD")}&status=Unpaid`
      : "";

  const handleDelete = async (id: string) => {
    if (!id) return;

    try {
      setSelectIdForDeletion(id);
      if (!showDeleteModal) return setShowDeleteModal(true);

      const deleteEndpoint = endpoints[type]?.delete;
      const fetchEndpoint = `${endpoints[type]?.fetchAll}${pathname === "/dashboard/notifications"
        ? notificationRange
        : yardNotificationRange
        }`;

      if (deleteEndpoint && fetchEndpoint) {
        await Delete(`${deleteEndpoint}${id}`);
        const response: any = await Fetch(fetchEndpoint, {}, 5000, true, false);

        if (response?.success) {
          setShowDeleteModal(false);
          setFilteredData(response?.data?.result);
          setPaginate(response?.data?.pagination);
        } else window.location.reload();
      }
    } catch (error) {
      console.log("Handle Delete", error);
    }
  };

  const handleView = async (id?: string) => {
    if (!id) return;
    const url = `${pathname}/${id}`;
    return router.push(url);
  };
  const handleInvoice = async (id?: string) => {
    if (!id) return;
    const url = `${"/dashboard/orders/create-invoice"}/${id}`;
    return router.push(url);
  };

  const handleDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const fetchUpdatedDataForStatusUpdateCustom = async () => {
    const fetchEndpoint = `${endpoints[type]?.fetchAll}${notificationRange}`;
    if (fetchEndpoint) {
      const response: any = await Fetch(fetchEndpoint, {}, 5000, true, false);

      if (response?.success) {
        setShowDeleteModal(false);
        setFilteredData(response?.data?.result);
        setPaginate(response?.data?.pagination);
      } else window.location.reload();
    }
  };
  return (
    <>
      <Modal isVisible={showDeleteModal} onClose={handleDeleteModal}>
        <ConfirmationModal
          id={selectIdForDeletion}
          handleDelete={handleDelete}
          handleDeleteModal={handleDeleteModal}
        />
      </Modal>
      {operationsAllowed?.update && (
        <button
          onClick={() => handleEdit(row._id)}
          className="text-blue-500 text-xl hover:scale-125 hover:p-1 mr-1 hover:bg-blue-100 p-1 rounded transition"
        >
          <FaEdit title="Edit" />
        </button>
      )}
      {operationsAllowed?.delete && (
        <button
          onClick={() => handleDelete(row._id)}
          className="text-red-700 text-xl hover:scale-125 hover:p-1 hover:bg-red-100 p-1 rounded transition"
        >
          <FaTrash title="Delete" />
        </button>
      )}
      {operationsAllowed?.viewStock && (
        <button
          onClick={() => handleView(row._id)}
          className="text-green-700 ml-1 text-xl hover:scale-125 hover:p-1 hover:bg-green-100 p-1 rounded transition"
        >
          <FaEye title="View Stock" />
        </button>
      )}
      {operationsAllowed?.invoice && (
        <button
          onClick={() => handleInvoice(row._id)}
          className="text-green-700 ml-1 text-xl hover:scale-125 hover:p-1 hover:bg-green-100 p-1 rounded transition"
        >
          <FaFileInvoiceDollar title="Generate Invoice" />
        </button>
      )}

      {operationsAllowed?.updateInvoice && (
        <button
          onClick={() => handleInvoice(`INV-${row._id}`)}
          className="text-green-700 ml-1 text-xl hover:scale-125 hover:p-1 hover:bg-green-100 p-1 rounded transition"
        >
          <FaFilePen title="Update Invoice" />
        </button>
      )}

      {operationsAllowed?.updateStatus && (
        <button
          onClick={() => {
            setDueDate(row?.dueDate);
            setYardPaymentDueDate(row?.yardPaymentDueDate);
            setIsOpen(true);
          }}
          className="text-green-700 ml-1 text-xl hover:scale-125 hover:p-1 hover:bg-green-100 p-1 rounded transition"
        >
          <GrUpdate title="Update Status" />
        </button>
      )}

      {operationsAllowed?.print && (
        <button
          onClick={() => handleDownloadPDF(row)}
          className="text-green-700 ml-1 text-xl hover:scale-125 hover:p-1 hover:bg-green-100 p-1 rounded transition"
        >
          <FaRegFilePdf title="Download PDF" />
        </button>
      )}
      <UpdateInvoiceForm
        isOpen={isOpen}
        fetchData={fetchUpdatedDataForStatusUpdateCustom}
        onClose={() => setIsOpen(false)}
        invoiceId={row?._id}
        currentStatus={row?.status}
        currentDueDate={dueDate}
        currentYardPaymentDueDate={yardPaymentDueDate}
      />
    </>
  );
};

export default Actions;
