"use client";

import useFetch from "@/hooks/useFetch";
import { endpoints } from "@/data/endpoints";
import AuthGuard from "@/components/AuthGuard";
import Loader from "@/components/common/Loader";
import { useAuth } from "@/context/AuthContext";
import Wrapper from "@/components/common/Wrapper";
import { getAccessPoints } from "@/hooks/general";
import TableComponent from "@/components/common/Table";

const columns = [
  // { key: "_id", label: "Ship ID", sortable: false },
  { key: "vesselName", label: "Vessel Name", sortable: false },
  { key: "vesselImoNo", label: "Vessel (IMO NO)", sortable: false },
  { key: "companyName", label: "Company Name", sortable: true },
  { key: "yardName", label: "Yard Name", sortable: true },
  { key: "portsName", label: "Port Name", sortable: true },
  { key: "repairedMonth", label: "Repaired Month", sortable: true },
  { key: "invoiceNumber", label: "Invoice Number", sortable: true },
  {
    key: "sudInvoiceToOwners",
    label: "SUD Invoice to Owners (USD) CR",
    sortable: true,
    isCurrency: "$",
  },
  { key: "dueDate", label: "Due Date", sortable: true, isDate: true },
  {
    key: "actualPayment",
    label: "Actual Payment",
    sortable: true,
    isCurrency: "$",
  },
  {
    key: "bankCharges",
    label: "Bank Charges",
    sortable: true,
    isCurrency: "$",
  },
  {
    key: "actualPaymentDate",
    label: "Actual Payment Date",
    sortable: true,
    isDate: true,
  },
  {
    key: "yardInvoiceToSUD",
    label: "Yard Invoice To SUD",
    sortable: true,
    isCurrency: "$",
  },
  {
    key: "yardPaymentDueDate",
    label: "Yard Payment Due Date",
    sortable: true,
    isDate: true,
  },
  {
    key: "yardActualPaymentDate",
    label: "Yard Actual Payment Date",
    sortable: true,
    isDate: true,
  },
  { key: "remarks", label: "Remarks", sortable: true },
  { key: "arrival", label: "Arrival Date", sortable: true, isDate: true },
  { key: "departure", label: "Departure Date", sortable: true, isDate: true },
  // { key: "createdAt", label: "Creation Date", sortable: true, isDate: true },
];
const filterOptions = [
  { label: "State", value: "state" },
];

const Users: React.FC = () => {
  const { data, loading, error } = useFetch(endpoints["Ships"].fetchAll);
  const updatedData = data?.data?.result;
  const paginationData = data?.data?.pagination;

  const { user } = useAuth();
  const operationsAllowed = getAccessPoints(user, "Manage Ships");

  if (loading && !updatedData && !error) return <Loader />;

  return (
    <AuthGuard>
      <Wrapper>
        <TableComponent
          type="Ships"
          suffix="/party"
          columns={columns}
          data={updatedData}
          filterOptions={filterOptions}
          pagination_data={paginationData}
          operationsAllowed={operationsAllowed}
        />
      </Wrapper>
    </AuthGuard>
  );
};

export default Users;
