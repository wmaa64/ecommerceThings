import mongoose from "mongoose";

const SubcategorySchema = new mongoose.Schema({
    name: {
        en: {type: String, required: true },
        ar: {type: String, required: true }
    },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
    description: {
        en: { type: String },
        ar: { type: String }
    }
});


const Subcategory = mongoose.models.Subcategory || mongoose.model('Subcategory', SubcategorySchema);

export default Subcategory ;