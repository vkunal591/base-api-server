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

        <InvoiceForm responseData={data} updateId={null} />
      </Wrapper>
    </AuthGuard>
  );
};

export default InvoicePage;
