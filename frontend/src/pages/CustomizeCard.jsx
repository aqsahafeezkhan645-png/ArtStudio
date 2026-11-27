import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { useApp } from '../context/AppContext.jsx';
import {
  Palette,
  Sparkles,
  Download,
  ShoppingBag,
  RotateCcw,
  Bookmark,
  Eye,
  Type,
  Maximize2,
  Check,
  Heart,
  Flower2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  X,
  Layers,
  Image as ImageIcon,
  Upload,
  Trash2,
  Camera,
  Sliders,
  CheckCircle2
} from 'lucide-react';

const OCCASIONS = [
  'Birthday',
  'Anniversary',
  'Wedding',
  'Friendship',
  'Love',
  'Thank You',
  'Congratulations',
  'Other'
];

const THEMES = [
  { id: 'Cute', label: 'Cute', icon: '🐰' },
  { id: 'Floral', label: 'Floral', icon: '🌸' },
  { id: 'Romantic', label: 'Romantic', icon: '💌' },
  { id: 'Minimal', label: 'Minimal', icon: '✨' },
  { id: 'Elegant', label: 'Elegant', icon: '👑' },
  { id: 'Aesthetic', label: 'Aesthetic', icon: '🌿' }
];

const COLOR_PALETTES = [
  { id: '#FAF7FD', name: 'Pale Lavender', border: '#E9DDF7' },
  { id: '#F3ECFA', name: 'Soft Lilac', border: '#C8A2E8' },
  { id: '#E9DDF7', name: 'Vintage Lilac', border: '#9B72CF' },
  { id: '#FFFBF5', name: 'Cotton Cream', border: '#EBDDC9' },
  { id: '#FDE2E4', name: 'Blush Rose', border: '#FAD2E1' },
  { id: '#E8F5E9', name: 'Mint Meadow', border: '#C8E6C9' },
  { id: '#E3F2FD', name: 'Sky Vellum', border: '#BBDEFB' },
  { id: '#FFE8D6', name: 'Warm Peach', border: '#DDBEA9' }
];

const FONTS = [
  { id: "'Caveat', cursive", name: 'Calligraphy Script', class: 'font-handwritten' },
  { id: "'Playfair Display', serif", name: 'Elegant Serif', class: 'font-serif' },
  { id: "'Plus Jakarta Sans', sans-serif", name: 'Clean Modern', class: 'font-sans' }
];

const TEXT_COLORS = [
  { id: '#7041A6', name: 'Deep Purple' },
  { id: '#40334F', name: 'Midnight Plum' },
  { id: '#9B72CF', name: 'Lavender' },
  { id: '#834c38', name: 'Rosewood Gold' },
  { id: '#1E293B', name: 'Slate Ink' }
];

const DECORATIONS_CATALOG = [
  { id: 'heart', label: 'Purple Heart', emoji: '💜' },
  { id: 'flower', label: 'Pink Blossom', emoji: '🌸' },
  { id: 'butterfly', label: 'Lilac Butterfly', emoji: '🦋' },
  { id: 'star', label: 'Golden Star', emoji: '⭐' },
  { id: 'bow', label: 'Silk Bow', emoji: '🎀' },
  { id: 'balloon', label: 'Celebration Balloon', emoji: '🎈' },
  { id: 'sparkles', label: 'Magic Sparkles', emoji: '✨' },
  { id: 'botanical', label: 'Pressed Fern', emoji: '🌿' }
];

const SAMPLE_PHOTOS = [
  {
    name: 'Lavender Sprig',
    url: '/src/assets/images/birthday_card_craft_1794160682865.jpg'
  },
  {
    name: 'Wedding Bouquet',
    url: '/src/assets/images/wedding_anniversary_card_1794160683110.jpg'
  },
  {
    name: 'Pressed Pansies',
    url: '/src/assets/images/floral_gratitude_card_1794160684123.jpg'
  },
  {
    name: 'Atelier Keepsake',
    url: '/src/assets/images/hero_handmade_cards_1794160681532.jpg'
  }
];

const PHOTO_FRAMES = [
  { id: 'polaroid', label: 'Polaroid Washi', desc: 'Classic white polaroid with lilac tape' },
  { id: 'gold-deckled', label: 'Gold Deckled', desc: 'Handcrafted gold foil embossed border' },
  { id: 'cameo', label: 'Cameo Oval', desc: 'Romantic vintage portrait oval' },
  { id: 'minimal', label: 'Clean Edge', desc: 'Minimalist rounded photograph' }
];

const MESSAGE_TEMPLATES = {
  Birthday: "May your day bloom with endless happiness, surrounded by warmth, laughter, and the sweetest of celebrations. Happy Birthday!",
  Anniversary: "Every chapter with you is my favorite story. Here’s to celebrating another year of true love, shared dreams, and lifelong joy.",
  Wedding: "Wishing you both a lifetime of intertwined adventures, unshakeable devotion, and overflowing happiness as you begin forever together.",
  Friendship: "To the kindred spirit who knows my secrets, shares my laughter, and brings sunshine into every ordinary day. Thank you for being you!",
  Love: "You are the sweetest melody in my heart, the calm in my storm, and my forever favorite person. With all my love, always.",
  'Thank You': "Words cannot express the depth of my gratitude. Your kindness and generosity have touched my heart more than you know.",
  Congratulations: "So tremendously proud of your hard work and shining accomplishment! The future is yours to conquer. Congratulations!"
};

