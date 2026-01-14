const operations = {
  read: true, // to get data using ID
  create: true, // to create a new instance
  update: true, // to update existing instance
  delete: true, // to delete existing instance
  viewStock: false, // to view the stock associated
};

export const endpoints: Record<
  string,
  {
    create: string;
    read: string;
    update: string;
    delete: string;
    fetchAll: string;
    operations?: any;
  }
> = {
  Brand: {
    create: "api/brand", // to create a brand
    delete: "api/brand/", // to delete a brand
    update: "api/brand/", // to update a brand
    read: "api/brand/", // to get a brand
    fetchAll: "api/brand", // to fetch all brands
    operations: operations,
  },
  Invoice: {
    create: "api/invoice", // to create a product
    read: "api/invoice/", // to get a product
    update: `api/invoice/`, // to update a product
    delete: "api/invoice/", // to delete a product
    fetchAll: "api/invoice/", // to fetch all products
    operations: operations,
  },
  Notifications: {
    create: "api/invoice", // to create a product
    read: "api/invoice/", // to get a product
    update: `api/invoice/`, // to update a product
    delete: "api/invoice/", // to delete a product
    fetchAll: "api/invoice", // to fetch all products
    operations: operations,
  },
  Category: {
    create: "api/product-category", // to create a product-category
    delete: "api/product-category/", // to delete a product-category
    update: "api/product-category/", // to update a product-category
    read: "api/product-category/", // to get a product-category
    fetchAll: "api/product-category", // to fetch all product-categorys
    operations: operations,
  },
  Employee: {
    create: "api/user", // to create a user
    delete: "api/user/", // to delete a user
    update: "api/user/", // to update a user
    read: "api/user/", // to get a user
    fetchAll: "api/user", // to fetch all Users
    operations: operations,
  },
  UOM: {
    create: "api/product-uom", // to create a product-uom
    delete: "api/product-uom/", // to delete a product-uom
    update: "api/product-uom/", // to update a product-uom
    read: "api/product-uom/", // to get a product-uom
    fetchAll: "api/product-uom", // to fetch all product-uoms
    operations: operations,
  },
  Role: {
    create: "api/role", // to create a role
    read: "api/role/", // to get a role
    update: `api/role/`, // to update a role
    delete: "api/role/", // to delete a role
    fetchAll: "api/role", // to fetch all roles
    operations: operations,
  },
  Ledger: {
    create: "api/ledger", // to create a party
    delete: "api/ledger/", // to delete a party
    update: "api/ledger/", // to update a party
    read: "api/ledger/", // to get a party
    fetchAll: "api/ledger", // to fetch all partys
    operations: operations,
  },
  Ships: {
    create: "api/ships", // to create a party
    delete: "api/ships/", // to delete a party
    update: "api/ships/", // to update a party
    read: "api/ships/", // to get a party
    fetchAll: "api/ships", // to fetch all partys
    operations: operations,
  },
  Yards: {
    create: "api/ships", // to create a party
    delete: "api/ships/", // to delete a party
    update: "api/ships/", // to update a party
    read: "api/ships/", // to get a party
    fetchAll: "api/ships", // to fetch all partys
    operations: operations,
  },
  Lead: {
    create: "api/lead", // to create a lead
    read: "api/lead/", // to get a lead
    update: `api/lead/`, // to update a lead
    delete: "api/lead/", // to delete a lead
    fetchAll: "api/lead", // to fetch all leads
    operations: operations,
  },
  Quotation: {
    create: "api/quotation", // to create a quotation
    read: "api/quotation/", // to get a quotation
    update: `api/quotation/`, // to update a quotation
    delete: "api/quotation/", // to delete a quotation
    fetchAll: "api/quotation", // to fetch all quotations
    operations: operations,
  },
  Product: {
    create: "api/product", // to create a product
    read: "api/product/", // to get a product
    update: `api/product/`, // to update a product
    delete: "api/product/", // to delete a product
    fetchAll: "api/product", // to fetch all products
    operations: { ...operations, viewStock: true },
  },
  Packing: {
    create: "api/packing", // to create a product
    read: "api/packing/", // to get a product
    update: `api/packing/`, // to update a product
    delete: "api/packing/", // to delete a product
    fetchAll: "api/packing/", // to fetch all products
    operations: operations,
  },
  Purchase: {
    create: "api/purchase", // to create a product
    read: "api/purchase/", // to get a product
    update: `api/purchase/`, // to update a product
    delete: "api/purchase/", // to delete a product
    fetchAll: "api/purchase/", // to fetch all products
    operations: operations,
  },
  Payment: {
    create: "api/transaction", // to create a product
    read: "api/transaction/", // to get a product
    update: `api/transaction/`, // to update a product
    delete: "api/transaction/", // to delete a product
    fetchAll: "api/transaction/", // to fetch all products
    operations: operations,
  },
  StockTransfer: {
    create: "api/item-transfer", // to create a product
    read: "api/item-transfer/", // to get a product
    update: `api/item-transfer/`, // to update a product
    delete: "api/item-transfer/", // to delete a product
    fetchAll: "api/item-transfer/", // to fetch all products
    operations: operations,
  },
  Warehouse: {
    create: "api/warehouse", // to create a product
    read: "api/warehouse/", // to get a product
    update: `api/warehouse/`, // to update a product
    delete: "api/warehouse/", // to delete a product
    fetchAll: "api/warehouse/", // to fetch all products
    operations: { ...operations, viewStock: true },
  },
};

export const DashboardEndpoint = {
  fetchSale: "admin/transactions/total-sales-duration", // to fetch all duration
  fetchGraphSale: "admin/dashboard/overview-revenue", // to fetch all graph
  fetchGraphSessions: "admin/dashboard/overview-sessions", // to fetch all graph
  fetchSaleByMonthYear: "admin/dashboard/line-chart", // to fetch all line charts
};
