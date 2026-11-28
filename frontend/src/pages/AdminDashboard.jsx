
import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { CATEGORIES, THEMES } from '../data/cardsData.js';
import CMSDashboard from './CMSDashboard.jsx';

import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  X,
  Settings,
  Save,
  Globe,
  Palette
} from 'lucide-react';

import {
  THEMES as COLOR_THEMES,
  applyTheme,
  saveTheme
} from '../utils/theme.js';

const API_URL = 'https://art-studio-l9mr.vercel.app/api/store-settings';

const DEFAULT_FORM = {
  name: '',
  category: 'Birthday',
  price: '950',
  discountPrice: '',
  description: '',
  dimensions: '5" x 7" (Standard A7)',
  paperType: '350 GSM Cotton Rag Deckled Paper',
  envelope: 'Pastel Lilac Textured Envelope with Wax Seal',
  stock: 20,
  theme: 'Floral',
  image: '',
  isBestseller: false,
  isNew: true
};

export default function AdminDashboard() {
  const {
    products,
    productsLoading,
    orders,
    customerCount = 0,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    showToast,
    user,
    changeAdminEmail,
    changePassword
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');

  // Website theme customization
  const [selectedTheme, setSelectedTheme] = useState('Light Pink');
  const [customColors, setCustomColors] = useState({
    ...COLOR_THEMES['Light Pink']
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('artstudio-theme');

    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        const colors = parsedTheme.colors || COLOR_THEMES['Light Pink'];

        setSelectedTheme(parsedTheme.name || 'Custom');
        setCustomColors(colors);
        applyTheme(colors);
      } catch (error) {
        console.error('Could not load saved theme:', error);
        applyTheme(COLOR_THEMES['Light Pink']);
      }
    } else {
      applyTheme(COLOR_THEMES['Light Pink']);
    }
  }, []);

  const handleThemeSelect = (name) => {
    const colors = { ...COLOR_THEMES[name] };
    setSelectedTheme(name);
    setCustomColors(colors);
    applyTheme(colors);
  };

  const handleCustomColorChange = (key, value) => {
    setSelectedTheme('Custom');
    setCustomColors(current => {
      const updatedColors = { ...current, [key]: value };
      applyTheme(updatedColors);
      return updatedColors;
    });
  };

  const handleThemeSave = () => {
    saveTheme(selectedTheme, customColors);
    showToast('Website theme saved successfully!');
  };
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  // Website settings
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');
  const [settingsError, setSettingsError] = useState('');

  // Admin login account settings
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    currentPassword: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountMessage, setAccountMessage] = useState('');
  const [accountError, setAccountError] = useState('');

  const [settingsForm, setSettingsForm] = useState({
    email: '',
    phone: '',
    address: '',
    workingHours: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    pinterest: '',
    youtube: '',
    storeName: 'ArtStudio',
    tagline: 'Handmade & Customized',
    announcement: ''
  });

  // Product form
  const [cardForm, setCardForm] = useState(DEFAULT_FORM);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submittingProduct, setSubmittingProduct] = useState(false);

  // Load website settings
  useEffect(() => {
    if (activeTab !== 'settings') return;

    const loadSettings = async () => {
      setSettingsLoading(true);
      setSettingsError('');

      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Could not load website settings.');
        }

        setSettingsForm(current => ({
          ...current,
          ...data.settings
        }));
      } catch (error) {
        setSettingsError(error.message);
      } finally {
        setSettingsLoading(false);
      }
    };

    loadSettings();
  }, [activeTab]);

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;

    setSettingsForm(current => ({
      ...current,
      [name]: value
    }));
  };

  const handleSettingsSave = async (e) => {
    e.preventDefault();

    setSettingsMessage('');
    setSettingsError('');
    setSettingsSaving(true);

    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settingsForm)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Could not save settings.');
      }

      setSettingsForm(current => ({
        ...current,
        ...data.settings
      }));

      setSettingsMessage('Website settings saved successfully!');
      showToast('Website settings updated successfully!');
    } catch (error) {
      setSettingsError(error.message || 'Unable to save website settings.');
    } finally {
      setSettingsSaving(false);
    }
  };


  // Update the email used for Admin Login.
  const handleAdminEmailChange = async (e) => {
    e.preventDefault();
    setAccountMessage('');
    setAccountError('');

    const normalizedEmail = emailForm.newEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      setAccountError('Please enter your new login email.');
      return;
    }
    if (!emailForm.currentPassword) {
      setAccountError('Please enter your current password to confirm this change.');
      return;
    }

    setAccountSaving(true);
    const result = await changeAdminEmail(
      normalizedEmail,
      emailForm.currentPassword
    );
    setAccountSaving(false);

    if (result?.success) {
      setEmailForm({ newEmail: '', currentPassword: '' });
      setAccountMessage('Login email updated. Use the new email next time you sign in.');
    } else {
      setAccountError(result?.message || 'Could not update login email.');
    }
  };

  // Update the admin password in MongoDB.
  const handleAdminPasswordChange = async (e) => {
    e.preventDefault();
    setAccountMessage('');
    setAccountError('');

    if (passwordForm.newPassword.length < 8 || passwordForm.newPassword.length > 72) {
      setAccountError('New password must contain 8 to 72 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setAccountError('New password and confirmation do not match.');
      return;
    }

    setAccountSaving(true);
    const result = await changePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword
    );
    setAccountSaving(false);

    if (result?.success) {
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setAccountMessage('Password updated successfully. Use the new password next time you sign in.');
    } else {
      setAccountError(result?.message || 'Could not update password.');
    }
  };

  // Dashboard metrics
  // Statistics are calculated from real database data.
  // Cancelled orders are not included in revenue.
  const totalRevenue = orders
    .filter(order => order.status !== 'Cancelled')
    .reduce(
      (total, order) => total + Number(order.total || 0),
      0
    );

  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const totalCustomersCount = Number(customerCount) || 0;

  // Reset product form
  const resetProductForm = () => {
    setCardForm({ ...DEFAULT_FORM });
    setSelectedImage(null);
    setImagePreview('');
    setEditingCard(null);
  };

  // Open Add Product modal
  const handleOpenAdd = () => {
    resetProductForm();
    setShowAddModal(true);
  };

  // Open Edit Product modal
  const handleOpenEdit = (card) => {
    setEditingCard(card);

    setCardForm({
      name: card.name || '',
      category: card.category || 'Birthday',
      price: String(card.price ?? ''),
      discountPrice: card.discountPrice
        ? String(card.discountPrice)
        : '',
      description: card.description || '',
      dimensions: card.dimensions || '5" x 7"',
      paperType: card.paperType || '350 GSM Cotton Cardstock',
      envelope: card.envelope || 'Lilac Envelope',
      stock: String(card.stock ?? 20),
      theme: card.theme || 'Floral',
      image: card.image || '',
      isBestseller: Boolean(card.isBestseller),
      isNew: Boolean(card.isNew)
    });

    setSelectedImage(null);
    setImagePreview(card.image || '');
    setShowAddModal(true);
  };

  // Select image from computer
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
      showToast('Please select a JPG, PNG, or WEBP image.', 'error');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be 5 MB or less.', 'error');
      e.target.value = '';
      return;
    }

    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // Add or update product
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!cardForm.name.trim() || !cardForm.price) {
      showToast('Please provide product title and price.', 'error');
      return;
    }

    if (!editingCard && !selectedImage) {
      showToast('Please select a product photo from your computer.', 'error');
      return;
    }

    const price = Number(cardForm.price);
    const discountPrice = cardForm.discountPrice
      ? Number(cardForm.discountPrice)
      : null;
    const stock = Number(cardForm.stock);

    if (!Number.isFinite(price) || price <= 0) {
      showToast('Enter a valid product price.', 'error');
      return;
    }

    if (
      discountPrice !== null &&
      (!Number.isFinite(discountPrice) ||
        discountPrice <= 0 ||
        discountPrice >= price)
    ) {
      showToast('Discount price must be less than the standard price.', 'error');
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      showToast('Enter a valid stock quantity.', 'error');
      return;
    }

    const productData = {
      ...cardForm,
      price,
      discountPrice,
      stock,
      imageFile: selectedImage || undefined
    };

    setSubmittingProduct(true);

    try {
      let result;

      if (editingCard) {
        result = await updateProduct(
          editingCard.id,
          productData
        );
      } else {
        result = await addProduct(productData);
      }

      if (result?.success) {
        setShowAddModal(false);
        resetProductForm();
      }
    } catch (error) {
      showToast(error.message || 'Unable to save product.', 'error');
    } finally {
      setSubmittingProduct(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    await deleteProduct(productId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E9DDF7] pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3ECFA] text-xs font-semibold text-[#7041A6] mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ArtStudio Management Portal</span>
          </div>

          <h1 className="font-serif text-3xl font-bold text-[#40334F]">
            Atelier Admin Dashboard
          </h1>

          <p className="text-xs text-[#81758F]">
            Manage products, orders, inventory, and website content.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#7041A6] hover:bg-[#9B72CF] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Handmade Card
        </button>
      </div>

      {/* Dashboard Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white rounded-2xl p-5 border border-[#E9DDF7] shadow-sm">
          <p className="text-xs text-[#81758F]">Total Revenue</p>
          <p className="font-serif text-2xl font-bold text-[#40334F] mt-2">
            PKR {totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E9DDF7] shadow-sm">
          <p className="text-xs text-[#81758F]">Total Orders</p>
          <p className="font-serif text-2xl font-bold text-[#40334F] mt-2">
            {totalOrdersCount}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E9DDF7] shadow-sm">
          <p className="text-xs text-[#81758F]">Product Catalog</p>
          <p className="font-serif text-2xl font-bold text-[#40334F] mt-2">
            {totalProductsCount}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E9DDF7] shadow-sm">
          <p className="text-xs text-[#81758F]">Registered Customers</p>
          <p className="font-serif text-2xl font-bold text-[#40334F] mt-2">
            {totalCustomersCount}
          </p>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap border-b border-[#E9DDF7] gap-6 text-sm font-semibold">

        {[
          ['overview', 'Overview'],
          ['products', `Manage Cards (${products.length})`],
          ['orders', `Manage Orders (${orders.length})`],
          ['settings', 'Website Settings'],
          ['account', 'Account Settings'],
          ['theme', 'Theme Customization'],
          ['cms', 'Website CMS']
        ].map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 relative ${
              activeTab === tab
                ? 'text-[#7041A6]'
                : 'text-[#81758F] hover:text-[#40334F]'
            }`}
          >
            {tab === 'settings' && (
              <Settings className="w-4 h-4 inline mr-1" />
            )}

            {tab === 'account' && (
              <ShieldCheck className="w-4 h-4 inline mr-1" />
            )}

            {tab === 'theme' && (
              <Palette className="w-4 h-4 inline mr-1" />
            )}

            {tab === 'cms' && (
              <Globe className="w-4 h-4 inline mr-1" />
            )}

            {label}

            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7041A6]" />
            )}
          </button>
        ))}

      </div>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <div className="bg-white rounded-3xl p-6 border border-[#E9DDF7] shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-lg font-bold text-[#40334F]">
                Recent Studio Orders
              </h3>

              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-semibold text-[#7041A6]"
              >
                View All
              </button>
            </div>

            {orders.length === 0 ? (
              <p className="text-sm text-[#81758F]">No orders available yet.</p>
            ) : (
              orders.slice(0, 5).map(order => (
                <div
                  key={order.id}
                  className="py-3 border-b border-[#F3ECFA] flex justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-[#40334F]">{order.id}</p>
                    <p className="text-[#81758F] mt-1">{order.date}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-[#7041A6]">
                      PKR {Number(order.total || 0).toLocaleString()}
                    </p>
                    <p className="text-[#81758F] mt-1">{order.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E9DDF7] shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#40334F] mb-4">
              Product Catalog
            </h3>

            {products.slice(0, 5).map(product => (
              <div
                key={product.id}
                className="py-3 border-b border-[#F3ECFA] flex items-center gap-3"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#40334F] truncate">
                    {product.name}
                  </p>
                  <p className="text-[11px] text-[#81758F]">
                    {product.category} · Stock: {product.stock}
                  </p>
                </div>

                <p className="text-xs font-bold text-[#7041A6]">
                  PKR {Number(product.discountPrice || product.price).toLocaleString()}
                </p>
              </div>
            ))}

            {products.length === 0 && (
              <p className="text-sm text-[#81758F]">
                No products have been added yet.
              </p>
            )}
          </div>

        </div>
      )}

      {/* PRODUCTS */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E9DDF7] shadow-sm space-y-4">

          <div className="flex flex-wrap justify-between items-center gap-3">
            <h3 className="font-serif text-lg font-bold text-[#40334F]">
              All Card Inventory
            </h3>

            <button
              onClick={handleOpenAdd}
              className="px-3 py-2 bg-[#7041A6] text-white text-xs font-bold rounded-xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Card
            </button>
          </div>

          {productsLoading ? (
            <p className="text-sm text-[#81758F]">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-[#81758F]">
              No products in MongoDB yet. Click Add Card to create your first product.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#40334F]">
                <thead className="bg-[#FAF7FD] text-[#7041A6] uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F3ECFA]">
                  {products.map(card => (
                    <tr key={card.id}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={card.image}
                            alt={card.name}
                            className="w-11 h-11 rounded-xl object-cover"
                          />
                          <span className="font-semibold">{card.name}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">{card.category}</td>

                      <td className="py-3 px-4 font-bold">
                        PKR {Number(card.discountPrice || card.price).toLocaleString()}
                      </td>

                      <td className="py-3 px-4">{card.stock}</td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEdit(card)}
                          className="p-2 text-[#7041A6] hover:bg-[#F3ECFA] rounded-lg"
                          title="Edit product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(card.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E9DDF7] shadow-sm space-y-4">

          <h3 className="font-serif text-lg font-bold text-[#40334F]">
            Order Management
          </h3>

          {orders.length === 0 ? (
            <p className="text-sm text-[#81758F]">No orders available yet.</p>
          ) : (
            orders.map(order => (
              <div
                key={order.id}
                className="p-5 rounded-2xl border border-[#E9DDF7] bg-[#FAF7FD] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <p className="font-bold text-[#7041A6] text-sm">
                    {order.id}
                  </p>

                  <p className="text-[#81758F] mt-1">{order.date}</p>

                  <p className="mt-2">
                    Amount: PKR {Number(order.total || 0).toLocaleString()}
                  </p>

                  <p className="mt-1">
                    Customer: {order.shippingDetails?.fullName || 'Customer'}
                  </p>

                  <p className="mt-1 text-[#81758F]">
                    {order.shippingDetails?.address || ''}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <label className="font-semibold text-[#81758F]">
                    Status:
                  </label>

                  <select
                    value={order.status}
                    onChange={e => updateOrderStatus(order.id, e.target.value)}
                    className="bg-white border border-[#C8A2E8] text-xs font-semibold text-[#7041A6] rounded-xl px-3 py-2"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))
          )}

        </div>
      )}

      {/* WEBSITE SETTINGS */}
      {activeTab === 'settings' && (
        <form
          onSubmit={handleSettingsSave}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9DDF7] shadow-sm space-y-7"
        >

          <div>
            <h3 className="font-serif text-xl font-bold text-[#40334F]">
              Website Settings
            </h3>

            <p className="text-xs text-[#81758F] mt-1">
              Manage your store contact details, social accounts, and branding.
            </p>
          </div>

          {settingsLoading && (
            <p className="text-sm text-[#7041A6]">Loading settings...</p>
          )}

          {settingsError && (
            <p className="text-xs text-rose-600 bg-rose-50 rounded-xl p-3">
              {settingsError}
            </p>
          )}

          {settingsMessage && (
            <p className="text-xs text-emerald-700 bg-emerald-50 rounded-xl p-3">
              {settingsMessage}
            </p>
          )}

          <section className="space-y-4">
            <h4 className="font-bold text-sm text-[#7041A6]">
              Store Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['email', 'Contact Email', 'email'],
                ['phone', 'Phone / WhatsApp', 'text'],
                ['address', 'Studio Address', 'text'],
                ['workingHours', 'Working Hours', 'text']
              ].map(([name, label, type]) => (
                <label
                  key={name}
                  className="text-xs font-semibold text-[#7041A6] space-y-1"
                >
                  {label}

                  <input
                    name={name}
                    type={type}
                    value={settingsForm[name] || ''}
                    onChange={handleSettingsChange}
                    required
                    className="w-full px-3 py-2.5 bg-[#FAF7FD] border border-[#C8A2E8] rounded-xl text-[#40334F] font-normal"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="space-y-4 border-t border-[#F3ECFA] pt-6">
            <h4 className="font-bold text-sm text-[#7041A6]">
              Social Media Accounts
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['instagram', 'Instagram URL'],
                ['facebook', 'Facebook URL'],
                ['tiktok', 'TikTok URL'],
                ['pinterest', 'Pinterest URL'],
                ['youtube', 'YouTube URL']
              ].map(([name, label]) => (
                <label
                  key={name}
                  className="text-xs font-semibold text-[#7041A6] space-y-1"
                >
                  {label}

                  <input
                    name={name}
                    type="url"
                    value={settingsForm[name] || ''}
                    onChange={handleSettingsChange}
                    placeholder="https://"
                    className="w-full px-3 py-2.5 bg-[#FAF7FD] border border-[#C8A2E8] rounded-xl text-[#40334F] font-normal"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="space-y-4 border-t border-[#F3ECFA] pt-6">
            <h4 className="font-bold text-sm text-[#7041A6]">
              Website Branding
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="text-xs font-semibold text-[#7041A6] space-y-1">
                Store Name

                <input
                  name="storeName"
                  value={settingsForm.storeName || ''}
                  onChange={handleSettingsChange}
                  required
                  className="w-full px-3 py-2.5 bg-[#FAF7FD] border border-[#C8A2E8] rounded-xl text-[#40334F] font-normal"
                />
              </label>

              <label className="text-xs font-semibold text-[#7041A6] space-y-1">
                Tagline

                <input
                  name="tagline"
                  value={settingsForm.tagline || ''}
                  onChange={handleSettingsChange}
                  className="w-full px-3 py-2.5 bg-[#FAF7FD] border border-[#C8A2E8] rounded-xl text-[#40334F] font-normal"
                />
              </label>
            </div>

            <label className="block text-xs font-semibold text-[#7041A6] space-y-1">
              Announcement Banner

              <input
                name="announcement"
                value={settingsForm.announcement || ''}
                onChange={handleSettingsChange}
                placeholder="Free delivery on orders above PKR 3000"
                className="w-full px-3 py-2.5 bg-[#FAF7FD] border border-[#C8A2E8] rounded-xl text-[#40334F] font-normal"
              />
            </label>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={settingsSaving || settingsLoading}
              className="px-6 py-3 bg-[#7041A6] hover:bg-[#9B72CF] disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {settingsSaving ? 'Saving...' : 'Save Website Settings'}
            </button>
          </div>

        </form>
      )}


      {/* ADMIN ACCOUNT SETTINGS */}
      {activeTab === 'account' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9DDF7] shadow-sm space-y-5">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#40334F]">
                Admin Login Email
              </h3>
              <p className="text-xs text-[#81758F] mt-1">
                Change the email address you use to sign in to the Admin Dashboard.
              </p>
            </div>

            <div className="rounded-xl bg-[#FAF7FD] border border-[#E9DDF7] p-4">
              <p className="text-[11px] text-[#81758F]">Current login email</p>
              <p className="text-sm font-semibold text-[#40334F] break-all">
                {user?.email || 'Not available'}
              </p>
            </div>

            <form onSubmit={handleAdminEmailChange} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#7041A6] mb-2">
                  New login email
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={emailForm.newEmail}
                  onChange={(e) => setEmailForm(current => ({
                    ...current,
                    newEmail: e.target.value
                  }))}
                  placeholder="yournewemail@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-[#C8A2E8] bg-[#FAF7FD] text-sm text-[#40334F] focus:outline-none focus:ring-2 focus:ring-[#9B72CF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7041A6] mb-2">
                  Current password
                </label>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={emailForm.currentPassword}
                  onChange={(e) => setEmailForm(current => ({
                    ...current,
                    currentPassword: e.target.value
                  }))}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 rounded-xl border border-[#C8A2E8] bg-[#FAF7FD] text-sm text-[#40334F] focus:outline-none focus:ring-2 focus:ring-[#9B72CF]"
                />
              </div>

              <button
                type="submit"
                disabled={accountSaving}
                className="w-full px-5 py-3 rounded-xl bg-[#7041A6] hover:bg-[#9B72CF] disabled:opacity-60 text-white text-sm font-bold"
              >
                {accountSaving ? 'Saving...' : 'Update Login Email'}
              </button>
            </form>
          </section>

          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9DDF7] shadow-sm space-y-5">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#40334F]">
                Change Admin Password
              </h3>
              <p className="text-xs text-[#81758F] mt-1">
                Choose a new password. At least 8 characters are required.
              </p>
            </div>

            <form onSubmit={handleAdminPasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#7041A6] mb-2">
                  Current password
                </label>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(current => ({
                    ...current,
                    currentPassword: e.target.value
                  }))}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 rounded-xl border border-[#C8A2E8] bg-[#FAF7FD] text-sm text-[#40334F] focus:outline-none focus:ring-2 focus:ring-[#9B72CF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7041A6] mb-2">
                  New password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(current => ({
                    ...current,
                    newPassword: e.target.value
                  }))}
                  placeholder="Create a new password"
                  className="w-full px-4 py-3 rounded-xl border border-[#C8A2E8] bg-[#FAF7FD] text-sm text-[#40334F] focus:outline-none focus:ring-2 focus:ring-[#9B72CF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7041A6] mb-2">
                  Confirm new password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(current => ({
                    ...current,
                    confirmPassword: e.target.value
                  }))}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-3 rounded-xl border border-[#C8A2E8] bg-[#FAF7FD] text-sm text-[#40334F] focus:outline-none focus:ring-2 focus:ring-[#9B72CF]"
                />
              </div>

              <button
                type="submit"
                disabled={accountSaving}
                className="w-full px-5 py-3 rounded-xl bg-[#7041A6] hover:bg-[#9B72CF] disabled:opacity-60 text-white text-sm font-bold"
              >
                {accountSaving ? 'Saving...' : 'Update Password'}
              </button>
            </form>
          </section>

          {(accountMessage || accountError) && (
            <div className={`lg:col-span-2 rounded-xl p-4 text-sm ${
              accountError
                ? 'bg-rose-50 text-rose-700 border border-rose-100'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            }`}>
              {accountError || accountMessage}
            </div>
          )}

          <p className="lg:col-span-2 text-[11px] text-[#81758F]">
            For security, your current password is required before changing your login email or password.
            Keep your new login details private.
          </p>
        </div>
      )}

      {/* THEME CUSTOMIZATION */}
      {activeTab === 'theme' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9DDF7] shadow-sm space-y-8">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#40334F]">
              Website Theme Customization
            </h3>
            <p className="text-xs text-[#81758F] mt-1">
              Choose a preset palette or customize each website color.
            </p>
          </div>

          <section className="space-y-4">
            <div>
              <h4 className="font-bold text-sm text-[#7041A6]">Choose a Preset Theme</h4>
              <p className="text-[11px] text-[#81758F] mt-1">Select a palette to preview it on this website.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(COLOR_THEMES).map(([name, colors]) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => handleThemeSelect(name)}
                  className={`text-left rounded-2xl border-2 p-3 transition ${
                    selectedTheme === name
                      ? 'border-[#7041A6] shadow-md'
                      : 'border-[#E9DDF7] hover:border-[#C8A2E8]'
                  }`}
                >
                  <div className="flex h-9 overflow-hidden rounded-lg mb-3">
                    {[colors.primary, colors.secondary, colors.accent, colors.background].map((color, index) => (
                      <span key={index} className="flex-1" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#40334F]">{name}</span>
                  {selectedTheme === name && (
                    <span className="block text-[10px] text-[#7041A6] mt-1">Selected</span>
                  )}
                </button>
              ))}
            </div>
          </section>

          <section className="border-t border-[#F3ECFA] pt-6 space-y-4">
            <div>
              <h4 className="font-bold text-sm text-[#7041A6]">Custom Colors</h4>
              <p className="text-[11px] text-[#81758F] mt-1">Use the color pickers to create your own palette.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                ['primary', 'Primary Color'],
                ['secondary', 'Secondary Color'],
                ['accent', 'Accent Color'],
                ['light', 'Light Color'],
                ['soft', 'Soft Background'],
                ['background', 'Page Background'],
                ['text', 'Main Text'],
                ['muted', 'Muted Text']
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 rounded-xl border border-[#E9DDF7] p-3">
                  <input
                    type="color"
                    value={customColors[key]}
                    onChange={event => handleCustomColorChange(key, event.target.value)}
                    className="w-11 h-11 rounded-lg cursor-pointer border-0 bg-transparent"
                    aria-label={label}
                  />
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold text-[#40334F]">{label}</span>
                    <span className="block text-[11px] text-[#81758F] uppercase">{customColors[key]}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <div className="rounded-2xl border border-[#E9DDF7] p-4" style={{ backgroundColor: customColors.background, color: customColors.text }}>
            <p className="text-xs font-semibold mb-2" style={{ color: customColors.secondary }}>LIVE PREVIEW</p>
            <h4 className="font-serif text-xl font-bold">A little handmade happiness</h4>
            <p className="text-xs mt-1" style={{ color: customColors.muted }}>Your selected colors will be previewed here.</p>
            <span className="inline-block mt-3 px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: customColors.primary }}>
              Preview Button
            </span>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-3 border-t border-[#F3ECFA] pt-5">
            <p className="text-[11px] text-[#81758F]">Selected palette: <strong>{selectedTheme}</strong></p>
            <button
              type="button"
              onClick={handleThemeSave}
              className="px-6 py-3 bg-[#7041A6] hover:bg-[#9B72CF] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Theme
            </button>
          </div>
          <p className="text-[11px] text-[#927582]">
            Note: This version saves the theme in this browser only. Shared theme settings for all visitors require a backend connection.
          </p>
        </div>
      )}

      {/* WEBSITE CMS */}
      {activeTab === 'cms' && (
        <CMSDashboard />
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E9DDF7] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center border-b border-[#F3ECFA] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#40334F]">
                {editingCard ? 'Edit Handmade Card' : 'Add New Card to Shop'}
              </h3>

              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  resetProductForm();
                }}
                className="p-1 text-[#81758F] hover:text-[#40334F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="space-y-4 text-xs"
            >

              {/* Product Name */}
              <div>
                <label className="font-semibold text-[#7041A6] block mb-1">
                  Card Title *
                </label>

                <input
                  type="text"
                  required
                  value={cardForm.name}
                  onChange={e =>
                    setCardForm({ ...cardForm, name: e.target.value })
                  }
                  placeholder="e.g. Purple Iris Botanical Keepsake"
                  className="w-full px-3 py-2 bg-[#FAF7FD] border border-[#C8A2E8] rounded-xl text-[#40334F]"
                />
              </div>

              {/* Category and Theme */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="font-semibold text-[#7041A6] block mb-1">
                    Occasion / Category
                  </label>

                  <select
                    value={cardForm.category}
                    onChange={e =>
                      setCardForm({ ...cardForm, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#FAF7FD] border border-[#C8A2E8] rounded-xl text-[#40334F]"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#7041A6] block mb-1">
                    Theme
                  </label>

                  <select
                    value={cardForm.theme}
                    onChange={e =>
                      setCardForm({ ...cardForm, theme: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#FAF7FD] border border-[#C8A2E8] rounded-xl text-[#40334F]"
                  >
                    {THEMES.filter(t => t !== 'All').map(theme => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Prices and Stock */}
              <div className="grid grid-cols-3 gap-3">

                <div>
                  <label className="font-semibold text-[#7041A6] block mb-1">
                    Standard Price *
                  </label>

                  <input
                    type="number"
                    min="1"
                    required
                    value={cardForm.price}
                    onChange={e =>
                      setCardForm({ ...cardForm, price: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#FAF7FD] border border-[#C8A2E8] rounded-xl text-[#40334F]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#7041A6] block mb-1">
                    Discount Price
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={cardForm.discountPrice}
                    onChange={e =>
                      setCardForm({ ...cardForm, discountPrice: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#FAF7FD] border border-[#C8A2E8] rounded-xl text-[#40334F]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#7041A6] block mb-1">
                    Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={cardForm.stock}
                    onChange={e =>
                      setCardForm({ ...cardForm, stock: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#FAF7FD] border border-[#C8A2E8] rounded-xl text-[#40334F]"
                  />
                </div>

              </div>

              {/* Description */}
              <div>
                <label className="font-semibold text-[#7041A6] block mb-1">
                  Description
                </label>

                <textarea
                  rows={3}
                  value={cardForm.description}
                  onChange={e =>
                    setCardForm({ ...cardForm, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#FAF7FD] border border-[#C8A2E8] rounded-xl text-[#40334F] resize-none"
                />
              </div>

              {/* Product Image Upload */}
              <div>
                <label className="font-semibold text-[#7041A6] block mb-2">
                  Product Photo *
                </label>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="w-full px-3 py-3 bg-[#FAF7FD] border border-[#C8A2E8] rounded-xl text-[#40334F]"
                />

                <p className="text-[10px] text-[#81758F] mt-1">
                  JPG, PNG or WEBP. Maximum file size: 5 MB.
                </p>

                {imagePreview && (
                  <div className="mt-3">
                    <p className="font-semibold text-[#7041A6] mb-2">
                      Image Preview
                    </p>

                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-40 h-40 object-cover rounded-xl border border-[#E9DDF7]"
                    />
                  </div>
                )}

                {editingCard && !selectedImage && (
                  <p className="text-[10px] text-[#81758F] mt-2">
                    No new image selected. Your existing product photo will be kept.
                  </p>
                )}
              </div>

              {/* Product badges */}
              <div className="flex flex-wrap items-center gap-6 pt-1">

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cardForm.isBestseller}
                    onChange={e =>
                      setCardForm({
                        ...cardForm,
                        isBestseller: e.target.checked
                      })
                    }
                  />
                  <span>Mark as Bestseller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cardForm.isNew}
                    onChange={e =>
                      setCardForm({
                        ...cardForm,
                        isNew: e.target.checked
                      })
                    }
                  />
                  <span>Mark as New Arrival</span>
                </label>

              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-[#F3ECFA]">

                <button
                  type="button"
                  disabled={submittingProduct}
                  onClick={() => {
                    setShowAddModal(false);
                    resetProductForm();
                  }}
                  className="px-4 py-2 border border-[#C8A2E8] text-[#7041A6] rounded-xl font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingProduct}
                  className="px-5 py-2 bg-[#7041A6] disabled:opacity-60 text-white rounded-xl font-bold hover:bg-[#9B72CF]"
                >
                  {submittingProduct
                    ? 'Saving...'
                    : editingCard
                      ? 'Save Updates'
                      : 'Add Card to Shop'}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