export default function CustomizeCard() {
  const { addToCart, saveCustomCard, showToast } = useApp();
  const navigate = useNavigate();
  const previewRef = useRef(null);
  const fileInputRef = useRef(null);

  // Card Configuration State
  const [occasion, setOccasion] = useState('Birthday');
  const [theme, setTheme] = useState('Floral');
  const [orientation, setOrientation] = useState('portrait'); // portrait or landscape
  const [bgColor, setBgColor] = useState('#FAF7FD');
  // Follow the active website theme until a paper swatch is selected.
  const [isCustomPaperColor, setIsCustomPaperColor] = useState(false);
  const [bgPattern, setBgPattern] = useState('plain');
  const [borderStyle, setBorderStyle] = useState('deckled-gold');

  // Text state
  const [cardTitle, setCardTitle] = useState('Happy Birthday');
  const [recipientName, setRecipientName] = useState('Dearest Maya');
  const [personalMessage, setPersonalMessage] = useState(
    'Wishing you a day filled with sunshine, sweet lavender blooms, and all the magic your heart can hold.'
  );
  const [senderName, setSenderName] = useState('With endless love, Ayla');

  // Typography & Styling
  const [fontFamily, setFontFamily] = useState("'Caveat', cursive");
  const [fontSize, setFontSize] = useState('medium');
  const [textColor, setTextColor] = useState('#7041A6');
  const [textAlign, setTextAlign] = useState('center');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  // Selected stickers/decorations
  const [selectedDecorations, setSelectedDecorations] = useState(['🌸', '💜', '🎀']);

  // PICTURE / PHOTO OF YOUR DESIGN FEATURE STATE
  const [customPhotoUrl, setCustomPhotoUrl] = useState(
    '/src/assets/images/birthday_card_craft_1794160682865.jpg'
  );
  const [photoFrameStyle, setPhotoFrameStyle] = useState('polaroid'); // 'polaroid', 'gold-deckled', 'cameo', 'minimal'
  const [photoLocation, setPhotoLocation] = useState('cover'); // 'cover', 'inside', 'both'
  const [photoCaption, setPhotoCaption] = useState('Cherished Moments');

  // Card View Mode: 'cover' (front artwork + title) or 'inside' (handwritten message spread)
  const [viewMode, setViewMode] = useState('cover');

  // Preview Modal
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Upload handler for user's design picture
  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast('Image file size must be under 8MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setCustomPhotoUrl(uploadEvent.target.result);
      showToast('Your design photo was uploaded to your card! 📸✨');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setCustomPhotoUrl(null);
    showToast('Photo removed from card design.');
  };

  // Helper to load occasion template
  const handleApplyTemplate = (occ) => {
    setOccasion(occ);
    if (MESSAGE_TEMPLATES[occ]) {
      setPersonalMessage(MESSAGE_TEMPLATES[occ]);
      setCardTitle(occ === 'Love' ? 'Always & Forever' : occ === 'Anniversary' ? 'Happy Anniversary' : `Happy ${occ}`);
      showToast(`Loaded suggested message for ${occ}! 💌`);
    }
  };

  // Toggle decoration sticker
  const handleToggleDecoration = (emoji) => {
    if (selectedDecorations.includes(emoji)) {
      setSelectedDecorations(selectedDecorations.filter(e => e !== emoji));
    } else {
      if (selectedDecorations.length >= 6) {
        showToast('Maximum 6 decorations can be placed gracefully.', 'error');
        return;
      }
      setSelectedDecorations([...selectedDecorations, emoji]);
    }
  };

  // Reset Design
  const handleReset = () => {
    setOccasion('Birthday');
    setTheme('Floral');
    setOrientation('portrait');
    setBgColor('#FAF7FD');
    setIsCustomPaperColor(false);
    setBgPattern('plain');
    setBorderStyle('deckled-gold');
    setCardTitle('Happy Birthday');
    setRecipientName('Dearest Maya');
    setPersonalMessage('Wishing you a day filled with sunshine, sweet lavender blooms, and all the magic your heart can hold.');
    setSenderName('With endless love, Ayla');
    setFontFamily("'Caveat', cursive");
    setFontSize('medium');
    setTextColor('#7041A6');
    setTextAlign('center');
    setIsBold(false);
    setIsItalic(false);
    setSelectedDecorations(['🌸', '💜', '🎀']);
    setCustomPhotoUrl('/src/assets/images/birthday_card_craft_1794160682865.jpg');
    setPhotoFrameStyle('polaroid');
    setPhotoLocation('cover');
    setPhotoCaption('Cherished Moments');
    setViewMode('cover');
    showToast('Card editor reset to fresh canvas.');
  };

  // Save to LocalStorage
  const handleSaveDesign = () => {
    const design = {
      occasion,
      theme,
      orientation,
      bgColor,
      bgPattern,
      borderStyle,
      cardTitle,
      recipientName,
      personalMessage,
      senderName,
      fontFamily,
      fontSize,
      textColor,
      textAlign,
      selectedDecorations,
      customPhotoUrl,
      photoFrameStyle,
      photoLocation,
      photoCaption,
      price: 950
    };
    saveCustomCard(design);
  };

  // Download card as PNG.
  // html2canvas may not understand modern CSS colors such as oklab()/oklch().
  // In the cloned document, inline browser-computed styles (normally RGB values)
  // and then remove stylesheets so html2canvas does not parse unsupported CSS.
  const handleDownloadImage = async () => {
    if (!previewRef.current) {
      showToast('Card preview is not ready yet.', 'error');
      return;
    }

    try {
      setIsDownloading(true);
      showToast('Preparing your high-resolution card... ✨');

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      // Wait for images inside the card preview to finish loading.
      const previewImages = Array.from(
        previewRef.current.querySelectorAll('img')
      );

      await Promise.all(
        previewImages.map((img) => {
          if (img.complete) {
            return img.decode?.().catch(() => undefined);
          }

          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: window.getComputedStyle(previewRef.current).backgroundColor || bgColor || '#FAF7FD',
        logging: false,
        onclone: (clonedDocument) => {
          const clonedCard = clonedDocument.querySelector(
            '[data-card-preview="true"]'
          );

          if (!clonedCard) return;

          // Match original and cloned elements in document order.
          const originalElements = [
            previewRef.current,
            ...previewRef.current.querySelectorAll('*')
          ];
          const clonedElements = [
            clonedCard,
            ...clonedCard.querySelectorAll('*')
          ];

          originalElements.forEach((originalElement, index) => {
            const clonedElement = clonedElements[index];
            if (!clonedElement) return;

            const computed = window.getComputedStyle(originalElement);

            // Copy computed properties as inline styles. The browser resolves
            // Tailwind oklab()/oklch() colors to ordinary computed color values.
            for (let i = 0; i < computed.length; i += 1) {
              const property = computed[i];
              if (property.startsWith('--')) continue;

              const value = computed.getPropertyValue(property);
              if (!value) continue;

              // Do not copy unsupported color syntax into the export clone.
              if (/oklab|oklch|color-mix/i.test(value)) continue;

              try {
                clonedElement.style.setProperty(
                  property,
                  value,
                  computed.getPropertyPriority(property)
                );
              } catch {
                // Ignore an individual CSS property if the browser rejects it.
              }
            }

            // Remove animation/transitions from the static exported image.
            clonedElement.style.setProperty('animation', 'none', 'important');
            clonedElement.style.setProperty('transition', 'none', 'important');
          });

          // The cloned elements now carry their computed styles inline.
          // Remove stylesheet rules that html2canvas might parse and reject.
          clonedDocument
            .querySelectorAll('style, link[rel="stylesheet"]')
            .forEach((stylesheet) => stylesheet.remove());

          // Keep the card's selected solid paper color.
          clonedCard.style.setProperty(
            'background-color',
            window.getComputedStyle(previewRef.current).backgroundColor || bgColor || '#FAF7FD',
            'important'
          );
        }
      });

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error('The browser could not create the PNG image.'));
          }
        }, 'image/png');
      });

      const safeTitle = (cardTitle || 'CustomCard')
        .trim()
        .replace(/[^a-z0-9-_]+/gi, '-')
        .replace(/-+/g, '-');

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `ArtStudio-${safeTitle || 'CustomCard'}.png`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      // Give the browser time to start the download before revoking the URL.
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1500);

      showToast('Your card PNG has been downloaded! 📥');
    } catch (error) {
      console.error('ArtStudio PNG download failed:', error);
      showToast(
        `PNG download failed: ${error?.message || 'Please check the browser console.'}`,
        'error'
      );
    } finally {
      setIsDownloading(false);
    }
  };

  // Add customized card to shopping cart
  const handleAddToCart = () => {
    const customData = {
      occasion,
      theme,
      orientation,
      bgColor,
      bgPattern,
      borderStyle,
      cardTitle,
      recipientName,
      personalMessage,
      senderName,
      fontFamily,
      fontSize,
      textColor,
      textAlign,
      selectedDecorations,
      customPhotoUrl,
      photoFrameStyle,
      photoLocation,
      photoCaption,
      price: 950
    };

    addToCart(
      {
        id: 'custom-card-' + Date.now(),
        name: `Personalized Card: ${cardTitle}`,
        price: 950,
        discountPrice: 950,
        image: customPhotoUrl || '/src/assets/images/birthday_card_craft_1794160682865.jpg'
      },
      1,
      customData
    );

    navigate('/cart');
  };

  // Border CSS helper
  const getBorderClasses = () => {
    switch (borderStyle) {
      case 'deckled-gold':
        return 'border-4 border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]';
      case 'stitched':
        return 'border-2 border-dashed border-[#C8A2E8]';
      case 'scalloped':
        return 'border-4 border-double border-[#7041A6]/40';
      default:
        return 'border border-[var(--theme-light)]';
    }
  };

  // Font size helper
  const getFontSizeClass = () => {
    if (fontSize === 'small') return 'text-sm sm:text-base';
    if (fontSize === 'large') return 'text-xl sm:text-2xl';
    return 'text-base sm:text-lg';
  };

  // Render the custom photo within the selected frame
  const renderPhotoComponent = (isInside = false) => {
    if (!customPhotoUrl) return null;

    const frameClasses = {
      polaroid: 'bg-white p-2.5 pb-4 shadow-xl shadow-black/10 rounded-sm rotate-[-1deg]',
      'gold-deckled': 'bg-white/80 p-1.5 border-2 border-[#D4AF37] shadow-lg rounded-xl',
      cameo: 'bg-white/80 p-1.5 border-2 border-[#7041A6]/60 shadow-lg rounded-full aspect-square',
      minimal: 'bg-white p-1 shadow-md rounded-xl overflow-hidden'
    };

    const imgClasses = {
      polaroid: 'w-full aspect-[4/3] object-cover rounded-xs',
      'gold-deckled': 'w-full aspect-[4/3] object-cover rounded-lg',
      cameo: 'w-full h-full object-cover rounded-full',
      minimal: 'w-full aspect-[4/3] object-cover rounded-lg'
    };

    const containerWidth = isInside ? 'max-w-[200px] mx-auto' : orientation === 'landscape' ? 'max-w-[210px]' : 'max-w-[230px] mx-auto';

    return (
      <div className={`relative my-2 ${containerWidth} transition-transform hover:scale-102`}>
        {/* Cute Lilac Washi Tape Strip at top of Polaroid */}
        {photoFrameStyle === 'polaroid' && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-[var(--theme-accent)]/70 backdrop-blur-xs rounded-xs shadow-xs z-20 rotate-[1.5deg] border-t border-b border-white/40" />
        )}

        <div className={frameClasses[photoFrameStyle] || frameClasses.polaroid}>
          <div className={photoFrameStyle === 'cameo' ? 'w-28 h-28 mx-auto' : 'w-full'}>
            <img
              src={customPhotoUrl}
              alt="Custom design"
              className={imgClasses[photoFrameStyle] || imgClasses.polaroid}
            />
          </div>

          {/* Photo Caption */}
          {photoCaption && photoFrameStyle !== 'cameo' && (
            <p className="text-center font-handwritten text-xs text-[var(--theme-text)] font-semibold mt-1.5 tracking-wide leading-none truncate px-1">
              {photoCaption}
            </p>
          )}
        </div>
      </div>
    );
  };

  const showPhotoOnCover = customPhotoUrl && (photoLocation === 'cover' || photoLocation === 'both');
  const showPhotoOnInside = customPhotoUrl && (photoLocation === 'inside' || photoLocation === 'both');

    return (
    <>
      <style>{`
        .customize-theme-surface button,
        .customize-theme-surface a,
        .customize-theme-surface input,
        .customize-theme-surface select,
        .customize-theme-surface textarea {
          transition: box-shadow .2s ease, border-color .2s ease,
            background-color .2s ease, color .2s ease, transform .2s ease;
        }
        .customize-theme-surface button:hover,
        .customize-theme-surface a:hover,
        .customize-theme-surface input:hover,
        .customize-theme-surface select:hover,
        .customize-theme-surface textarea:hover {
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--theme-primary) 15%, transparent),
            0 7px 18px color-mix(in srgb, var(--theme-primary) 22%, transparent);
        }
        .customize-theme-surface button:focus-visible,
        .customize-theme-surface a:focus-visible,
        .customize-theme-surface input:focus-visible,
        .customize-theme-surface select:focus-visible,
        .customize-theme-surface textarea:focus-visible {
          outline: 2px solid var(--theme-primary);
          outline-offset: 2px;
        }
      `}</style>
      <div className="customize-theme-surface max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      
      {/* Editor Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--theme-light)] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--theme-soft)] text-xs font-semibold text-[var(--theme-secondary)] mb-2">
            <Palette className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
            <span>Interactive Handmade Card Atelier</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--theme-text)]">
            Design Your Personalized Card
          </h1>
          <p className="text-xs sm:text-sm text-[var(--theme-muted)]">
            Personalize paper colors, handwritten calligraphy, real dried florals, and upload pictures of your design.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 text-xs font-semibold text-[var(--theme-secondary)] bg-white border border-[var(--theme-accent)] hover:bg-[var(--theme-background)] rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Design
          </button>
          <button
            onClick={handleSaveDesign}
            className="px-3.5 py-2 text-xs font-semibold text-[var(--theme-secondary)] bg-[var(--theme-soft)] hover:bg-[var(--theme-light)] rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
            Save Design
          </button>
          <button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="px-3.5 py-2 text-xs font-semibold text-[var(--theme-text)] bg-white border border-[var(--theme-accent)] hover:bg-[var(--theme-background)] rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download PNG
          </button>
          <button
            onClick={handleAddToCart}
            className="px-5 py-2 text-xs font-bold text-white bg-[var(--theme-secondary)] hover:bg-[var(--theme-primary)] rounded-xl flex items-center gap-2 transition-all shadow-md shadow-[0_6px_18px_color-mix(in_srgb,var(--theme-secondary)_25%,transparent)]"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart · PKR 950
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Left Controls (5 cols) | Right Realtime Preview (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= CONTROLS COLUMN ================= */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section 1: Occasion Selection */}
          <div className="bg-white rounded-3xl p-6 border border-[var(--theme-light)] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-[var(--theme-text)]">
                1. Choose Occasion
              </h3>
              <span className="text-[11px] text-[var(--theme-muted)]">Includes template message</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {OCCASIONS.map((occ) => (
                <button
                  key={occ}
                  onClick={() => handleApplyTemplate(occ)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all text-center truncate ${
                    occasion === occ
                      ? 'bg-[var(--theme-secondary)] text-white shadow-sm'
                      : 'bg-[var(--theme-background)] text-[var(--theme-text)] hover:bg-[var(--theme-soft)] border border-[var(--theme-light)]'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: PICTURE / PHOTO OF YOUR DESIGN (USER REQUEST FEATURE) */}
          <div className="bg-white rounded-3xl p-6 border-2 border-[var(--theme-accent)] shadow-md shadow-[var(--theme-primary)]/10 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--theme-secondary)] to-[var(--theme-primary)] text-white flex items-center justify-center shadow-xs">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[var(--theme-text)]">
                    2. Picture of Your Design
                  </h3>
                  <p className="text-[11px] text-[var(--theme-secondary)] font-medium">
                    Upload your memory photo, couple portrait, or custom artwork
                  </p>
                </div>
              </div>
              {customPhotoUrl && (
                <button
                  onClick={handleRemovePhoto}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Remove Picture"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
            </div>

            {/* Upload Zone & Actions */}
            <div className="space-y-3">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-3 px-4 bg-[var(--theme-soft)] hover:bg-[var(--theme-light)] text-[var(--theme-secondary)] border-2 border-dashed border-[var(--theme-accent)] rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  <Upload className="w-4 h-4 text-[var(--theme-secondary)]" />
                  <span>Upload Picture from Device</span>
                </button>
              </div>

              {/* Sample Photos Carousel for instant preview */}
              <div>
                <p className="text-[11px] font-semibold text-[var(--theme-muted)] mb-1.5">
                  Or select a curated memory snapshot:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {SAMPLE_PHOTOS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCustomPhotoUrl(sample.url);
                        showToast(`Selected "${sample.name}" for your card! ✨`);
                      }}
                      className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all ${
                        customPhotoUrl === sample.url
                          ? 'border-[var(--theme-secondary)] ring-2 ring-[var(--theme-secondary)]/40 scale-102'
                          : 'border-[var(--theme-light)] opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={sample.url} alt={sample.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] py-0.5 px-1 truncate text-center">
                        {sample.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Picture Options: Frame Style & Display Location */}
              {customPhotoUrl && (
                <div className="pt-3 border-t border-[var(--theme-soft)] space-y-3 animate-fadeIn">
                  
                  {/* Frame Style Selection */}
                  <div>
                    <label className="text-xs font-semibold text-[var(--theme-secondary)] block mb-1.5">
                      Photo Frame Style
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {PHOTO_FRAMES.map((frame) => (
                        <button
                          key={frame.id}
                          type="button"
                          onClick={() => setPhotoFrameStyle(frame.id)}
                          className={`p-2 rounded-xl border text-left transition-all ${
                            photoFrameStyle === frame.id
                              ? 'bg-[var(--theme-soft)] border-[var(--theme-secondary)] text-[var(--theme-secondary)] font-bold shadow-xs'
                              : 'bg-[var(--theme-background)] border-[var(--theme-light)] text-[var(--theme-text)] hover:bg-[var(--theme-soft)]'
                          }`}
                        >
                          <p className="text-xs">{frame.label}</p>
                          <p className="text-[10px] text-[var(--theme-muted)] font-normal truncate">{frame.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Display Location: Cover or Inside Fold */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--theme-secondary)] block mb-1">
                        Display Location
                      </label>
                      <select
                        value={photoLocation}
                        onChange={(e) => setPhotoLocation(e.target.value)}
                        className="w-full bg-[var(--theme-background)] border border-[var(--theme-accent)] text-xs text-[var(--theme-text)] rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                      >
                        <option value="cover">Front Cover</option>
                        <option value="inside">Inside Fold Note</option>
                        <option value="both">Both Cover & Inside</option>
                      </select>
                    </div>

                    {/* Photo Caption */}
                    <div>
                      <label className="text-xs font-semibold text-[var(--theme-secondary)] block mb-1">
                        Photo Caption
                      </label>
                      <input
                        type="text"
                        value={photoCaption}
                        onChange={(e) => setPhotoCaption(e.target.value)}
                        placeholder="e.g. Summer 2026"
                        className="w-full px-2.5 py-1.5 bg-[var(--theme-background)] border border-[var(--theme-accent)] text-xs text-[var(--theme-text)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                      />
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>

          {/* Section 3: Theme & Visual Canvas Styling */}
          <div className="bg-white rounded-3xl p-6 border border-[var(--theme-light)] shadow-sm space-y-5">
            <h3 className="font-serif text-base font-bold text-[var(--theme-text)]">
              3. Card Theme & Paper Specs
            </h3>

            {/* Themes */}
            <div>
              <label className="text-xs font-semibold text-[var(--theme-secondary)] block mb-2">
                Card Aesthetic Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border ${
                      theme === t.id
                        ? 'bg-[var(--theme-soft)] text-[var(--theme-secondary)] border-[var(--theme-secondary)] font-bold'
                        : 'bg-[var(--theme-background)] text-[var(--theme-text)] border-[var(--theme-light)] hover:bg-[var(--theme-soft)]'
                    }`}
                  >
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Paper Color Palette */}
            <div>
              <label className="text-xs font-semibold text-[var(--theme-secondary)] block mb-2">
                Background Paper Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_PALETTES.map((palette) => (
                  <button
                    key={palette.id}
                    onClick={() => { setBgColor(palette.id); setIsCustomPaperColor(true); }}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      bgColor === palette.id
                        ? 'ring-2 ring-[var(--theme-secondary)] shadow-sm'
                        : 'border-[var(--theme-light)] hover:border-[var(--theme-accent)]'
                    }`}
                    style={{ backgroundColor: palette.id }}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: palette.id }}
                    />
                    <span className="text-[10px] font-semibold text-[var(--theme-text)] truncate">
                      {palette.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Orientation & Borders */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--theme-secondary)] block mb-2">
                  Orientation
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOrientation('portrait')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border ${
                      orientation === 'portrait'
                        ? 'bg-[var(--theme-secondary)] text-white border-[var(--theme-secondary)]'
                        : 'bg-[var(--theme-background)] text-[var(--theme-text)] border-[var(--theme-light)]'
                    }`}
                  >
                    Portrait (5x7")
                  </button>
                  <button
                    onClick={() => setOrientation('landscape')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border ${
                      orientation === 'landscape'
                        ? 'bg-[var(--theme-secondary)] text-white border-[var(--theme-secondary)]'
                        : 'bg-[var(--theme-background)] text-[var(--theme-text)] border-[var(--theme-light)]'
                    }`}
                  >
                    Landscape (7x5")
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--theme-secondary)] block mb-2">
                  Handcrafted Border
                </label>
                <select
                  value={borderStyle}
                  onChange={(e) => setBorderStyle(e.target.value)}
                  className="w-full bg-[var(--theme-background)] border border-[var(--theme-accent)] text-xs text-[var(--theme-text)] rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                >
                  <option value="deckled-gold">Gold Deckled Foil</option>
                  <option value="stitched">Hand-Stitched Dash</option>
                  <option value="scalloped">Scalloped Double</option>
                  <option value="none">Clean Organic Edge</option>
                </select>
              </div>
            </div>

          </div>

          {/* Section 4: Personalized Text Customization */}
          <div className="bg-white rounded-3xl p-6 border border-[var(--theme-light)] shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-[var(--theme-text)]">
              4. Custom Inscriptions & Message
            </h3>

            {/* Title & Recipient */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[var(--theme-secondary)] block mb-1">
                  Card Cover Title
                </label>
                <input
                  type="text"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  placeholder="e.g. Happy Birthday"
                  className="w-full px-3 py-2 text-xs bg-[var(--theme-background)] border border-[var(--theme-accent)] rounded-xl text-[var(--theme-text)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--theme-secondary)] block mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Dearest Maya"
                  className="w-full px-3 py-2 text-xs bg-[var(--theme-background)] border border-[var(--theme-accent)] rounded-xl text-[var(--theme-text)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                />
              </div>
            </div>

            {/* Heartfelt Note */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-[var(--theme-secondary)]">
                  Personal Message
                </label>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate(occasion)}
                  className="text-[11px] text-[var(--theme-secondary)] hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Suggest Words
                </button>
              </div>
              <textarea
                rows={4}
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder="Write your loving words, inside joke, or heartfelt blessings..."
                className="w-full px-3 py-2 text-xs bg-[var(--theme-background)] border border-[var(--theme-accent)] rounded-xl text-[var(--theme-text)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] resize-none"
              />
            </div>

            {/* Sender Name */}
            <div>
              <label className="text-xs font-semibold text-[var(--theme-secondary)] block mb-1">
                Sender Signature
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. With all my love, Ayla"
                className="w-full px-3 py-2 text-xs bg-[var(--theme-background)] border border-[var(--theme-accent)] rounded-xl text-[var(--theme-text)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
              />
            </div>

            {/* Typography Formatting Controls */}
            <div className="pt-2 border-t border-[var(--theme-soft)] space-y-3">
              <label className="text-xs font-semibold text-[var(--theme-secondary)] block">
                Calligraphy & Typography Controls
              </label>

              {/* Font Picker */}
              <div className="grid grid-cols-3 gap-2">
                {FONTS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFontFamily(f.id)}
                    className={`py-2 px-2 text-center rounded-xl border text-xs transition-colors ${
                      fontFamily === f.id
                        ? 'bg-[var(--theme-soft)] text-[var(--theme-secondary)] border-[var(--theme-secondary)] font-bold'
                        : 'bg-[var(--theme-background)] text-[var(--theme-text)] border-[var(--theme-light)]'
                    }`}
                  >
                    <span className={f.class}>{f.name}</span>
                  </button>
                ))}
              </div>

              {/* Formatting Row: Size, Alignment, Color, Bold/Italic */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                {/* Size */}
                <div className="flex bg-[var(--theme-background)] p-1 rounded-xl border border-[var(--theme-light)] text-xs">
                  {['small', 'medium', 'large'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFontSize(s)}
                      className={`px-2.5 py-1 rounded-lg capitalize ${
                        fontSize === s ? 'bg-[var(--theme-secondary)] text-white font-bold' : 'text-[var(--theme-muted)]'
                      }`}
                    >
                      {s.charAt(0).toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Alignment */}
                <div className="flex bg-[var(--theme-background)] p-1 rounded-xl border border-[var(--theme-light)]">
                  <button
                    onClick={() => setTextAlign('left')}
                    className={`p-1.5 rounded-lg ${textAlign === 'left' ? 'bg-[var(--theme-secondary)] text-white' : 'text-[var(--theme-muted)]'}`}
                    title="Align Left"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setTextAlign('center')}
                    className={`p-1.5 rounded-lg ${textAlign === 'center' ? 'bg-[var(--theme-secondary)] text-white' : 'text-[var(--theme-muted)]'}`}
                    title="Align Center"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setTextAlign('right')}
                    className={`p-1.5 rounded-lg ${textAlign === 'right' ? 'bg-[var(--theme-secondary)] text-white' : 'text-[var(--theme-muted)]'}`}
                    title="Align Right"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Bold & Italic */}
                <div className="flex bg-[var(--theme-background)] p-1 rounded-xl border border-[var(--theme-light)]">
                  <button
                    onClick={() => setIsBold(!isBold)}
                    className={`p-1.5 rounded-lg ${isBold ? 'bg-[var(--theme-secondary)] text-white' : 'text-[var(--theme-muted)]'}`}
                    title="Toggle Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsItalic(!isItalic)}
                    className={`p-1.5 rounded-lg ${isItalic ? 'bg-[var(--theme-secondary)] text-white' : 'text-[var(--theme-muted)]'}`}
                    title="Toggle Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Text Color Swatches */}
                <div className="flex items-center gap-1.5">
                  {TEXT_COLORS.map((tc) => (
                    <button
                      key={tc.id}
                      onClick={() => setTextColor(tc.id)}
                      className={`w-6 h-6 rounded-full border transition-transform ${
                        textColor === tc.id ? 'scale-125 ring-2 ring-[var(--theme-secondary)]' : 'border-black/10'
                      }`}
                      style={{ backgroundColor: tc.id }}
                      title={tc.name}
                    />
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Section 5: Artisanal Botanical Decorations & Stickers */}
          <div className="bg-white rounded-3xl p-6 border border-[var(--theme-light)] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-[var(--theme-text)]">
                5. Pressed Florals & Stickers
              </h3>
              <span className="text-[11px] text-[var(--theme-muted)]">Click to toggle on card</span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {DECORATIONS_CATALOG.map((item) => {
                const isActive = selectedDecorations.includes(item.emoji);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggleDecoration(item.emoji)}
                    className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                      isActive
                        ? 'bg-[var(--theme-soft)] border-[var(--theme-secondary)] shadow-sm scale-105'
                        : 'bg-[var(--theme-background)] border-[var(--theme-light)] hover:bg-[var(--theme-soft)]'
                    }`}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-[10px] font-medium text-[var(--theme-text)] truncate w-full">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* ================= REAL-TIME LIVE PREVIEW COLUMN ================= */}
        <div className="lg:col-span-7 sticky top-28 space-y-4">
          
          {/* Card View Mode Selector & Inspect */}
          <div className="bg-white rounded-2xl p-3 border border-[#E9DDF7] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-1 p-1 bg-[var(--theme-background)] rounded-xl border border-[#E9DDF7]">
              <button
                onClick={() => setViewMode('cover')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  viewMode === 'cover'
                    ? 'bg-[var(--theme-secondary)] text-white shadow-sm'
                    : 'text-[var(--theme-muted)] hover:text-[var(--theme-text)]'
                }`}
              >
                <span>Front Cover</span>
              </button>
              <button
                onClick={() => setViewMode('inside')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  viewMode === 'inside'
                    ? 'bg-[#7041A6] text-white shadow-sm'
                    : 'text-[var(--theme-muted)] hover:text-[var(--theme-text)]'
                }`}
              >
                <span>Inside Fold</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
                ● Live Real-Time Preview
              </span>
              <button
                onClick={() => setShowFullPreview(true)}
                className="p-2 text-[var(--theme-secondary)] hover:bg-[var(--theme-soft)] rounded-xl transition-colors"
                title="Full Screen Inspection"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* THE TACTILE CARD CANVAS CONTAINER */}
          <div className="bg-gradient-to-b from-[var(--theme-soft)] to-[var(--theme-light)] p-6 sm:p-10 rounded-3xl border border-[var(--theme-accent)] flex items-center justify-center min-h-[560px] transition-colors duration-300">
            
            {/* The Actual Rendered Card */}
            <div
              ref={previewRef}
              data-card-preview="true"
              className={`relative transition-all duration-300 rounded-2xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-2xl ${getBorderClasses()} ${
                orientation === 'portrait'
                  ? 'w-full max-w-[420px] min-h-[530px]'
                  : 'w-full max-w-[560px] min-h-[440px]'
              }`}
              style={{
                backgroundColor: isCustomPaperColor ? bgColor : 'var(--theme-background)',
                color: textColor,
                fontFamily: fontFamily,
                fontWeight: isBold ? 'bold' : 'normal',
                fontStyle: isItalic ? 'italic' : 'normal',
                textAlign: textAlign
              }}
            >
              
              {/* Subtle Paper Texture Overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-25 mix-blend-multiply"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 50% 50%, rgba(112,65,166,0.06) 1px, transparent 1px)',
                  backgroundSize: '16px 16px'
                }}
              />

              {/* VIEW 1: FRONT COVER */}
              {viewMode === 'cover' ? (
                <>
                  {/* Top Decorative Header */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex gap-1.5 text-xl">
                      {selectedDecorations.slice(0, 2).map((emoji, i) => (
                        <span key={i} className="animate-pulse">{emoji}</span>
                      ))}
                    </div>
                    <div className="text-[11px] font-sans tracking-widest uppercase opacity-70">
                      {theme} Collection
                    </div>
                  </div>

                  {/* Central Cover Content */}
                  <div className="relative z-10 my-auto py-4 space-y-3">
                    
                    {/* Occasion Label */}
                    <div className="inline-block px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm text-xs font-sans font-bold tracking-wider uppercase shadow-xs">
                      {occasion}
                    </div>

                    {/* Main Title */}
                    <h2
                      className={`font-serif tracking-tight leading-tight ${
                        fontSize === 'large'
                          ? 'text-3xl sm:text-4xl'
                          : fontSize === 'small'
                          ? 'text-2xl sm:text-3xl'
                          : 'text-3xl sm:text-3xl'
                      }`}
                    >
                      {cardTitle || 'A Special Greeting'}
                    </h2>

                    {/* Recipient Ribbon */}
                    <p className={`font-medium ${getFontSizeClass()} opacity-90`}>
                      {recipientName ? `For ${recipientName}` : 'For Someone Special'}
                    </p>

                    {/* PICTURE OF YOUR DESIGN (FRONT COVER DISPLAY) */}
                    {showPhotoOnCover && renderPhotoComponent(false)}

                    {/* Central Botanical Stamp if flowers/butterflies selected */}
                    <div className="flex justify-center gap-3 text-2xl py-1">
                      {selectedDecorations.map((emoji, idx) => (
                        <span key={idx} className="drop-shadow-xs hover:scale-125 transition-transform cursor-pointer">
                          {emoji}
                        </span>
                      ))}
                    </div>

                  </div>

                  {/* Bottom Footer Note on Cover */}
                  <div className="relative z-10 border-t border-black/10 pt-3 flex items-center justify-between text-xs font-sans opacity-70">
                    <span>ArtStudio Keepsake</span>
                    <span>Handmade with Love</span>
                  </div>
                </>
              ) : (
                /* VIEW 2: INSIDE FOLD MESSAGE */
                <>
                  {/* Inside Header */}
                  <div className="relative z-10 text-left border-b border-black/10 pb-3">
                    <p className="text-xs font-sans uppercase tracking-wider opacity-60">
                      To My Favorite Person
                    </p>
                    <h3 className="text-xl font-serif font-bold mt-1">
                      {recipientName || 'Dear Friend'},
                    </h3>
                  </div>

                  {/* Inside Main Message Body & Embedded Picture */}
                  <div className="relative z-10 my-auto py-4 space-y-3">
                    {/* PICTURE OF YOUR DESIGN (INSIDE FOLD DISPLAY) */}
                    {showPhotoOnInside && renderPhotoComponent(true)}

                    <p className={`leading-relaxed whitespace-pre-line ${getFontSizeClass()}`}>
                      {personalMessage || 'Write your personal sentiment here...'}
                    </p>
                  </div>

                  {/* Inside Signature & Cute Stamps */}
                  <div className="relative z-10 pt-4 flex items-end justify-between border-t border-black/10">
                    <div className="flex gap-1 text-xl">
                      {selectedDecorations.map((emoji, i) => (
                        <span key={i}>{emoji}</span>
                      ))}
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-sans opacity-70">Always,</p>
                      <p className={`font-serif font-bold text-lg leading-tight mt-0.5`}>
                        {senderName || 'Your Name'}
                      </p>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>

          {/* Quick Specifications Strip */}
          <div className="bg-white rounded-2xl p-4 border border-[#E9DDF7] flex flex-wrap items-center justify-between text-xs text-[#81758F] gap-3">
            <div>
              <span className="font-semibold text-[#40334F]">Dimensions:</span>{' '}
              {orientation === 'portrait' ? '5.0" x 7.0" (A7 standard)' : '7.0" x 5.0" (Landscape)'}
            </div>
            <div>
              <span className="font-semibold text-[#40334F]">Custom Photo:</span>{' '}
              {customPhotoUrl ? (
                <span className="text-emerald-700 font-bold">Attached ({photoFrameStyle})</span>
              ) : (
                'None attached'
              )}
            </div>
            <div>
              <span className="font-semibold text-[#40334F]">Cardstock:</span> 350 GSM Cotton Rag
            </div>
          </div>

          {/* Direct CTA */}
          <div className="pt-2 flex gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 bg-[var(--theme-secondary)] hover:bg-[var(--theme-primary)] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[var(--theme-secondary)]/20 flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              <ShoppingBag className="w-4 h-4" />
              Add This Personalized Card to Cart (PKR 950)
            </button>
          </div>

        </div>

      </div>

      {/* FULL SCREEN INSPECTION MODAL */}
      {showFullPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#E9DDF7] shadow-2xl space-y-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F3ECFA] pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#40334F]">
                  Card Inspection View
                </h3>
                <p className="text-xs text-[#81758F]">Viewing {viewMode === 'cover' ? 'Front Cover' : 'Inside Spread'}</p>
              </div>
              <button
                onClick={() => setShowFullPreview(false)}
                className="p-1.5 rounded-full hover:bg-[#FAF7FD] text-[#81758F] hover:text-[#40334F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center p-4 bg-[#FAF7FD] rounded-2xl">
              <div
                className={`p-8 rounded-2xl shadow-xl ${getBorderClasses()} ${
                  orientation === 'portrait' ? 'w-[320px] min-h-[460px]' : 'w-[440px] min-h-[380px]'
                }`}
                style={{
                  backgroundColor: isCustomPaperColor ? bgColor : 'var(--theme-background)',
                  color: textColor,
                  fontFamily: fontFamily,
                  textAlign: textAlign,
                  fontWeight: isBold ? 'bold' : 'normal',
                  fontStyle: isItalic ? 'italic' : 'normal'
                }}
              >
                {viewMode === 'cover' ? (
                  <div className="h-full flex flex-col justify-between space-y-4">
                    <div className="flex justify-between text-xl">
                      <span>{selectedDecorations[0] || '🌸'}</span>
                      <span>{selectedDecorations[1] || '💜'}</span>
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="font-serif text-2xl font-bold">{cardTitle}</h3>
                      <p className="text-base">{recipientName}</p>
                      {showPhotoOnCover && renderPhotoComponent(false)}
                      <div className="text-2xl">{selectedDecorations.join(' ')}</div>
                    </div>
                    <p className="text-[10px] uppercase tracking-wider text-center opacity-70">
                      ArtStudio Handmade Card
                    </p>
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-between text-left space-y-3">
                    <p className="font-serif font-bold text-lg">{recipientName},</p>
                    {showPhotoOnInside && renderPhotoComponent(true)}
                    <p className="text-sm leading-relaxed whitespace-pre-line my-auto">
                      {personalMessage}
                    </p>
                    <p className="text-right font-serif font-semibold text-base">{senderName}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setViewMode(viewMode === 'cover' ? 'inside' : 'cover')}
                className="px-4 py-2 border border-[var(--theme-accent)] text-[var(--theme-secondary)] rounded-xl text-xs font-semibold"
              >
                Flip to {viewMode === 'cover' ? 'Inside Note' : 'Front Cover'}
              </button>
              <button
                onClick={() => setShowFullPreview(false)}
                className="px-5 py-2 bg-[#7041A6] text-white rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </>
  );
}