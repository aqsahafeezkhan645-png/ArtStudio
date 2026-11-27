
import React, { useEffect, useState } from "react";
import { Save, RefreshCw, Upload } from "lucide-react";

const API = "http://localhost:5000/api/site-content";

// Upload directly to Cloudinary and report real upload progress.
function uploadDirectlyToCloudinary({
  cloudName,
  file,
  signatureData,
  onProgress,
}) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();

    formData.append("file", file, file.name);
    formData.append("api_key", signatureData.apiKey);
    formData.append("timestamp", String(signatureData.timestamp));
    formData.append("folder", signatureData.folder);
    formData.append("public_id", signatureData.publicId);
    formData.append("signature", signatureData.signature);

    const xhr = new XMLHttpRequest();

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(
          Math.round((event.loaded / event.total) * 100)
        );
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(
            new Error("Cloudinary returned an invalid response.")
          );
        }
      } else {
        let message = "Image upload failed.";

        try {
          message =
            JSON.parse(xhr.responseText)?.error?.message ||
            message;
        } catch {
          // Keep default error.
        }

        reject(new Error(message));
      }
    };

    xhr.onerror = () =>
      reject(new Error("Network error during image upload."));

    xhr.onabort = () =>
      reject(new Error("Image upload was cancelled."));

    xhr.send(formData);
  });
}

const DEFAULT_HOME_CATEGORIES = [
  {
    name: "Birthday Cards",
    image: "",
    alt: "Handcrafted birthday cards",
  },
  {
    name: "Anniversary Cards",
    image: "",
    alt: "Handcrafted anniversary cards",
  },
  {
    name: "Wedding Cards",
    image: "",
    alt: "Handcrafted wedding cards",
  },
  {
    name: "Love & Friendship",
    image: "",
    alt: "Handcrafted love and friendship cards",
  },
  {
    name: "Thank You Cards",
    image: "",
    alt: "Handcrafted thank you cards",
  },
  {
    name: "Congratulations",
    image: "",
    alt: "Handcrafted congratulations cards",
  },
];

const DEFAULT_HOME_GALLERY = [
  {
    image: "",
    alt: "ArtStudio handmade card gallery image 1",
  },
  {
    image: "",
    alt: "ArtStudio handmade card gallery image 2",
  },
  {
    image: "",
    alt: "ArtStudio handmade card gallery image 3",
  },
  {
    image: "",
    alt: "ArtStudio handmade card gallery image 4",
  },
];

const DEFAULT_ABOUT_GALLERY = [
  {
    image: "/src/assets/images/birthday_cards.jpg",
    alt: "Handcrafted birthday card collection",
  },
  {
    image: "/src/assets/images/wedding_anniversary.jpg",
    alt: "Handcrafted wedding and anniversary cards",
  },
  {
    image: "/src/assets/images/floral_gratitude.jpg",
    alt: "Handcrafted floral gratitude cards",
  },
];

const DEFAULT_ABOUT = {
  storyEyebrow: "Our Humble Beginning",

  storyTitle:
    "From Pressed Petals on a Kitchen Table to Heirloom Keepsakes",

  storyParagraph1:
    "ArtStudio began with a simple love for handmade cards and meaningful little details. What started as a small creative passion grew into a place where every card is made to celebrate life's special moments.",

  storyParagraph2:
    "We believe a handmade card carries more than words. It carries thought, time, creativity, and love. Our goal is to help you share those feelings through beautifully designed keepsakes.",

  storyImage:
    "/src/assets/images/hero_handmade_cards_1794160681532.jpg",

  storyImageAlt:
    "Beautiful handmade cards created by ArtStudio",

  imageCaptionTitle: "350 GSM Handcrafted Cotton",

  imageCaptionText:
    "Carefully selected materials and thoughtful details make every card special.",

  primaryButtonText: "Design a Personal Card",
  primaryButtonLink: "/customize",

  secondaryButtonText: "Explore Catalog",
  secondaryButtonLink: "/shop",

  galleryEyebrow: "Craftsmanship Portfolio",

  galleryTitle: "Gallery of Handcrafted Card Suites",

  galleryImages: DEFAULT_ABOUT_GALLERY,
};

