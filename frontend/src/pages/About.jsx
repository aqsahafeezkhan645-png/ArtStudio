
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Feather,
  Palette,
  Smile,
  ArrowRight
} from "lucide-react";

const API = "https://art-studio-l9mr.vercel.app/api/site-content";

const DEFAULT_ABOUT = {
  storyEyebrow: "Our Humble Beginning",
  storyTitle: "From Pressed Petals on a Kitchen Table to Heirloom Keepsakes",
  storyParagraph1:
    "ArtStudio started with a simple belief: in a fast digital world of generic text messages, a physical, tactile card made from organic textured cotton paper carrying your own words holds immense warmth.",
  storyParagraph2:
    "Every card we produce starts with real dried botanicals—lavender buds, pressed pansies, and baby’s breath—hand-gathered and preserved in our studio. We bind every envelope with custom wax seals and lilac satin ribbons to ensure every recipient feels truly cherished.",
  storyImage:
    "/images/hero_handmade_cards_1794160681532.jpg",
  storyImageAlt: "ArtStudio paper crafting table",
  imageCaptionTitle: "350 GSM Handcrafted Cotton",
  imageCaptionText:
    "Deckled edges, cold-pressed texture, and archival ink that never fades.",
  primaryButtonText: "Design a Personal Card",
  primaryButtonLink: "/customize",
  secondaryButtonText: "Explore Catalog",
  secondaryButtonLink: "/shop",
  galleryEyebrow: "Craftsmanship Portfolio",
  galleryTitle: "Gallery of Handcrafted Card Suites",
  galleryImages: [
    {
      image: "/images/birthday_card_craft_1794160682865.jpg",
      alt: "Handmade birthday card craft"
    },
    {
      image: "/images/wedding_anniversary_card_1794160683110.jpg",
      alt: "Handmade wedding card craft"
    },
    {
      image: "/images/floral_gratitude_card_1794160684123.jpg",
      alt: "Handmade gratitude card craft"
    }
  ]
};

const DEFAULT_VALUES = [
  {
    icon: Feather,
    title: "Handcrafted Creativity",
    description:
      "We never mass-print on flimsy paper. Every card is assembled by hand, blending delicate botanical art with elegant handwritten calligraphy."
  },
  {
    icon: Palette,
    title: "Empowered Personalization",
    description:
      "Our interactive card studio allows you to compose your own poems, choose custom pastel colorways, and select hand-picked decorations."
  },
  {
    icon: Smile,
    title: "Cherished Moments",
    description:
      "Cards that are never thrown away. Our customers frame them, keep them in memory boxes, and treasure them for decades."
  }
];

function getImageUrl(item) {
  if (!item) return "";
  if (typeof item === "string") return item;
  return item.image || item.url || item.src || "";
}

