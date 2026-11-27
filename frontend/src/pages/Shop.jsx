
import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { CATEGORIES } from "../data/cardsData.js";

import {
  Search,
  RotateCcw,
  SlidersHorizontal,
  Sparkles
} from "lucide-react";

export default function Shop() {
  const { products } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // ========================================
  // ACTIVE THEME COLORS
  // ========================================

  const theme = {
    primary: "var(--theme-primary, #7041A6)",
    accent: "var(--theme-accent, #9B72CF)",
    background: "var(--theme-background, #FAF7FD)",
    surface: "var(--theme-card, #FFFFFF)",
    text: "var(--theme-text, #40334F)",
    muted: "var(--theme-muted, #81758F)",
    border: "var(--theme-border, #E9DDF7)",
    input: "var(--theme-input, #FAF7FD)"
  };

  const themeSoft = `color-mix(in srgb, ${theme.primary} 10%, ${theme.surface})`;
  const themeMedium = `color-mix(in srgb, ${theme.primary} 18%, ${theme.surface})`;
  const themeBorder = `color-mix(in srgb, ${theme.primary} 30%, ${theme.surface})`;

  // ========================================
  // FILTER STATES
  // ========================================

  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [maxPrice, setMaxPrice] = useState(1500);
  const [sortBy, setSortBy] = useState("featured");
  const [inStockOnly, setInStockOnly] = useState(false);

  // ========================================
  // SYNC URL PARAMETERS
  // ========================================

  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    if (category) setSelectedCategory(category);
    if (search) setSearchQuery(search);
  }, [searchParams]);

  // ========================================
  // FILTER AND SORT PRODUCTS
  // ========================================

  const filteredProducts = useMemo(() => {
    return products
      .filter((card) => {
        if (
          selectedCategory !== "All" &&
          card.category !== selectedCategory
        ) {
          return false;
        }

        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();

          const matchesName = card.name.toLowerCase().includes(query);
          const matchesDesc = card.description.toLowerCase().includes(query);
          const matchesCategory = card.category.toLowerCase().includes(query);

          if (!matchesName && !matchesDesc && !matchesCategory) {
            return false;
          }
        }

        const price = card.discountPrice || card.price;

        if (price > maxPrice) return false;

        if (inStockOnly && card.stock <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;

        if (sortBy === "price-low") return priceA - priceB;
        if (sortBy === "price-high") return priceB - priceA;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "newest") {
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        }

        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [
    products,
    selectedCategory,
    searchQuery,
    maxPrice,
    sortBy,
    inStockOnly
  ]);

  // ========================================
  // CLEAR FILTERS
  // ========================================

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setMaxPrice(1500);
    setSortBy("featured");
    setInStockOnly(false);
    setSearchParams({});
  };

  // ========================================
  // COMPONENT UI
  // ========================================

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
      style={{ color: theme.text }}
    >

      {/* =====================================
          HEADER BANNER
      ===================================== */}

      <section
        className="rounded-3xl p-8 sm:p-10 border flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300"
        style={{
          background: `linear-gradient(120deg, ${themeSoft}, ${themeMedium})`,
          borderColor: themeBorder
        }}
      >
        <div className="space-y-3">

          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
            style={{
              backgroundColor: theme.surface,
              color: theme.primary
            }}
          >
            <Sparkles
              className="w-3.5 h-3.5"
              style={{ color: theme.accent }}
            />

            Handmade Card Boutique
          </div>

          <h1
            className="font-serif text-3xl sm:text-4xl font-bold"
            style={{ color: theme.text }}
          >
            Shop Handcrafted Cards
          </h1>

          <p
            className="text-sm max-w-xl leading-6"
            style={{ color: theme.muted }}
          >
            Explore authentic cotton rag stationery, real dried botanical
            accents, and bespoke greeting cards for all occasions.
          </p>

        </div>

        <div className="text-right">

          <p
            className="text-3xl font-serif font-bold tabular-nums"
            style={{ color: theme.primary }}
          >
            {filteredProducts.length}
          </p>

          <p
            className="text-xs"
            style={{ color: theme.muted }}
          >
            Artisanal Cards Available
          </p>

        </div>
      </section>

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* FILTER SIDEBAR */}

        <aside className="lg:col-span-1 space-y-6">

          <div
            className="rounded-3xl p-6 border shadow-sm space-y-6"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border
            }}
          >

            {/* SEARCH */}

            <div>

              <label
                className="text-xs font-semibold uppercase tracking-wider block mb-2"
                style={{ color: theme.primary }}
              >
                Search Catalog
              </label>

              <div className="relative">

                <Search
                  className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: theme.muted }}
                />

                <input
                  type="text"
                  placeholder="e.g. Lavender, Wedding..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none focus:ring-2 transition"
                  style={{
                    backgroundColor: theme.input,
                    borderColor: theme.border,
                    color: theme.text,
                    "--tw-ring-color": theme.accent
                  }}
                />

              </div>

            </div>

            {/* CATEGORIES */}

            <div>

              <label
                className="text-xs font-semibold uppercase tracking-wider block mb-2"
                style={{ color: theme.primary }}
              >
                Occasions
              </label>

              <div className="space-y-1">

                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 flex items-center justify-between"
                    style={
                      selectedCategory === category
                        ? {
                            backgroundColor: theme.primary,
                            color: "#ffffff",
                            boxShadow: `0 4px 12px color-mix(in srgb, ${theme.primary} 25%, transparent)`
                          }
                        : {
                            backgroundColor: "transparent",
                            color: theme.text
                          }
                    }
                    onMouseEnter={(e) => {
                      if (selectedCategory !== category) {
                        e.currentTarget.style.backgroundColor = themeSoft;
                        e.currentTarget.style.color = theme.primary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCategory !== category) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = theme.text;
                      }
                    }}
                  >

                    <span>{category}</span>

                    {category === "All" && (
                      <span className="opacity-75 text-[10px]">
                        {products.length}
                      </span>
                    )}

                  </button>
                ))}

              </div>

            </div>

            {/* PRICE SLIDER */}

            <div>

              <div className="flex justify-between items-center mb-3">

                <label
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: theme.primary }}
                >
                  Max Price
                </label>

                <span
                  className="text-xs font-bold tabular-nums"
                  style={{ color: theme.primary }}
                >
                  PKR {maxPrice.toLocaleString()}
                </span>

              </div>

              <input
                type="range"
                min="500"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full cursor-pointer"
                style={{
                  accentColor: theme.primary
                }}
              />

              <div
                className="flex justify-between text-[10px] mt-1"
                style={{ color: theme.muted }}
              >
                <span>PKR 500</span>
                <span>PKR 2,000</span>
              </div>

            </div>

            {/* STOCK CHECKBOX */}

            <div
              className="pt-3 border-t"
              style={{ borderColor: theme.border }}
            >

              <label
                className="flex items-center gap-2 cursor-pointer text-xs font-medium"
                style={{ color: theme.text }}
              >

                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded cursor-pointer"
                  style={{ accentColor: theme.primary }}
                />

                <span>In Stock Cards Only</span>

              </label>

            </div>

            {/* RESET FILTERS */}

            <button
              type="button"
              onClick={handleClearFilters}
              className="w-full py-2 px-3 border text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-md"
              style={{
                borderColor: themeBorder,
                color: theme.primary,
                backgroundColor: "transparent"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = themeSoft;
                e.currentTarget.style.boxShadow =
                  `0 5px 15px color-mix(in srgb, ${theme.primary} 20%, transparent)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.boxShadow = "none";
              }}
            >

              <RotateCcw className="w-3.5 h-3.5" />

              Reset All Filters

            </button>

          </div>

        </aside>

        {/* =====================================
            PRODUCTS AREA
        ===================================== */}

        <main className="lg:col-span-3 space-y-6">

          {/* SORT BAR */}

          <div
            className="rounded-2xl px-5 py-3 border flex flex-wrap items-center justify-between gap-4"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border
            }}
          >

            <span
              className="text-xs"
              style={{ color: theme.muted }}
            >
              Showing{" "}
              <strong style={{ color: theme.text }}>
                {filteredProducts.length}
              </strong>{" "}
              creations
            </span>

            <div className="flex items-center gap-2">

              <SlidersHorizontal
                className="w-4 h-4"
                style={{ color: theme.primary }}
              />

              <label
                htmlFor="sortSelect"
                className="text-xs"
                style={{ color: theme.muted }}
              >
                Sort by:
              </label>

              <select
                id="sortSelect"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border text-xs rounded-xl px-2.5 py-2 outline-none focus:ring-2"
                style={{
                  backgroundColor: theme.input,
                  borderColor: theme.border,
                  color: theme.text,
                  "--tw-ring-color": theme.accent
                }}
              >

                <option value="featured">Featured / Bestsellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Arrivals</option>

              </select>

            </div>

          </div>

          {/* PRODUCT GRID */}

          {filteredProducts.length > 0 ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {filteredProducts.map((card) => (
                <ProductCard
                  key={card.id}
                  card={card}
                />
              ))}

            </div>

          ) : (

            /* EMPTY STATE */

            <div
              className="rounded-3xl p-12 text-center border space-y-4"
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border
              }}
            >

              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl"
                style={{
                  backgroundColor: themeSoft,
                  color: theme.primary
                }}
              >
                🌸
              </div>

              <h3
                className="font-serif text-xl font-bold"
                style={{ color: theme.text }}
              >
                No handmade cards match your criteria
              </h3>

              <p
                className="text-xs max-w-sm mx-auto"
                style={{ color: theme.muted }}
              >
                Try widening your price range, clearing search terms,
                or explore another occasion.
              </p>

              <button
                type="button"
                onClick={handleClearFilters}
                className="px-5 py-2.5 text-white text-xs font-semibold rounded-xl transition hover:opacity-90"
                style={{ backgroundColor: theme.primary }}
              >
                Clear Filters
              </button>

            </div>

          )}

        </main>

      </div>

    </div>
  );
}
