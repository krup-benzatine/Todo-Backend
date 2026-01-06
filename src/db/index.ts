import mongoose from "mongoose";

export const DBconnection = async () => {
  const uri = "mongodb+srv://Krup:Krup%40%40%40krup@krupcluster.qpf0eyq.mongodb.net/?retryWrites=true&w=majority";

  try {
    await mongoose.connect(uri);
    console.log("DB chal raha he");
  } catch (error) {
    console.log("DB me problem hai", error);
  }
};