const DEFAULT_CONTENT = {
  header: {
    logo: "",
    storeName: "ArtStudio",
    tagline: "Handmade with love",
  },

  home: {
    heroTitle: "Beautiful Cards, Made with Love",
    heroSubtitle:
      "Make every moment unforgettable with handmade cards.",
    heroButtonText: "Explore Collection",
    heroButtonLink: "/shop",
    heroImage: "",
    categories: DEFAULT_HOME_CATEGORIES,
    instagramGallery: DEFAULT_HOME_GALLERY,
  },

  about: DEFAULT_ABOUT,

  contact: {
    title: "Get in Touch",
    subtitle: "We would love to hear from you.",
    email: "",
    phone: "",
    address: "",
  },

  footer: {
    description: "Handmade cards created with love and care.",
    copyright: "© 2026 ArtStudio. All rights reserved.",
  },
};

function getImageUrl(item) {
  if (!item) return "";

  if (typeof item === "string") {
    return item;
  }

  return item.image || item.url || item.src || "";
}

function mergeArrayDefaults(savedItems, defaults) {
  if (!Array.isArray(savedItems)) {
    return defaults;
  }

  return defaults.map((defaultItem, index) => {
    const savedItem = savedItems[index];

    if (!savedItem) {
      return defaultItem;
    }

    if (typeof savedItem === "string") {
      return {
        ...defaultItem,
        image: savedItem,
      };
    }

    return {
      ...defaultItem,
      ...savedItem,
      image: getImageUrl(savedItem) || defaultItem.image,
    };
  });
}

