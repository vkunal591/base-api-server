// import { NextResponse } from 'next/server';
// import { dbConnect } from '@/app/lib/config/db';
// import Ship from '@/app/lib/models/ShipModel';

// // Fetch list of ships with filters (GET)
// export async function GET(req) {
//   await dbConnect();

//   const { searchParams } = new URL(req.url);
//   const page = parseInt(searchParams.get("page")) || 1;
//   const limit = parseInt(searchParams.get("limit")) || 10;
//   const search = searchParams.get("search") || "";
//   const skip = (page - 1) * limit;

//   const matchConditions = {};

//   if (search) {
//     matchConditions.$or = [
//       { vesselImoNo: { $regex: search, $options: "i" } },
//       { companyName: { $regex: search, $options: "i" } }
//     ];
//   }

//   try {
//     const totalShips = await Ship.countDocuments(matchConditions);

//     const ships = await Ship.aggregate([
//       { $match: matchConditions },
//       {
//         $addFields: {
//           isDepartureMissing: {
//             $or: [
//               { $eq: ["$departure", null] },
//               { $eq: ["$departure", ""] },
//               { $not: [{ $ifNull: ["$departure", false] }] }
//             ]
//           },
//           parsedDeparture: {
//             $cond: [
//               { $and: [
//                 { $ne: ["$departure", null] },
//                 { $ne: ["$departure", ""] }
//               ]},
//               { $toDate: "$departure" },
//               null
//             ]
//           }
//         }
//       },
//       {
//         $sort: {
//           isDepartureMissing: -1, // true (missing) = 1 → comes first
//           parsedDeparture: 1       // then sort by actual departure date
//         }
//       },
//       { $skip: skip },
//       { $limit: limit }
//     ]);

//     const resultWithIndex = ships.map((ship, index) => ({
//       serialNo: skip + index + 1,
//       ...ship
//     }));

//     return NextResponse.json({
//       data: {
//         result: resultWithIndex,
//         pagination: {
//           currentPage: page,
//           totalPages: Math.ceil(totalShips / limit),
//           itemsPerPage: limit,
//           totalItems: totalShips
//         }
//       },
//       success: true
//     });
//   } catch (error) {
//     console.error("Error fetching ships:", error);
//     return NextResponse.json(
//       { message: "Error fetching ships" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req) {
//   await dbConnect();

//   const data = await req.json();

//   const parseDate = (dateStr) => {
//     if (!dateStr) return null;
//     const parsedDate = new Date(dateStr);
//     return isNaN(parsedDate.getTime()) ? null : parsedDate;
//   };

//   // Helper to parse numbers safely
//   const parseNumber = (numStr) => {
//     if (numStr === undefined || numStr === null || numStr === '') return undefined;
//     const n = parseFloat(numStr);
//     return isNaN(n) ? undefined : n;
//   };

//   // Parse main numeric fields safely
//   data.sudInvoiceToOwners = parseNumber(data.sudInvoiceToOwners);
//   data.actualPayment = parseNumber(data.actualPayment);
//   data.bankCharges = parseNumber(data.bankCharges);
//   data.yardInvoiceToSUD = parseNumber(data.yardInvoiceToSUD);
//   data.creditDays = data.creditDays ? parseInt(data.creditDays, 10) : undefined;
//   data.creditLimit = parseNumber(data.creditLimit);

//   // Parse dates
//   data.actualPaymentDate = parseDate(data.actualPaymentDate);
//   data.dueDate = parseDate(data.dueDate);
//   data.yardActualPaymentDate = parseDate(data.yardActualPaymentDate);
//   data.yardPaymentDueDate = parseDate(data.yardPaymentDueDate);

//   // Process vendorDetails array
//   if (Array.isArray(data.vendorDetails)) {
//     data.vendorDetails = data.vendorDetails.map((vendor) => ({
//       vendorInvoiceToSUD: parseNumber(vendor.vendorInvoiceToSUD),
//       vendorActualPaymentDate: parseDate(vendor.vendorActualPaymentDate),
//       vendorPaymentDueDate: vendor.vendorPaymentDueDate,    
//     }));
//   }

