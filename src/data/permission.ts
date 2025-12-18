export const userPermissions = [
  {
    module: "Dashboard",
    access: {
      read: true,
      create: true,
      update: true,
      delete: true,
    },
  },
  {
    module: "Manage Ledger",
    access: {
      read: true,
      create: true,
      update: true,
      delete: true,
    },
  },
  {
    module: "Manage Notifications",
    access: {
      read: true,
      delete: true,
      custome: true,
      print: true,
      updateStatus: true,
    },
  },
  {
    module: "Manage Ships",
    access: {
      read: true,
      update: true,
      create: true,
      invoice: true,
      delete: true,
      upload: true
    },
  },
  {
    module: "Manage Yards",
    access: {
      read: true,
      update: true,
      create: true,
      invoice: true,
      delete: true,
    },
  },
  {
    module: "Manage Billing",
    access: {
      read: true,
      // update: true,
      delete: true,
      view: true,
      updateStatus: true,
      print: true,
      updateInvoice: true,
    },
  },
  {
    module: "Manage Orders",
    access: {
      read: true,
      create: true,
      update: true,
      delete: true,
    },
  },
];