export default function CMSDashboard() {
  const [activeTab, setActiveTab] = useState("header");

  const [content, setContent] = useState(DEFAULT_CONTENT);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [uploading, setUploading] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});

  const jsonHeaders = {
    "Content-Type": "application/json",
  };

  useEffect(() => {
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function normalizeContent(saved = {}) {
    return {
      ...DEFAULT_CONTENT,
      ...saved,

      header: {
        ...DEFAULT_CONTENT.header,
        ...(saved.header || {}),
        // Support old CMS data while using storeName everywhere.
        storeName:
          saved.header?.storeName ??
          saved.header?.siteName ??
          DEFAULT_CONTENT.header.storeName,
      },

      home: {
        ...DEFAULT_CONTENT.home,
        ...(saved.home || {}),

        categories: mergeArrayDefaults(
          saved.home?.categories,
          DEFAULT_HOME_CATEGORIES
        ),

        instagramGallery: mergeArrayDefaults(
          saved.home?.instagramGallery,
          DEFAULT_HOME_GALLERY
        ),
      },

      about: {
        ...DEFAULT_ABOUT,
        ...(saved.about || {}),

        galleryImages: mergeArrayDefaults(
          saved.about?.galleryImages,
          DEFAULT_ABOUT_GALLERY
        ),
      },

      contact: {
        ...DEFAULT_CONTENT.contact,
        ...(saved.contact || {}),
      },

      footer: {
        ...DEFAULT_CONTENT.footer,
        ...(saved.footer || {}),
      },
    };
  }

  async function loadContent() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(API, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load site content."
        );
      }

      const saved = data.content || data;

      setContent(normalizeContent(saved));
    } catch (error) {
      setMessage(
        error.message || "Unable to load content."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateField(section, field, value) {
    setContent((previous) => ({
      ...previous,

      [section]: {
        ...previous[section],
        [field]: value,
      },
    }));
  }

  function updateHomeArrayItem(arrayName, index, patch) {
    setContent((previous) => {
      const items = [
        ...(previous.home[arrayName] || []),
      ];

      items[index] = {
        ...items[index],
        ...patch,
      };

      return {
        ...previous,

        home: {
          ...previous.home,
          [arrayName]: items,
        },
      };
    });
  }

  function updateSectionArrayItem(
    section,
    arrayName,
    index,
    patch
  ) {
    setContent((previous) => {
      const items = [
        ...(previous[section][arrayName] || []),
      ];

      items[index] = {
        ...items[index],
        ...patch,
      };

      return {
        ...previous,

        [section]: {
          ...previous[section],
          [arrayName]: items,
        },
      };
    });
  }

  // SAVE CMS SECTION
  async function saveSection(section) {
    setSaving(true);
    setMessage("");

    try {
      const sectionData = {
        ...content[section],
      };

      // Always send the correct database field.
      if (section === "header") {
        sectionData.storeName =
          content.header.storeName || "";

        delete sectionData.siteName;
      }

      const response = await fetch(API, {
        method: "PUT",
        credentials: "include",
        headers: jsonHeaders,
        body: JSON.stringify({
          [section]: sectionData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save changes."
        );
      }

      if (!data.content) {
        throw new Error(
          "Save response did not contain updated content."
        );
      }

      // Refresh CMS state using the actual saved server data.
      setContent(normalizeContent(data.content));

      setMessage(
        `${section} section saved successfully!`
      );
    } catch (error) {
      setMessage(
        error.message || "Unable to save changes."
      );
    } finally {
      setSaving(false);
    }
  }

  async function requestUploadSignature(
    section,
    field,
    index
  ) {
    const response = await fetch(
      `${API}/upload-signature`,
      {
        method: "POST",
        credentials: "include",
        headers: jsonHeaders,
        body: JSON.stringify({
          section,
          field,
          ...(index !== undefined ? { index } : {}),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Could not prepare image upload."
      );
    }

    return data;
  }

  async function uploadImage(
    section,
    field,
    arrayName,
    index
  ) {
    const key =
      `${section}-${field}-${index ?? "single"}`;

    const fileInput = document.getElementById(
      `upload-${key}`
    );

    const file = fileInput?.files?.[0];

    if (!file) {
      setMessage("Please select an image first.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage(
        "Please select a valid image file."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage(
        "Image size must be less than 5MB."
      );
      return;
    }

    setUploading((previous) => ({
      ...previous,
      [key]: true,
    }));

    setUploadProgress((previous) => ({
      ...previous,
      [key]: 0,
    }));

    setMessage("");

    try {
      const signatureData =
        await requestUploadSignature(
          section,
          field,
          index
        );

      const cloudName = signatureData.cloudName;

      if (!cloudName) {
        throw new Error(
          "Cloudinary cloud name was not returned."
        );
      }

      const result = await uploadDirectlyToCloudinary({
        cloudName,
        file,
        signatureData,

        onProgress: (progress) => {
          setUploadProgress((previous) => ({
            ...previous,
            [key]: progress,
          }));
        },
      });

      if (!result.secure_url) {
        throw new Error(
          "Cloudinary did not return an image URL."
        );
      }

      if (
        arrayName !== undefined &&
        index !== undefined
      ) {
        if (section === "home") {
          updateHomeArrayItem(
            arrayName,
            index,
            {
              image: result.secure_url,
              publicId: result.public_id,
            }
          );
        } else {
          updateSectionArrayItem(
            section,
            arrayName,
            index,
            {
              image: result.secure_url,
              publicId: result.public_id,
            }
          );
        }
      } else {
        updateField(
          section,
          field,
          result.secure_url
        );

        if (
          section === "about" &&
          field === "storyImage"
        ) {
          updateField(
            section,
            "storyImagePublicId",
            result.public_id
          );
        }

        if (
          section === "home" &&
          field === "heroImage"
        ) {
          updateField(
            section,
            "heroImagePublicId",
            result.public_id
          );
        }
      }

      setMessage(
        "Image uploaded successfully! Remember to save the section."
      );

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      setMessage(
        error.message || "Image upload failed."
      );
    } finally {
      setUploading((previous) => ({
        ...previous,
        [key]: false,
      }));
    }
  }

  function imageUploader(
    label,
    section,
    field
  ) {
    const key = `${section}-${field}-single`;

    const image =
      content[section]?.[field] || "";

    return (
      <div className="cms-field" key={key}>
        <label>{label}</label>

        {image && (
          <img
            src={image}
            alt={label}
            className="cms-preview"
          />
        )}

        <input
          id={`upload-${key}`}
          type="file"
          accept="image/png,image/jpeg,image/webp"
        />

        <button
          type="button"
          onClick={() =>
            uploadImage(section, field)
          }
          disabled={!!uploading[key]}
          className="cms-upload-btn"
        >
          <Upload size={16} />

          {uploading[key]
            ? `Uploading ${uploadProgress[key] || 0}%`
            : "Upload Image"}
        </button>
      </div>
    );
  }

  function arrayImageUploader(
    label,
    arrayName,
    index,
    imageField = "image",
    section = "home"
  ) {
    const key =
      `${section}-${arrayName}-${index}`;

    const item =
      content[section]?.[arrayName]?.[index] || {};

    const image = getImageUrl(item);

    return (
      <div className="cms-field" key={key}>
        <label>{label}</label>

        {image && (
          <img
            src={image}
            alt={item.alt || label}
            className="cms-preview"
          />
        )}

        <input
          id={`upload-${key}`}
          type="file"
          accept="image/png,image/jpeg,image/webp"
        />

        <button
          type="button"
          onClick={() =>
            uploadImage(
              section,
              arrayName,
              arrayName,
              index
            )
          }
          disabled={!!uploading[key]}
          className="cms-upload-btn"
        >
          <Upload size={16} />

          {uploading[key]
            ? `Uploading ${uploadProgress[key] || 0}%`
            : "Upload Image"}
        </button>

        <label>Image Alt Text</label>

        <input
          type="text"
          value={item.alt || ""}
          onChange={(event) => {
            const patch = {
              [imageField === "image"
                ? "alt"
                : imageField]: event.target.value,
            };

            if (section === "home") {
              updateHomeArrayItem(
                arrayName,
                index,
                patch
              );
            } else {
              updateSectionArrayItem(
                section,
                arrayName,
                index,
                patch
              );
            }
          }}
          placeholder="Describe this image"
        />
      </div>
    );
  }

  function inputField(
    section,
    field,
    label,
    type = "text"
  ) {
    return (
      <div
        className="cms-field"
        key={`${section}-${field}`}
      >
        <label>{label}</label>

        <input
          type={type}
          value={content[section]?.[field] || ""}
          onChange={(event) =>
            updateField(
              section,
              field,
              event.target.value
            )
          }
        />
      </div>
    );
  }

  function textareaField(
    section,
    field,
    label
  ) {
    return (
      <div
        className="cms-field"
        key={`${section}-${field}`}
      >
        <label>{label}</label>

        <textarea
          rows="4"
          value={content[section]?.[field] || ""}
          onChange={(event) =>
            updateField(
              section,
              field,
              event.target.value
            )
          }
        />
      </div>
    );
  }

  function saveButton(section) {
    return (
      <button
        type="button"
        className="cms-save-btn"
        onClick={() => saveSection(section)}
        disabled={saving}
      >
        <Save size={17} />

        {saving
          ? "Saving..."
          : `Save ${section} Section`}
      </button>
    );
  }

  function homeCategoriesEditor() {
    return (
      <div className="cms-array-grid">
        {content.home.categories.map(
          (category, index) => (
            <div
              className="cms-array-card"
              key={`category-${index}`}
            >
              <h3>{category.name}</h3>

              {arrayImageUploader(
                `${category.name} Image`,
                "categories",
                index
              )}

              <label>Category Name</label>

              <input
                value={category.name || ""}
                onChange={(event) =>
                  updateHomeArrayItem(
                    "categories",
                    index,
                    {
                      name: event.target.value,
                    }
                  )
                }
              />
            </div>
          )
        )}
      </div>
    );
  }

  function homeGalleryEditor() {
    return (
      <div className="cms-array-grid">
        {content.home.instagramGallery.map(
          (item, index) => (
            <div
              className="cms-array-card"
              key={`home-gallery-${index}`}
            >
              <h3>
                Instagram Image {index + 1}
              </h3>

              {arrayImageUploader(
                `Instagram Gallery Image ${index + 1}`,
                "instagramGallery",
                index
              )}
            </div>
          )
        )}
      </div>
    );
  }

  function aboutGalleryEditor() {
    return (
      <div className="cms-array-grid">
        {content.about.galleryImages.map(
          (item, index) => (
            <div
              className="cms-array-card"
              key={`about-gallery-${index}`}
            >
              <h3>
                About Gallery Image {index + 1}
              </h3>

              {arrayImageUploader(
                `About Gallery Image ${index + 1}`,
                "galleryImages",
                index,
                "image",
                "about"
              )}
            </div>
          )
        )}
      </div>
    );
  }

  function headerSection() {
    return (
      <div className="cms-panel">
        <h2>Header Settings</h2>

        <p>
          Manage your website logo, name, and tagline.
        </p>

        {imageUploader(
          "Website Logo",
          "header",
          "logo"
        )}

        {/* Correct database field: storeName */}
        {inputField(
          "header",
          "storeName",
          "Website Name"
        )}

        {inputField(
          "header",
          "tagline",
          "Website Tagline"
        )}

        {saveButton("header")}
      </div>
    );
  }

  function homeSection() {
    return (
      <div className="cms-panel">
        <h2>Homepage Settings</h2>

        <p>
          Manage your homepage content and images.
        </p>

        <h3>Hero Section</h3>

        {inputField(
          "home",
          "heroTitle",
          "Hero Heading"
        )}

        {textareaField(
          "home",
          "heroSubtitle",
          "Hero Description"
        )}

        {inputField(
          "home",
          "heroButtonText",
          "Hero Button Text"
        )}

        {inputField(
          "home",
          "heroButtonLink",
          "Hero Button Link"
        )}

        {imageUploader(
          "Homepage Hero Image",
          "home",
          "heroImage"
        )}

        <hr />

        <h3>Homepage Categories</h3>

        <p>
          Upload an image for each of the six homepage categories.
        </p>

        {homeCategoriesEditor()}

        <hr />

        <h3>Instagram Gallery</h3>

        <p>
          Manage the four images displayed in your homepage gallery.
        </p>

        {homeGalleryEditor()}

        {saveButton("home")}
      </div>
    );
  }

  function aboutSection() {
    return (
      <div className="cms-panel">
        <h2>About Us Page Settings</h2>

        <p>
          Edit your About Us story, images, captions, buttons, and gallery.
        </p>

        <h3>Our Story</h3>

        {inputField(
          "about",
          "storyEyebrow",
          "Small Heading"
        )}

        {inputField(
          "about",
          "storyTitle",
          "Main Story Title"
        )}

        {textareaField(
          "about",
          "storyParagraph1",
          "First Paragraph"
        )}

        {textareaField(
          "about",
          "storyParagraph2",
          "Second Paragraph"
        )}

        {imageUploader(
          "Main Story Image",
          "about",
          "storyImage"
        )}

        {inputField(
          "about",
          "storyImageAlt",
          "Story Image Alt Text"
        )}

        {inputField(
          "about",
          "imageCaptionTitle",
          "Image Caption Title"
        )}

        {textareaField(
          "about",
          "imageCaptionText",
          "Image Caption Description"
        )}

        <hr />

        <h3>About Page Buttons</h3>

        {inputField(
          "about",
          "primaryButtonText",
          "Primary Button Text"
        )}

        {inputField(
          "about",
          "primaryButtonLink",
          "Primary Button Link"
        )}

        {inputField(
          "about",
          "secondaryButtonText",
          "Secondary Button Text"
        )}

        {inputField(
          "about",
          "secondaryButtonLink",
          "Secondary Button Link"
        )}

        <hr />

        <h3>About Page Gallery</h3>

        {inputField(
          "about",
          "galleryEyebrow",
          "Gallery Small Heading"
        )}

        {inputField(
          "about",
          "galleryTitle",
          "Gallery Main Title"
        )}

        {aboutGalleryEditor()}

        {saveButton("about")}
      </div>
    );
  }

  function contactSection() {
    return (
      <div className="cms-panel">
        <h2>Contact Page Settings</h2>

        <p>
          Manage your contact information.
        </p>

        {inputField(
          "contact",
          "title",
          "Contact Heading"
        )}

        {textareaField(
          "contact",
          "subtitle",
          "Contact Description"
        )}

        {inputField(
          "contact",
          "email",
          "Email Address",
          "email"
        )}

        {inputField(
          "contact",
          "phone",
          "Phone Number"
        )}

        {textareaField(
          "contact",
          "address",
          "Address"
        )}

        {saveButton("contact")}
      </div>
    );
  }

  function footerSection() {
    return (
      <div className="cms-panel">
        <h2>Footer Settings</h2>

        <p>
          Manage your website footer information.
        </p>

        {textareaField(
          "footer",
          "description",
          "Footer Description"
        )}

        {inputField(
          "footer",
          "copyright",
          "Copyright Text"
        )}

        {saveButton("footer")}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cms-loading">
        <RefreshCw
          className="cms-spin"
          size={28}
        />

        <p>Loading CMS Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="cms-dashboard">
      <style>{`
        .cms-dashboard {
          --cms-primary: var(--theme-primary, #DB8FA5);
          --cms-secondary: var(--theme-secondary, #B85C7A);
          --cms-accent: var(--theme-accent, #F2B9CC);
          --cms-light: var(--theme-light, #F8DCE6);
          --cms-soft: var(--theme-soft, #FCE7EF);
          --cms-background: var(--theme-background, #FFF5F8);
          --cms-text: var(--theme-text, #593D49);
          --cms-muted: var(--theme-muted, #927582);
          min-height: 100vh;
          padding: 35px;
          background: var(--cms-background);
          color: var(--cms-text);
          font-family: Arial, sans-serif;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .cms-dashboard * { box-sizing: border-box; }

        .cms-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 18px;
          margin-bottom: 25px;
        }

        .cms-header h1 {
          margin: 0 0 8px;
          color: var(--cms-secondary);
          font-size: 30px;
        }

        .cms-header p, .cms-panel p { color: var(--cms-muted); }
        .cms-header p { margin: 0; }

        .cms-tabs { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 22px; }
        .cms-tab {
          border: 1px solid var(--cms-accent);
          background: #fff;
          color: var(--cms-secondary);
          border-radius: 9px;
          padding: 12px 18px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color .2s ease, color .2s ease, border-color .2s ease;
        }
        .cms-tab:hover { background: var(--cms-soft); }
        .cms-tab.active {
          background: var(--cms-secondary);
          color: #fff;
          border-color: var(--cms-secondary);
        }

        .cms-panel {
          background: #fff;
          color: var(--cms-text);
          border: 1px solid var(--cms-light);
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 5px 20px rgba(40, 30, 45, 0.06);
        }
        .cms-panel h2 { color: var(--cms-secondary); margin-top: 0; }
        .cms-panel h3 { color: var(--cms-secondary); margin-top: 25px; }
        .cms-panel p { line-height: 1.6; }

        .cms-field { display: flex; flex-direction: column; gap: 9px; margin: 18px 0; }
        .cms-field label, .cms-array-card label { font-weight: 600; color: var(--cms-text); }
        .cms-field input, .cms-field textarea, .cms-array-card input {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 13px;
          border: 1px solid var(--cms-accent);
          border-radius: 8px;
          outline: none;
          font-size: 14px;
          color: var(--cms-text);
          background: #fff;
        }
        .cms-field input::placeholder, .cms-field textarea::placeholder,
        .cms-array-card input::placeholder { color: var(--cms-muted); opacity: .85; }
        .cms-field input:focus, .cms-field textarea:focus,
        .cms-array-card input:focus {
          border-color: var(--cms-secondary);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--cms-primary) 18%, transparent);
        }
        .cms-field textarea { resize: vertical; line-height: 1.6; }

        .cms-preview {
          width: 100%;
          max-width: 260px;
          height: 160px;
          object-fit: cover;
          border-radius: 10px;
          border: 1px solid var(--cms-light);
          background: var(--cms-soft);
        }

        .cms-upload-btn, .cms-save-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          border-radius: 9px;
          padding: 12px 17px;
          background: var(--cms-secondary);
          color: #fff;
          cursor: pointer;
          font-weight: 600;
          width: fit-content;
          transition: opacity .2s ease, transform .2s ease;
        }
        .cms-upload-btn:hover, .cms-save-btn:hover { background: var(--cms-primary); }
        .cms-upload-btn:active, .cms-save-btn:active { transform: scale(.98); }
        .cms-upload-btn:disabled, .cms-save-btn:disabled { opacity: .6; cursor: not-allowed; }
        .cms-save-btn { margin-top: 25px; }

        .cms-array-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }
        .cms-array-card {
          min-width: 0;
          padding: 18px;
          border: 1px solid var(--cms-light);
          border-radius: 12px;
          background: var(--cms-soft);
        }
        .cms-array-card h3 { margin: 0 0 15px; font-size: 17px; color: var(--cms-secondary); }
        .cms-array-card .cms-field { margin: 12px 0; }
        .cms-array-card .cms-preview { max-width: 100%; height: 150px; }
        .cms-array-card > label { display: block; margin: 15px 0 8px; }
        .cms-array-card > input { margin-bottom: 10px; }

        .cms-message {
          margin-bottom: 20px;
          padding: 13px 16px;
          border-radius: 9px;
          background: var(--cms-soft);
          border: 1px solid var(--cms-accent);
          color: var(--cms-secondary);
          font-weight: 600;
        }
        .cms-loading {
          min-height: 70vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: var(--theme-secondary, #B85C7A);
          background: var(--theme-background, #FFF5F8);
        }
        .cms-spin { animation: cms-spin 1.2s linear infinite; }
        @keyframes cms-spin { to { transform: rotate(360deg); } }
        .cms-panel hr { border: none; border-top: 1px solid var(--cms-light); margin: 30px 0; }

        @media (max-width: 650px) {
          .cms-dashboard { padding: 18px; }
          .cms-panel { padding: 18px; }
        }
      `}</style>

      <div className="cms-header">
        <div>
          <h1>ArtStudio CMS Dashboard</h1>
          <p>
            Manage your website content and images.
          </p>
        </div>
      </div>

      {message && (
        <div className="cms-message">
          {message}
        </div>
      )}

      <div className="cms-tabs">
        <button
          className={`cms-tab ${
            activeTab === "header" ? "active" : ""
          }`}
          onClick={() => setActiveTab("header")}
        >
          Header
        </button>

        <button
          className={`cms-tab ${
            activeTab === "home" ? "active" : ""
          }`}
          onClick={() => setActiveTab("home")}
        >
          Homepage
        </button>

        <button
          className={`cms-tab ${
            activeTab === "about" ? "active" : ""
          }`}
          onClick={() => setActiveTab("about")}
        >
          About Us
        </button>

        <button
          className={`cms-tab ${
            activeTab === "contact" ? "active" : ""
          }`}
          onClick={() => setActiveTab("contact")}
        >
          Contact
        </button>

        <button
          className={`cms-tab ${
            activeTab === "footer" ? "active" : ""
          }`}
          onClick={() => setActiveTab("footer")}
        >
          Footer
        </button>
      </div>

      {activeTab === "header" && headerSection()}
      {activeTab === "home" && homeSection()}
      {activeTab === "about" && aboutSection()}
      {activeTab === "contact" && contactSection()}
      {activeTab === "footer" && footerSection()}
    </div>
  );
}