export default function About() {
  const [about, setAbout] = useState(DEFAULT_ABOUT);

  // Load saved About page content
  useEffect(() => {
    let mounted = true;

    async function fetchAboutContent() {
      try {
        const response = await fetch(API);

        if (!response.ok) {
          throw new Error("Unable to load About Us content.");
        }

        const data = await response.json();
        const savedContent = data.content || data;
        const savedAbout = savedContent.about || {};

        if (mounted) {
          setAbout({
            ...DEFAULT_ABOUT,
            ...savedAbout,
            galleryImages: Array.from({ length: 3 }, (_, index) => {
              const savedImage = savedAbout.galleryImages?.[index];
              const defaultImage = DEFAULT_ABOUT.galleryImages[index];

              if (!savedImage) return defaultImage;

              if (typeof savedImage === "string") {
                return {
                  image: savedImage,
                  alt: defaultImage.alt
                };
              }

              return {
                ...defaultImage,
                ...savedImage,
                image: getImageUrl(savedImage) || defaultImage.image
              };
            })
          });
        }
      } catch (error) {
        console.error("About page content error:", error);
      }
    }

    fetchAboutContent();

    return () => {
      mounted = false;
    };
  }, []);

  // All colors come from the currently selected website theme
  const theme = {
    primary: "var(--theme-primary)",
    secondary: "var(--theme-secondary)",
    accent: "var(--theme-accent)",
    light: "var(--theme-light)",
    soft: "var(--theme-soft)",
    background: "var(--theme-background)",
    text: "var(--theme-text)",
    muted: "var(--theme-muted)",
    card: "var(--theme-card, #ffffff)"
  };

  const eyebrowStyle = {
    color: theme.primary
  };

  const headingStyle = {
    color: theme.secondary
  };

  const paragraphStyle = {
    color: theme.muted
  };

  const cardStyle = {
    backgroundColor: theme.card,
    borderColor: theme.light
  };

  const primaryButtonStyle = {
    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
    color: "#ffffff",
    boxShadow:
      "0 6px 18px color-mix(in srgb, var(--theme-primary) 25%, transparent)"
  };

  const secondaryButtonStyle = {
    backgroundColor: theme.card,
    borderColor: theme.light,
    color: theme.primary
  };

  return (
    <div
      className="space-y-16 pb-20 overflow-hidden transition-colors duration-300"
      style={{
        backgroundColor: theme.background,
        color: theme.text
      }}
    >
      <style>{`
        .about-theme-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease,
                      border-color 0.3s ease;
        }

        .about-theme-hover:hover {
          transform: translateY(-5px);
          border-color: var(--theme-primary);
          box-shadow: 0 14px 30px
            color-mix(in srgb, var(--theme-primary) 20%, transparent);
        }

        .about-theme-button {
          transition: transform 0.25s ease, box-shadow 0.25s ease,
                      filter 0.25s ease;
        }

        .about-theme-button:hover {
          transform: translateY(-2px);
          filter: brightness(1.06);
          box-shadow: 0 8px 22px
            color-mix(in srgb, var(--theme-primary) 30%, transparent);
        }

        .about-theme-image {
          transition: transform 0.5s ease;
        }

        .about-theme-image:hover {
          transform: scale(1.05);
        }
      `}</style>

      {/* HERO SECTION */}
      <section
        className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b text-center transition-colors duration-300"
        style={{
          background: `linear-gradient(110deg,
            color-mix(in srgb, ${theme.primary} 12%, ${theme.background}),
            color-mix(in srgb, ${theme.secondary} 13%, ${theme.background}))`,
          borderColor: theme.light
        }}
      >
        <div className="max-w-3xl mx-auto space-y-5">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold shadow-sm border"
            style={{
              backgroundColor: theme.card,
              color: theme.primary,
              borderColor: theme.light
            }}
          >
            <Heart
              className="w-4 h-4"
              style={{
                color: theme.primary,
                fill: theme.primary
              }}
            />
            <span>The ArtStudio Craft Story</span>
          </div>

          <h1
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            style={headingStyle}
          >
            "Made with Love,
            <br />
            <span
              className="italic font-normal"
              style={{ color: theme.primary }}
            >
              Designed by You."
            </span>
          </h1>

          <p
            className="text-base sm:text-lg leading-relaxed max-w-3xl mx-auto"
            style={paragraphStyle}
          >
            Welcome to ArtStudio, a little creative corner where every
            card tells a story. We believe that the smallest gestures
            can create the biggest smiles. Our handmade and personalized
            cards are thoughtfully designed to make your special moments
            more memorable.
          </p>
        </div>
      </section>

      {/* STORY AND PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-6 space-y-5">
            <span
              className="text-xs font-semibold tracking-wider uppercase"
              style={eyebrowStyle}
            >
              {about.storyEyebrow}
            </span>

            <h2
              className="font-serif text-3xl font-bold"
              style={headingStyle}
            >
              {about.storyTitle}
            </h2>

            <p
              className="text-sm leading-relaxed"
              style={paragraphStyle}
            >
              {about.storyParagraph1}
            </p>

            <p
              className="text-sm leading-relaxed"
              style={paragraphStyle}
            >
              {about.storyParagraph2}
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to={about.primaryButtonLink || "/customize"}
                className="about-theme-button px-5 py-3 text-xs font-semibold rounded-xl flex items-center gap-2"
                style={primaryButtonStyle}
              >
                <span>{about.primaryButtonText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to={about.secondaryButtonLink || "/shop"}
                className="about-theme-button px-5 py-3 border text-xs font-semibold rounded-xl"
                style={secondaryButtonStyle}
              >
                {about.secondaryButtonText}
              </Link>
            </div>
          </div>

          {/* STORY IMAGE */}
          <div className="lg:col-span-6 relative">
            <div
              className="about-theme-hover rounded-3xl overflow-hidden border-4 aspect-[4/3]"
              style={{
                borderColor: theme.card,
                boxShadow:
                  "0 12px 30px color-mix(in srgb, var(--theme-primary) 15%, transparent)"
              }}
            >
              <img
                src={about.storyImage}
                alt={about.storyImageAlt || "ArtStudio handmade cards"}
                className="w-full h-full object-cover"
              />
            </div>

            <div
              className="absolute -bottom-6 -left-6 p-4 rounded-2xl border shadow-lg max-w-xs hidden sm:block"
              style={{
                backgroundColor: theme.card,
                borderColor: theme.light,
                boxShadow:
                  "0 8px 25px color-mix(in srgb, var(--theme-primary) 15%, transparent)"
              }}
            >
              <p
                className="font-serif text-base font-bold"
                style={eyebrowStyle}
              >
                {about.imageCaptionTitle}
              </p>

              <p
                className="text-xs mt-1"
                style={paragraphStyle}
              >
                {about.imageCaptionText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION AND VALUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span
            className="text-xs font-semibold tracking-wider uppercase"
            style={eyebrowStyle}
          >
            Our Guiding Values
          </span>

          <h2
            className="font-serif text-3xl font-bold"
            style={headingStyle}
          >
            The Art of Thoughtful Gifting
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DEFAULT_VALUES.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="about-theme-hover rounded-3xl p-8 border space-y-3"
                style={cardStyle}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: theme.soft,
                    color: theme.primary
                  }}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <h3
                  className="font-serif text-lg font-bold"
                  style={headingStyle}
                >
                  {item.title}
                </h3>

                <p
                  className="text-xs leading-relaxed"
                  style={paragraphStyle}
                >
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HANDMADE CARD GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span
            className="text-xs font-semibold tracking-wider uppercase"
            style={eyebrowStyle}
          >
            {about.galleryEyebrow}
          </span>

          <h2
            className="font-serif text-3xl font-bold"
            style={headingStyle}
          >
            {about.galleryTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {about.galleryImages.map((item, index) => (
            <div
              key={index}
              className="about-theme-hover rounded-3xl overflow-hidden aspect-[4/3] border"
              style={{
                borderColor: theme.light,
                boxShadow:
                  "0 5px 16px color-mix(in srgb, var(--theme-primary) 10%, transparent)"
              }}
            >
              <img
                src={getImageUrl(item)}
                alt={item.alt || `ArtStudio gallery image ${index + 1}`}
                className="about-theme-image w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
