
import mongoose from "mongoose";

const siteContentSchema = new mongoose.Schema(
  {
    // Global website header
    header: {
      announcement: {
        type: String,
        default:
          "Complimentary hand-lettered wax seal envelope with every customized card order!"
      },
      storeName: {
        type: String,
        default: "ArtStudio"
      },
      tagline: {
        type: String,
        default: "HANDMADE & CUSTOMIZED"
      },
      logo: {
        type: String,
        default: ""
      },
      logoPublicId: {
        type: String,
        default: ""
      },
      showAnnouncement: {
        type: Boolean,
        default: true
      }
    },

    // Homepage content
    home: {
      heroBadge: {
        type: String,
        default: "Handmade with Love & Artisanal Botanicals"
      },
      heroHeading: {
        type: String,
        default: "A Little Card,"
      },
      heroAccent: {
        type: String,
        default: "A Lot of Love."
      },
      heroDescription: {
        type: String,
        default:
          "Beautiful handmade cards, thoughtfully designed to make your special moments unforgettable. Personalize every word, background, and delicate dried petal decoration."
      },
      heroImage: {
        type: String,
        default: ""
      },
      heroImagePublicId: {
        type: String,
        default: ""
      },
      featuredTitle: {
        type: String,
        default: "Artisanal Lavender Suite"
      },
      featuredDescription: {
        type: String,
        default: "With silk ribbons & dried flora"
      },
      heroButtonText: {
        type: String,
        default: "Explore Our Cards"
      },
      heroButtonLink: {
        type: String,
        default: "/shop"
      },
      categoriesHeading: {
        type: String,
        default: "Cards for Every Cherished Occasion"
      },
      categoriesSubtitle: {
        type: String,
        default:
          "Browse our specially curated categories, designed with delicate dried florals and deckled paper."
      },
      heroTitle: {
        type: String,
        default: "Beautiful Cards, Made with Love"
      },
      heroSubtitle: {
        type: String,
        default:
          "Make every moment unforgettable with handmade cards."
      },
      trustBadges: {
        type: mongoose.Schema.Types.Mixed,
        default: [
          {
            title: "100%",
            description: "Real Dried Botanicals"
          },
          {
            title: "350 GSM",
            description: "Cotton Rag Paper"
          },
          {
            title: "Free COD",
            description: "Orders Over PKR 3,000"
          }
        ]
      },
      categories: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
      },
      customizationBanner: {
        type: mongoose.Schema.Types.Mixed,
        default: {
          badge: "Interactive Card Studio",
          heading: "Your Words, Your Design, Your Card!",
          description:
            "Create a personalized greeting card with your own heartfelt message, custom pastel colors, elegant fonts, and botanical decorations.",
          buttonText: "Design My Card Now"
        }
      },
      whyChoose: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
      },
      reviews: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
      },
      instagramGallery: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
      }
    },

    // About Us page
    about: {
      // Existing fields - preserved
      heading: {
        type: String,
        default: "Our Story"
      },
      subtitle: {
        type: String,
        default: "The ArtStudio Story"
      },
      description: {
        type: String,
        default: ""
      },
      image: {
        type: String,
        default: ""
      },
      imagePublicId: {
        type: String,
        default: ""
      },

      // About Us story content
      storyEyebrow: {
        type: String,
        default: "Our Humble Beginning"
      },
      storyTitle: {
        type: String,
        default:
          "From Pressed Petals on a Kitchen Table to Heirloom Keepsakes"
      },
      storyParagraph1: {
        type: String,
        default:
          "ArtStudio started with a simple belief: in a fast digital world of generic text messages, a physical, tactile card made from organic textured cotton paper carrying your own words holds immense warmth."
      },
      storyParagraph2: {
        type: String,
        default:
          "Every card we produce starts with real dried botanicals—lavender buds, pressed pansies, and baby’s breath—hand-gathered and preserved in our studio. We bind every envelope with custom wax seals and lilac satin ribbons to ensure every recipient feels truly cherished."
      },

      // Main story image
      storyImage: {
        type: String,
        default: ""
      },
      storyImagePublicId: {
        type: String,
        default: ""
      },
      storyImageAlt: {
        type: String,
        default: "ArtStudio paper crafting table"
      },

      // Story image caption
      imageCaptionTitle: {
        type: String,
        default: "350 GSM Handcrafted Cotton"
      },
      imageCaptionText: {
        type: String,
        default:
          "Deckled edges, cold-pressed texture, and archival ink that never fades."
      },

      // About Us buttons
      primaryButtonText: {
        type: String,
        default: "Design a Personal Card"
      },
      primaryButtonLink: {
        type: String,
        default: "/customize"
      },
      secondaryButtonText: {
        type: String,
        default: "Explore Catalog"
      },
      secondaryButtonLink: {
        type: String,
        default: "/shop"
      },

      // About Us gallery headings
      galleryEyebrow: {
        type: String,
        default: "Craftsmanship Portfolio"
      },
      galleryTitle: {
        type: String,
        default: "Gallery of Handcrafted Card Suites"
      },

      // Three editable About Us gallery images
      galleryImages: {
        type: [mongoose.Schema.Types.Mixed],
        default: [
          {
            image: "",
            alt: "Handcrafted birthday card collection"
          },
          {
            image: "",
            alt: "Handcrafted wedding and anniversary cards"
          },
          {
            image: "",
            alt: "Handcrafted floral gratitude cards"
          }
        ]
      }
    },

    // Contact page
    contact: {
      heading: {
        type: String,
        default: "Get in Touch"
      },
      description: {
        type: String,
        default: ""
      },
      email: {
        type: String,
        default: ""
      },
      phone: {
        type: String,
        default: ""
      },
      address: {
        type: String,
        default: ""
      },
      workingHours: {
        type: String,
        default: ""
      },
      title: {
        type: String,
        default: "Get in Touch"
      },
      subtitle: {
        type: String,
        default: "We would love to hear from you."
      }
    },

    // Global footer
    footer: {
      description: {
        type: String,
        default: ""
      },
      copyright: {
        type: String,
        default: "© ArtStudio. All rights reserved."
      },
      instagram: {
        type: String,
        default: ""
      },
      facebook: {
        type: String,
        default: ""
      },
      tiktok: {
        type: String,
        default: ""
      },
      pinterest: {
        type: String,
        default: ""
      },
      youtube: {
        type: String,
        default: ""
      }
    },

    // Additional editable pages
    pages: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    }
  },
  {
    timestamps: true,
    minimize: false
  }
);

export default mongoose.models.SiteContent ||
  mongoose.model("SiteContent", siteContentSchema);
