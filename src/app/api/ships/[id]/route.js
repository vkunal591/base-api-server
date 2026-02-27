// import { NextResponse } from 'next/server';
// import { dbConnect } from '@/app/lib/config/db';
// import Ship from '@/app/lib/models/ShipModel';

// Fetch a single ship by ID (GET)
import { NextResponse } from 'next/server';
import { dbConnect } from '@/app/lib/config/db';
import Ship from '@/app/lib/models/ShipModel';
import mongoose from 'mongoose';


const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ========================
// GET - Fetch Single Ship
// ========================
export async function GET(request, { params }) {
  await dbConnect();

  const value = params.id;

  try {
    let ship;

    if (isValidObjectId(value)) {
      // Search by MongoDB _id
      ship = await Ship.findById(value).lean();
    } else {
      // Search by invoiceNumber OR vesselImoNo
      ship = await Ship.findOne({
        $or: [
          { invoiceNumber: value },
          { vesselImoNo: value }
        ]
      }).lean();
    }

    if (!ship) {
      return NextResponse.json(
        { message: 'Ship not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
    data: {
        result: ship,
      },
        });

  } catch (error) {
    console.error('Error fetching ship:', error);

    return NextResponse.json(
      { message: 'Error fetching ship', error: error.message },
      { status: 500 }
    );
  }
}


// ========================
// PUT - Update Ship
// ========================
export async function PUT(req, { params }) {
  await dbConnect();

  const value = params.id;
  const data = await req.json();

  try {
    let updatedShip;

    if (isValidObjectId(value)) {
      // Update by _id
      updatedShip = await Ship.findByIdAndUpdate(
        value,
        data,
        { new: true }
      );
    } else {
      // Update by invoiceNumber OR vesselImoNo
      updatedShip = await Ship.findOneAndUpdate(
        {
          $or: [
            { invoiceNumber: value },
            { vesselImoNo: value }
          ]
        },
        data,
        { new: true }
      );
    }

    if (!updatedShip) {
      return NextResponse.json(
        { message: "Ship not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: updatedShip,
      message: "Update Successfully",
      success: true
    });

  } catch (error) {
    console.error("Error updating ship:", error);

    return NextResponse.json(
      { message: "Error updating ship entry" },
      { status: 500 }
    );
  }
}
// Delete a ship by ID (DELETE)
export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params; // ✅ Correct way to get ID

  if (!id || id.length !== 24) {
    return NextResponse.json({ message: "Invalid Ship ID" }, { status: 400 });
  }

  try {
    const deletedShip = await Ship.findByIdAndDelete(id);
    if (!deletedShip) {
      return NextResponse.json({ message: "Ship not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Ship deleted successfully" ,success:true});
  } catch (error) {
    console.error("Error deleting ship:", error);
    return NextResponse.json({ message: "Error deleting ship entry" }, { status: 500 });
  }
}
