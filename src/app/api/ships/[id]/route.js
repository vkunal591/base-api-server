// import { NextResponse } from 'next/server';
// import { dbConnect } from '@/app/lib/config/db';
// import Ship from '@/app/lib/models/ShipModel';

// Fetch a single ship by ID (GET)
import { NextResponse } from 'next/server';
import { dbConnect } from '@/app/lib/config/db';
import Ship from '@/app/lib/models/ShipModel';
import mongoose from 'mongoose';

export async function GET(req, context) {
  await dbConnect();

  const { params } = context;
  const id = params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid Ship ID" }, { status: 400 });
  }

  try {
    const ship = await Ship.findById(id).lean();

    if (!ship) {
      return NextResponse.json({ message: "Ship not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        result: ship,
      },
    });
  } catch (error) {
    console.error("Error fetching ship:", error);
    return NextResponse.json(
      { message: "Error fetching ship", error: error.message },
      { status: 500 }
    );
  }
}



// Update a ship by ID (PUT)
export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params; // ✅ Correct way to get ID
  const data = await req.json();

  if (!id || id.length !== 24) {
    return NextResponse.json({ message: "Invalid Ship ID" }, { status: 400 });
  }

  try {
    const updatedShip = await Ship.findByIdAndUpdate(id, data, { new: true });

    if (!updatedShip) {
      return NextResponse.json({ message: "Ship not found" }, { status: 404 });
    }
    return NextResponse.json({data:updatedShip,message:"Update Successfully",success:true});
  } catch (error) {
    console.error("Error updating ship:", error);
    return NextResponse.json({ message: "Error updating ship entry" }, { status: 500 });
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
