import AuthGuard from "@/components/AuthGuard";
import Wrapper from "@/components/common/Wrapper";
import Header from "@/components/Header";
import InvoiceForm from "@/components/invoice/InvoiceForm";

const InvoicePage = () => {
  
  return (
    <AuthGuard>
      <Wrapper>
        <Header
          title="Invoice Create"
          breadcrumbItems={[
            {
              label: "Pages",
              href: "",
            },
            {
              label: "Invoice Create",
              href: "",
            },
          ]}
        />
        <InvoiceForm responseData={null} />
      </Wrapper>
    </AuthGuard>
  );
};

export default InvoicePage;
