// import mongoose from "mongoose";

// export const dbConnect = async () => {
//    await mongoose.connect('mongodb+srv://vkunal591:vkunal591@cluster0.huymi.mongodb.net/sud?retryWrites=true&w=majority&appName=Cluster0')
//     .then(() => console.log("DB connected"))
//     .catch(err => console.error("DB connection error", err));


// }




import mongoose from 'mongoose';

const db = async () => {
  if (mongoose.connections[0].readyState) {
    console.log("Already connected to DB");
    return;
  }

  try {
    // await mongoose.connect('mongodb+srv://vkunal591:vkunal591@cluster0.huymi.mongodb.net/sud?retryWrites=true&w=majority&appName=Cluster0');
    await mongoose.connect('mongodb://localhost:27017/sud');
    console.log("DB connected");
  } catch (err) {
    console.error("DB connection error", err);
    throw new Error("Failed to connect to DB");
  }
};

export async function dbConnect(req, res) {
  try {
    await db();
    // res.status(200).json({ message: "Connected to DB" });
    console.log({message:"DB Connected"})
  } catch (err) {
    // res.status(500).json({ error: "DB connection failed" });
    console.log(err)
  }
}
