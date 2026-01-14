import UserForm from "../crud/Adminform";
import LeadForm from "../crud/LeadsForm";
import LedgerForm from "../crud/LedgerForm";
import ManageRoleForm from "../crud/Roleform";
import Productform from "../crud/ProductForm";
import UOMForm from "../crud/product/UOMForm";
import Packingform from "../crud/PackingForm";
import PaymentForm from "../crud/PaymentForm";
import PurchaseForm from "../crud/PurchaseForm";
import QuotationForm from "../crud/QuotationForm";
import BrandForm from "../crud/product/BrandForm";
import WarehouseForm from "../crud/WareHouseForm";
import CategoryForm from "../crud/product/CategoryForm";
import ConfirmationModal from "../crud/ConfirmationModal";
import StockTransferForm from "../crud/StockTransferForm";
import ShipForm from "../crud/ShipForm";
import ViewInvoiceForm from "../crud/ViewInvoiceForm";
import YardVendorForm from "../crud/YardVendorForm";

interface FormRendererProps {
  data: any;
  onClose?: any;
  formType: string;
  setPaginate?: any;
  setFilteredData?: any;
}

const FormRenderer: React.FC<FormRendererProps> = (props: any) => {
  switch (props.formType) {
    case "Employee":
      return <UserForm {...props} />;
    case "Invoice":
      return <ViewInvoiceForm {...props} />;
    case "Packing":
      return <Packingform {...props} />;
    case "Product":
      return <Productform {...props} />;
    case "Brand":
      return <BrandForm {...props} />;
    case "Category":
      return <CategoryForm {...props} />;
    case "Delete":
      return <ConfirmationModal {...props} />;
    case "Lead":
      return <LeadForm {...props} />;
    case "Ledger":
      return <LedgerForm {...props} />;
    case "Ships":
      return <ShipForm {...props} />;
    case "Yards":
      return <YardVendorForm {...props} />;
    case "Purchase":
      return <PurchaseForm {...props} />;
    case "Payment":
      return <PaymentForm {...props} />;
    case "Role":
      return <ManageRoleForm {...props} />;
    case "UOM":
      return <UOMForm {...props} />;
    case "StockTransfer":
      return <StockTransferForm {...props} />;
    case "Warehouse":
      return <WarehouseForm {...props} />;
    case "Quotation":
      return <QuotationForm {...props} />;
    default:
      return <div>No Form Exist</div>;
  }
};

export default FormRenderer;
