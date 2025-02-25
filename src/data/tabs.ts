import { SiGoogleadmob } from "react-icons/si";
import { GiBoxUnpacking } from "react-icons/gi";
import { BsChatQuoteFill } from "react-icons/bs";
import { FaHome, FaBarcode, FaShip } from "react-icons/fa";
import { RiAdminFill, RiSecurePaymentFill } from "react-icons/ri";
import { TbBrandBebo, TbRulerMeasure2, TbTransferIn } from "react-icons/tb";
import {
  FaWarehouse,
  FaProductHunt,
  FaMoneyBillTransfer,
} from "react-icons/fa6";
import { BiSolidPurchaseTagAlt, BiSolidCategory } from "react-icons/bi";
import { MdCorporateFare, MdManageAccounts, MdNotificationImportant, MdOutlineContactSupport } from "react-icons/md";

// Define tabs
export const tabs = [
  {
    id: 1,
    tabs: [],
    icon: FaHome,
    label: "Dashboard",
    href: "/dashboard",
    pageTitle: "Overview",
    permission: "Dashboard",
  },
  {
    id: 14,
    tabs: [],
    icon: FaShip,
    label: "Manage Ships",
    href: "/dashboard/ships",
    pageTitle: "Manage Ships",
    permission: "Manage Ships",
  },
  {
    id: 16,
    tabs: [],
    icon: MdOutlineContactSupport,
    label: "Manage Invoice",
    href: "/dashboard/invoice",
    pageTitle: "Manage Invoice",
    permission: "Manage Invoice",
  },
  {
    id: 13,
    href: "",
    icon: FaProductHunt,
    label: "Manage Orders",
    pageTitle: "All Orders",
    permission: "Manage Orders",
    tabs: [
      {
        id: 1,
        icon: BiSolidCategory,
        label: "Create Invoice",
        pageTitle: "Create Invoice",
        permission: "Create Invoice",
        href: "/dashboard/orders/create-invoice",
      },
      {
        id: 2,
        icon: BiSolidCategory,
        label: "Invoice Details",
        pageTitle: "Invoice Details",
        permission: "Invoice Details",
        href: "/dashboard/orders/invoice-details",
      },
    ],
  },
  {
    id: 15,
    tabs: [],
    icon: MdCorporateFare ,
    label: "Manage Ledger",
    href: "/dashboard/ledger",
    pageTitle: "Manage Ledger",
    permission: "Manage Ledger",
  },
  {
    id: 18,
    tabs: [],
    icon: MdNotificationImportant,
    label: "Manage Notifications",
    href: "/dashboard/notifications",
    pageTitle: "Manage Notifications",
    permission: "Manage Notifications",
  },
  {
    id: 3,
    tabs: [],
    icon: MdManageAccounts,
    label: "Role Management",
    href: "/dashboard/role-management",
    pageTitle: "Role Management",
    permission: "Role Management",
  },
  {
    id: 4,
    icon: RiAdminFill,
    label: "Manage Employee",
    href: "/dashboard/admin",
    pageTitle: "All Employees",
    permission: "Manage Employee",
  },
  {
    id: 5,
    icon: SiGoogleadmob,
    label: "Manage Leads",
    pageTitle: "All Leads",
    href: "/dashboard/leads",
    permission: "Manage Leads",
  },
  {
    id: 6,
    href: "",
    icon: FaProductHunt,
    label: "Manage Products",
    pageTitle: "All Products",
    permission: "Manage Products",
    tabs: [
      {
        id: 1,
        icon: BiSolidCategory,
        label: "Product Category",
        pageTitle: "All Category",
        permission: "Product Category",
        href: "/dashboard/product/category",
      },
      {
        id: 2,
        icon: TbBrandBebo,
        label: "Product Brand",
        pageTitle: "All Brand",
        href: "/dashboard/product/brand",
        permission: "Product Brand",
      },
      {
        id: 3,
        icon: TbRulerMeasure2,
        label: "Product UOM",
        pageTitle: "All UOM",
        href: "/dashboard/product/uom",
        permission: "Product UOM",
      },
      {
        id: 4,
        icon: FaProductHunt,
        label: "Manage Products",
        pageTitle: "All Category",
        permission: "Manage Products",
        href: "/dashboard/product",
      },
      {
        id: 5,
        icon: FaBarcode,
        label: "Download Barcode",
        pageTitle: "Download Barcode",
        permission: "Manage Products",
        href: "/dashboard/product/barcode",
      },
    ],
  },
  {
    id: 7,
    icon: BsChatQuoteFill,
    label: "Manage Quotations",
    pageTitle: "All Quotations",
    href: "/dashboard/quotation",
    permission: "Manage Quotations",
  },
  {
    id: 8,
    href: "",
    icon: FaWarehouse,
    label: "Manage Warehouse",
    pageTitle: "All Warehouse",
    permission: "Manage Warehouse",
    tabs: [
      {
        id: 3,
        icon: FaWarehouse,
        label: "Manage Inventory",
        permission: "Manage Packing",
        pageTitle: "Manage Inventory",
        href: "/dashboard/warehouse",
      },
      {
        id: 1,
        icon: GiBoxUnpacking,
        label: "Manage Packing",
        pageTitle: "All Packing",
        permission: "Manage Packing",
        href: "/dashboard/warehouse/packing",
      },
      {
        id: 2,
        icon: TbTransferIn,
        label: "Transfer Material",
        permission: "Manage Packing",
        pageTitle: "Transfer Material",
        href: "/dashboard/warehouse/transfer-material",
      },
    ],
  },
  {
    id: 9,
    icon: BiSolidPurchaseTagAlt,
    label: "Manage Purchase",
    pageTitle: "All Purchase",
    href: "/dashboard/purchase",
    permission: "Manage Purchase",
  },
  {
    id: 10,
    icon: FaMoneyBillTransfer,
    label: "Manage Billing",
    pageTitle: "All Billing",
    href: "/dashboard/billing",
    permission: "Manage Billing",
  },
  {
    id: 11,
    icon: RiSecurePaymentFill,
    label: "Manage Payment",
    pageTitle: "All Payment",
    href: "/dashboard/payment",
    permission: "Manage Payment",
  },
];
