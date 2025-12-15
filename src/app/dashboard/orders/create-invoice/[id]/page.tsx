"use client";

import AuthGuard from "@/components/AuthGuard";
import Wrapper from "@/components/common/Wrapper";
import Header from "@/components/Header";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const InvoicePage = () => {
  const pathname = usePathname();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);

  // ---------------------------------------
  // Extract last URL segment
  // ---------------------------------------
  const segments = pathname.split("/");
  let rawId = segments[segments.length - 1] || null;

  // Identify if it's invoice-based ID (INV-xxxx)
  const isInvoiceMode = rawId?.startsWith("INV-");

  // Extract actual Mongo ID
  let id = rawId?.replace("INV-", "") || null;

  // Validate MongoDB ID
  const isValidMongoId = /^[a-fA-F0-9]{24}$/.test(id || "");

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !isValidMongoId) {
        console.warn("Invalid or missing ID");
        setLoading(false);
        return;
      }

      try {
        // ----------------------------------------
        // FETCH CONDITIONS
        // ----------------------------------------
        const endpoint = isInvoiceMode
          ? `/api/invoice/${id}` // If ID starts with INV-
          : `/api/ships/${id}`;  // If normal ID

        console.log("Fetching from:", endpoint);

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const res = await response.json();
        const { _id, ...rest } = res?.data?.result || {};

        // Set response data
        setData(rest);

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isInvoiceMode]);

  if (loading) return <div>Loading...</div>;

  return (
    <AuthGuard>
      <Wrapper>
        <Header
          title="Invoice Create"
          breadcrumbItems={[
            { label: "Pages", href: "" },
            { label: "Invoice Create", href: "" },
          ]}
        />

        <InvoiceForm responseData={data} />
      </Wrapper>
    </AuthGuard>
  );
};

export default InvoicePage;
