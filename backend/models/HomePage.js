
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  title: { type: String, default: "" },
  category: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  image: { type: String, default: "" },
  cloudinaryPublicId: { type: String, default: "" },
  count: { type: String, default: "" }
}, { _id: true });

const homePageSchema = new mongoose.Schema({
  hero: {
    badge: { type: String, default: "Handmade with Love & Artisanal Botanicals" },
    heading: { type: String, default: "A Little Card," },
    headingAccent: { type: String, default: "A Lot of Love." },
    description: { type: String, default: "Beautiful handmade cards, thoughtfully designed to make your special moments unforgettable. Personalize every word, background, and delicate dried petal decoration." },
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    featuredTitle: { type: String, default: "Artisanal Lavender Suite" },
    featuredDescription: { type: String, default: "With silk ribbons & dried flora" },
    buttonText: { type: String, default: "Explore Our Cards" },
    trustOneTitle: { type: String, default: "100%" },
    trustOneText: { type: String, default: "Real Dried Botanicals" },
    trustTwoTitle: { type: String, default: "350 GSM" },
    trustTwoText: { type: String, default: "Cotton Rag Paper" },
    trustThreeTitle: { type: String, default: "Free COD" },
    trustThreeText: { type: String, default: "Orders Over PKR 3,000" }
  },
  categoriesHeading: { type: String, default: "Cards for Every Cherished Occasion" },
  categoriesSubtitle: { type: String, default: "Browse our specially curated categories, designed with delicate dried florals and deckled paper." },
  categories: { type: [categorySchema], default: [] }
}, { timestamps: true });

export default mongoose.models.HomePage ||
  mongoose.model("HomePage", homePageSchema);