//   try {
//     console.log("Sanitized data:", data);
//     const newShip = await Ship.create(data);
//     return NextResponse.json({ newShip, success: true }, { status: 201 });
//   } catch (error) {
//     console.error("Error creating ship entry:", error);
//     return NextResponse.json({ message: "Error creating ship entry" }, { status: 500 });
//   }
// }






import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/config/db";
import Ship from "@/app/lib/models/ShipModel";



const excelDateToJSDate = (value) => {
  if (!value) return null;

  // Excel numeric date
  if (typeof value === "number") {
    return new Date((value - 25569) * 86400000);
  }

  // String date
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};

const parseNumber = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  return isNaN(n) ? undefined : n;
};


export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const skip = (page - 1) * limit;

  const matchConditions = {};

  if (search) {
    matchConditions.$or = [
      { vesselImoNo: { $regex: search, $options: "i" } },
      { companyName: { $regex: search, $options: "i" } },
    ];
  }

  try {
    const totalShips = await Ship.countDocuments(matchConditions);

    const ships = await Ship.aggregate([
      { $match: matchConditions },

      {
        $addFields: {
          isDepartureMissing: {
            $or: [
              { $eq: ["$departure", null] },
              { $eq: ["$departure", ""] },
            ],
          },

          parsedDeparture: {
            $cond: [
              { $or: [{ $eq: ["$departure", null] }, { $eq: ["$departure", ""] }] },
              null,
              {
                $cond: [
                  { $isNumber: "$departure" },
                  {
                    $toDate: {
                      $multiply: [
                        { $subtract: ["$departure", 25569] },
                        86400000,
                      ],
                    },
                  },
                  {
                    $convert: {
                      input: "$departure",
                      to: "date",
                      onError: null,
                      onNull: null,
                    },
                  },
                ],
              },
            ],
          },
        },
      },

      {
        $sort: {
          isDepartureMissing: -1,
          parsedDeparture: 1,
        },
      },

      { $skip: skip },
      { $limit: limit },
    ]);

    const resultWithIndex = ships.map((ship, index) => ({
      serialNo: skip + index + 1,
      ...ship,
    }));

    return NextResponse.json({
      success: true,
      data: {
        result: resultWithIndex,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalShips / limit),
          itemsPerPage: limit,
          totalItems: totalShips,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching ships:", error);
    return NextResponse.json(
      { message: "Error fetching ships" },
      { status: 500 }
    );
  }
}



export async function POST(req) {
  await dbConnect();

  try {
    const data = await req.json();

    // Numbers
    data.sudInvoiceToOwners = parseNumber(data.sudInvoiceToOwners);
    data.actualPayment = parseNumber(data.actualPayment);
    data.bankCharges = parseNumber(data.bankCharges);
    data.yardInvoiceToSUD = parseNumber(data.yardInvoiceToSUD);
    data.creditDays = data.creditDays
      ? parseInt(data.creditDays, 10)
      : undefined;
    data.creditLimit = parseNumber(data.creditLimit);

    // Dates (Excel OR Form)
    data.arrival = excelDateToJSDate(data.arrival);
    data.departure = excelDateToJSDate(data.departure);
    data.actualPaymentDate = excelDateToJSDate(data.actualPaymentDate);
    data.dueDate = excelDateToJSDate(data.dueDate);
    data.yardActualPaymentDate = excelDateToJSDate(
      data.yardActualPaymentDate
    );
    data.yardPaymentDueDate = excelDateToJSDate(
      data.yardPaymentDueDate
    );

    // Vendor details
    if (Array.isArray(data.vendorDetails)) {
      data.vendorDetails = data.vendorDetails.map((vendor) => ({
        vendorInvoiceToSUD: parseNumber(vendor.vendorInvoiceToSUD),
        vendorActualPaymentDate: excelDateToJSDate(
          vendor.vendorActualPaymentDate
        ),
        vendorPaymentDueDate: excelDateToJSDate(
          vendor.vendorPaymentDueDate
        ),
      }));
    }

    const newShip = await Ship.create(data);

    return NextResponse.json(
      { success: true, newShip },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating ship:", error);
    return NextResponse.json(
      { message: "Error creating ship entry" },
      { status: 500 }
    );
  }
}
