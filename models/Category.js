import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: {
        en: {type: String, require: true, trim: true },
        ar: {type: String, require: true, trim: true }
    },
    description: {
        en: { type: String, trim: true },
        ar: { type: String, trim: true }
    }
});

const Category = mongoose.model('Category', CategorySchema);

export default Category ;