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
  { key: "invoiceNumber", label: "Invoice Number", sortable: true },
  { key: "invoiceType", label: "Invoice Type", sortable: true },

  { key: "portsName", label: "Port Name", sortable: true },
  { key: "businessMail", label: "Business Mail", sortable: true },

  { key: "vesselImoNo", label: "Vessel IMO Number", sortable: true },
  { key: "vesselName", label: "Vessel Name", sortable: true },

  { key: "co", label: "C/O", sortable: true },
  { key: "to", label: "To", sortable: true },

  { key: "paymentNumber", label: "Payment Number", sortable: true },

  { key: "invoiceDate", label: "Invoice Date", sortable: true, isDate: true },
  { key: "dueDate", label: "Due Date", sortable: true, isDate: true },
  { key: "yardPaymentDueDate", label: "Yard Payment Due Date", sortable: true, isDate: true },

  { key: "totalAmount", label: "Total Amount", sortable: true, isCurrency: "$" },

  { key: "status", label: "Status", sortable: true, status: true },

  { key: "isASAgentOnly", label: "AS Agent Only", sortable: true },

  { key: "customize", label: "Customize", sortable: true },
  { key: "remarks", label: "Remarks", sortable: true },

  { key: "createdAt", label: "Created At", sortable: true, isDate: true },
  { key: "updatedAt", label: "Updated At", sortable: true, isDate: true },
];

const filterOptions = [
  { label: "Vessel IMO NO", value: "no" },
  { label: "Cont. Name", value: "name" },
];

const Users: React.FC = () => {
  const { data, loading, error } = useFetch(endpoints["Billing"].fetchAll);
  const updatedData = data?.data?.result;
  const paginationData = data?.data?.pagination;

  const { user } = useAuth();
  const operationsAllowed = getAccessPoints(user, "Manage Billing");

  if (loading && !updatedData && !error) return <Loader />;

  return (
    <AuthGuard>
      <Wrapper>
        <TableComponent
          type="Billing"
          suffix=""
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
