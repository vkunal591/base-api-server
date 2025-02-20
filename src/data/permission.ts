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
    module: "Manage Ships",
    access: {
      read: true,
      create: true,
      update: true,
      delete: true,
      invoice:true,
    },
  },
  {
    module: "Manage Billing",
    access: {
      read: true,
      create: true,
      update: true,
      delete: true,
      view:true,
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
