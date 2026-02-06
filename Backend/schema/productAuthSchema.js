import mongoose from "mongoose";

const auth = new mongoose .Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
})
const productAuth = mongoose.model("productAuth", auth);
export default productAuth;