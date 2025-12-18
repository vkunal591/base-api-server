"use client";

import dayjs from "dayjs";
import Modal from "./Modal";
import Header from "./table/Header";
import Filters from "./table/Filters";
import FormRenderer from "./FormRender";
import NoDataFound from "./NoDataFound";
import { Fetch } from "@/hooks/apiUtils";
import Table from "./table/TableComponent";
import Pagination from "./table/Pagination";
import { endpoints } from "@/data/endpoints";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";
import UploadCSVData from "../crud/UploadCSVData";

interface TableColumn {
  key: string;
  label: string;
  isDate?: boolean;
  sortable?: boolean;
  filterable?: boolean;
}

interface TableProps {
  data: any;
  type?: any;
  suffix?: string;
  filterOptions?: any;
  columns: TableColumn[];
  operationsAllowed: any;
  pagination_data?: Pagination;
}

interface Pagination {
  totalPages: number;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
}

const TableComponent = <T extends { [key: string]: any }>({
  data,
  type,
  suffix,
  columns,
  filterOptions,
  pagination_data,
  operationsAllowed,
}: TableProps) => {
  const [paginate, setPaginate] = useState<Pagination>({
    totalPages: pagination_data?.totalPages ?? 1,
    totalItems: pagination_data?.totalItems ?? 0,
    currentPage: pagination_data?.currentPage ?? 1,
    itemsPerPage: pagination_data?.itemsPerPage ?? 10,
  });
  const [activeStatus, setActiveStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sort, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({
    key: "",
    direction: null,
  });
  const [formData, setData] = useState<any>({});
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [formConfig, setFormConfig] = useState<any>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<Array<T>>(data ?? []);
  const path = usePathname();

  const handleCloseModal = () => {
    setFormConfig("");
    setIsModalVisible(false);
  };

  const handleSearch = (searchTerm: string, selectedOption: string) => {
    if (searchTerm && searchTerm.length < 4)
      return toast.warn("Search term must be at least 4 characters");
    setSearchTerm(searchTerm);
    setSelectedField(selectedOption);
    fetchFilteredData({ search: searchTerm, selectedField: selectedOption });
  };

  const handleReset = async () => {
    setEndDate("");
    setStartDate("");
    setSearchTerm("");
    setSelectedField("");
    setActiveStatus("all");
    await fetchFilteredData({
      limit: 10,
      page: 1,
      end: "",
      start: "",
      sortkey: "",
      sortdir: "",
      status: "all",
    });
  };

  const fetchFilteredData = async (filterParams: any = {}) => {
    // Build data object with fallback to existing state
    const data = {
      end: filterParams.end ?? endDate,
      sortkey: filterParams.key ?? sort.key,
      start: filterParams.start ?? startDate,
      search: filterParams.search ?? searchTerm,
      sortdir: filterParams.dir ?? sort.direction,
      status: filterParams.status ?? activeStatus,
      current: filterParams.page ?? paginate.currentPage,
      limit: filterParams.limit ?? paginate.itemsPerPage,
      searchkey: filterParams.selectedField ?? selectedField,
    };

    // Update pagination state
    setPaginate({
      ...paginate,
      currentPage: data.current,
      itemsPerPage: data.limit,
    });

    // Initialize query params
    const params: Record<string, any> = {
      page: data.current,
      limit: data.limit,
    };

    const currentData = new Date();
    const notificationRange = `?dueDateFrom=${dayjs(currentData).format(
      "YYYY-MM-DD"
    )}&dueDateTo=${dayjs(currentData)
      .add(4, "day")
      .format("YYYY-MM-DD")}&status=Unpaid`;

    const notificationParams: Record<string, any> = {
      page: data.current,
      limit: data.limit,
      dueDateFrom: dayjs(currentData).format("YYYY-MM-DD"),
      dueDateTo: dayjs(currentData).add(4, "day").format("YYYY-MM-DD"),
      status: "Unpaid",
    };

    const yardNotificationParams: Record<string, any> = {
      page: data.current,
      limit: data.limit,
      yardPaymentDueDateFrom: dayjs(currentData).format("YYYY-MM-DD"),
      yardPaymentDueDateTo: dayjs(currentData)
        .add(5, "day")
        .format("YYYY-MM-DD"),
      status: "Unpaid",
    };

    // Add status if applicable
    if (activeStatus !== "all" && data.status !== "all") {
      params.status = data.status;
    }

    // Add search if valid
    if (data.search?.length > 3 && data.searchkey) {
      params.search = data.search;
      params.searchkey = data.searchkey;
    }

    // Add start date if valid
    const start = data.start || startDate;
    if (start) {
      params.startDate = dayjs(start).format("YYYY-MM-DD");
    }

    // Add end date if valid
    const end = data.end || endDate;
    if (end) {
      params.endDate = dayjs(end).format("YYYY-MM-DD");
    }

    // Add sorting details if valid
    if (data.sortkey) {
      params.sortkey = data.sortkey;
      params.sortdir = data.sortdir;
    }

    // Fetch data from endpoint
    const fetchEndpoint = endpoints[type]?.fetchAll;
    if (fetchEndpoint) {
      try {
        const response: any = await Fetch(
          `http://localhost:3000/${fetchEndpoint}`,
          operationsAllowed?.custome
            ? path === "/dashboard/notifications"
              ? notificationParams
              : yardNotificationParams
            : params,
          5000,
          true,
          false
        );
        if (response?.success) {
          setFilteredData(response?.data?.result || []);
          setPaginate(response?.data?.pagination);
        }
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      }
    }
  };

  useEffect(() => {
    fetchFilteredData();
  }, [path]);

  useEffect(() => {
    if (isModalVisible) {
      document.body.style.overflow = "hidden"; // prevent overflow
    } else document.body.style.overflow = "scroll";
  }, [isModalVisible]);

  useEffect(() => {
    if (isUploadModalVisible) {
      document.body.style.overflow = "hidden"; // prevent overflow
    } else document.body.style.overflow = "scroll";
  }, [isUploadModalVisible]);
  const handleAdd = () => {
    setData({ name });
    setIsModalVisible(true);
  };

  const handleCSVUpload = () => {
    console.log('uplaod')
    setIsUploadModalVisible(true);

  }

  if (filteredData.length === 0 && !isModalVisible && !isUploadModalVisible)
    return (
      <NoDataFound
        type={type}
        handleAdd={handleAdd}
        handleReset={handleReset}
        handleCSVUpload={handleCSVUpload}
        operationsAllowed={operationsAllowed}
      />
    );

  return (
    <>
      {/* Modals */}
      <Modal
        formtype={
          formConfig ? "" : formData._id ? "Edit " + type : "Add " + type
        }
        isVisible={isModalVisible}
        onClose={handleCloseModal}
      >
        {type && formData && (
          <FormRenderer
            data={formData}
            setPaginate={setPaginate}
            onClose={handleCloseModal}
            setFilteredData={setFilteredData}
            formType={formConfig ? formConfig : type}
          />
        )}
      </Modal>

      {/* Modals */}
      <Modal
        formtype={
          "Upload CSV File"
        }
        isVisible={isUploadModalVisible}
        onClose={() => setIsUploadModalVisible(!isUploadModalVisible)}
      >
        {type && formData && (
          <UploadCSVData
            // data={formData}
            setPaginate={setPaginate}
            onClose={() => setIsUploadModalVisible(!isUploadModalVisible)}
            setFilteredData={setFilteredData}
            formType={formConfig ? formConfig : type}
          />
        )}
      </Modal>

      {/* Header */}
      <Header
        type={type}
        suffix={suffix}
        handleAdd={handleAdd}
        handleReset={handleReset}
        filteredData={filteredData}
        handleCSVUpload={handleCSVUpload}
        operationsAllowed={operationsAllowed}
      />

      <div className="py-5">
        {/* Search and Filters */}
        <Filters
          endDate={endDate}
          paginate={paginate}
          startDate={startDate}
          searchTerm={searchTerm}
          setEndDate={setEndDate}
          handleSearch={handleSearch}
          setStartDate={setStartDate}
          filterOptions={filterOptions}
          setSearchTerm={setSearchTerm}
          fetchFilteredData={fetchFilteredData}
        />

        {/* Table */}
        <Table
          sort={sort}
          type={type}
          columns={columns}
          setData={setData}
          setPaginate={setPaginate}
          filteredData={filteredData}
          setSortConfig={setSortConfig}
          setFilteredData={setFilteredData}
          setIsModalVisible={setIsModalVisible}
          operationsAllowed={operationsAllowed}
          fetchFilteredData={fetchFilteredData}
        />

        {/* Pagination */}
        <Pagination paginate={paginate} fetchFilteredData={fetchFilteredData} />
      </div>
    </>
  );
};

export default TableComponent;
