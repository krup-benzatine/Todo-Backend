import mongoose from "mongoose";

export const DBconnection = async () => {
  const uri = process.env.DB_URI;
  if (!uri) {
    console.error("DB_URI is not defined");
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log("DB chal raha he");
  } catch (error) {
    console.log("DB me problem hai", error);
  }
};
