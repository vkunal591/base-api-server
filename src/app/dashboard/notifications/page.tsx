"use client";

import useFetch from "@/hooks/useFetch";
import { endpoints } from "@/data/endpoints";
import AuthGuard from "@/components/AuthGuard";
import Loader from "@/components/common/Loader";
import { useAuth } from "@/context/AuthContext";
import Wrapper from "@/components/common/Wrapper";
import { getAccessPoints } from "@/hooks/general";
import TableComponent from "@/components/common/Table";
import dayjs from "dayjs";


const columns = [
  // { key: "_id", label: "Invoice ID", sortable: false },
  { key: "invoiceNumber", label: "Invoice Number", sortable: true },
  { key: "vesselImoNo", label: "Vessel IMO Number", sortable: true },
  { key: "vesselName", label: "Vessel Name", sortable: true },
  { key: "invoiceDate", label: "Invoice Date", sortable: true,isDate:true },
  { key: "dueDate", label: "Due Date", sortable: true ,isDate:true},
  { key: "totalAmount", label: "Total Amount", sortable: true, isCurrency:"$" },
  { key: "status", label: "Status", sortable: true,status:true },
  { key: "createdAt", label: "Created At", sortable: true,isDate:true },
  { key: "updatedAt", label: "Updated At", sortable: true,isDate:true },
];

const filterOptions = [
  { label: "Cont. Name", value: "name" },
  { label: "Email ID", value: "email" },
  { label: "Cont. Number", value: "mobileNo" },
  { label: "Category", value: "ledgerType" },
  { label: "Comp. Name", value: "companyName" },
  { label: "State", value: "state" },
];

const currentData = new Date();
const notificationRange = `?dueDateFrom=${dayjs(currentData).format("YYYY-MM-DD")}&dueDateTo=${dayjs(currentData).add(3, 'day').format("YYYY-MM-DD")}&status=Unpaid`

const Users: React.FC = () => {
  const { data, loading, error } = useFetch(`${endpoints["Notifications"].fetchAll}${notificationRange}`);
  const updatedData = data?.data.result;
  const paginationData = data?.data?.pagination;

  const { user } = useAuth();
  const operationsAllowed = getAccessPoints(user, "Manage Notifications");

  if (loading && !updatedData && !error) return <Loader />;

  return (
    <AuthGuard>
      <Wrapper>
        <TableComponent
          type="Notifications"
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
