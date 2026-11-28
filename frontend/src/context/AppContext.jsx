
import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import { INITIAL_CARDS } from '../data/cardsData.js';

const AppContext = createContext();

export function AppProvider({ children }) {
  const PRODUCTS_API_URL = 'http://localhost:5000/api/products';
  const AUTH_API_URL = 'http://localhost:5000/api/auth';
  const ORDERS_API_URL = 'http://localhost:5000/api/orders';

  // ==========================================
  // PRODUCTS
  // ==========================================

  const [products, setProducts] = useState(INITIAL_CARDS);
  const [productsLoading, setProductsLoading] = useState(true);

  const optimizeCloudinaryUrl = (imageUrl) => {
    if (
      !imageUrl ||
      typeof imageUrl !== 'string' ||
      !imageUrl.includes('res.cloudinary.com') ||
      !imageUrl.includes('/upload/')
    ) {
      return imageUrl;
    }

    if (
      imageUrl.includes('f_auto') ||
      imageUrl.includes('q_auto')
    ) {
      return imageUrl;
    }

    return imageUrl.replace(
      '/upload/',
      '/upload/f_auto,q_auto,c_limit,w_1200/'
    );
  };

  const normalizeProduct = (product) => ({
    ...product,
    id: product._id || product.id,
    image: optimizeCloudinaryUrl(product.image),
    discountPrice: product.discountPrice ?? null,
    stock: Number(product.stock ?? 0),
    price: Number(product.price ?? 0)
  });

  // ==========================================
  // TOAST NOTIFICATION
  // ==========================================

  const [toast, setToast] = useState({
    message: '',
    type: 'success',
    visible: false
  });

  const showToast = (message, type = 'success') => {
    setToast({
      message,
      type,
      visible: true
    });

    setTimeout(() => {
      setToast(prev => ({
        ...prev,
        visible: false
      }));
    }, 3500);
  };

  // ==========================================
  // LOAD PRODUCTS FROM MONGODB
  // ==========================================

  const refreshProducts = async () => {
    try {
      const response = await fetch(PRODUCTS_API_URL);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Unable to load products.'
        );
      }

      setProducts(
        Array.isArray(data.products)
          ? data.products.map(normalizeProduct)
          : []
      );

      return { success: true };
    } catch (error) {
      console.error('Products loading error:', error);

      showToast(
        error.message || 'Could not load products.',
        'error'
      );

      return {
        success: false,
        message: error.message
      };
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  // ==========================================
  // AUTHENTICATED USER
  // ==========================================

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Restore authenticated session from HTTP-only cookie
  useEffect(() => {
    let active = true;

    const checkAuthSession = async () => {
      try {
        const response = await fetch(`${AUTH_API_URL}/me`, {
          method: 'GET',
          credentials: 'include'
        });

        const data = await response.json();

        if (!active) return;

        if (response.ok && data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Session check error:', error);

        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setAuthLoading(false);
        }
      }
    };

    checkAuthSession();

    return () => {
      active = false;
    };
  }, []);

  // ==========================================
  // CART
  // ==========================================

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('artstudio_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ==========================================
  // WISHLIST
  // ==========================================

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('artstudio_wishlist');
      return saved ? JSON.parse(saved) : ['card-1', 'card-2'];
    } catch {
      return ['card-1', 'card-2'];
    }
  });

  // ==========================================
  // ORDERS
  // ==========================================

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('artstudio_orders');

      return saved ? JSON.parse(saved) : [
        {
          id: 'ART-98421',
          date: '2026-11-04',
          items: [
            {
              id: 'card-1',
              name: 'Lavender Whisper Pressed Floral Card',
              price: 799,
              quantity: 2,
              image: '/src/assets/images/birthday_card_craft_1794160682865.jpg'
            }
          ],
          subtotal: 1598,
          deliveryFee: 250,
          total: 1848,
          paymentMethod: 'Cash on Delivery',
          status: 'Shipped',
          shippingAddress: 'House #42, Street 7, Lavender Heights, Lahore'
        }
      ];
    } catch {
      return [];
    }
  });

  // ==========================================
  // SAVED CUSTOM CARDS
  // ==========================================

  const [savedCustomCards, setSavedCustomCards] = useState(() => {
    try {
      const saved = localStorage.getItem('artstudio_custom_cards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ==========================================
  // SAVE DATA TO LOCAL STORAGE
  // ==========================================

  useEffect(() => {
    localStorage.setItem('artstudio_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('artstudio_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('artstudio_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(
      'artstudio_custom_cards',
      JSON.stringify(savedCustomCards)
    );
  }, [savedCustomCards]);

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = async (product, quantity = 1, customData = null) => {
    const amount = Number(quantity);

    if (!Number.isInteger(amount) || amount < 1) {
      showToast('Please select a valid quantity.', 'error');
      return { success: false };
    }

    // Custom cards do not use inventory stock.
    if (customData) {
      const customItem = {
        cartItemId: 'custom-' + Date.now(),
        id: product.id || 'custom-card',
        name: customData.cardTitle
          ? `Custom: ${customData.cardTitle}`
          : (product.name || 'Custom Greeting Card'),
        price: product.price || 950,
        quantity: amount,
        image:
          customData.previewImage ||
          product.image ||
          '/src/assets/images/birthday_card_craft_1794160682865.jpg',
        isCustom: true,
        customData
      };

      setCart(prev => [...prev, customItem]);

      showToast('Personalized card added to shopping cart! 🌸');

      return { success: true };
    }

    try {
      const response = await fetch(
        `${PRODUCTS_API_URL}/${product.id}/reserve`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            quantity: amount
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        showToast(
          data.message || 'Unable to add product.',
          'error'
        );

        await refreshProducts();

        return {
          success: false,
          message: data.message
        };
      }

      const reservation = {
        token: data.token,
        quantity: amount
      };

      setCart(prevCart => {
        const existingIndex = prevCart.findIndex(
          item => item.id === product.id && !item.isCustom
        );

        if (existingIndex > -1) {
          const updated = [...prevCart];
          const existing = updated[existingIndex];

          updated[existingIndex] = {
            ...existing,
            quantity: existing.quantity + amount,
            reservations: [
              ...(existing.reservations || []),
              reservation
            ]
          };

          return updated;
        }

        return [
          ...prevCart,
          {
            cartItemId:
              'item-' +
              Date.now() +
              '-' +
              Math.random().toString(36).slice(2, 6),
            id: product.id,
            name: product.name,
            price: product.discountPrice || product.price,
            originalPrice: product.price,
            quantity: amount,
            image: product.image,
            category: product.category,
            isCustom: false,
            reservations: [reservation]
          }
        ];
      });

      await refreshProducts();

      showToast(`Added "${product.name}" to cart! 🛍️`);

      return { success: true };
    } catch (error) {
      console.error('Add to cart:', error);

      showToast('Could not connect to the server.', 'error');

      return {
        success: false,
        message: error.message
      };
    }
  };

  // ==========================================
  // RELEASE STOCK RESERVATION
  // ==========================================

  const releaseReservation = async (
    productId,
    reservation,
    quantity
  ) => {
    const response = await fetch(
      `${PRODUCTS_API_URL}/${productId}/release`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: reservation.token,
          quantity
        })
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || 'Unable to restore stock.'
      );
    }

    return data;
  };

  // ==========================================
  // UPDATE CART QUANTITY
  // ==========================================

  const updateCartQuantity = async (cartItemId, delta) => {
    if (!Number.isInteger(delta) || delta === 0) return;

    const item = cart.find(
      current => current.cartItemId === cartItemId
    );

    if (!item) return;

    if (item.isCustom) {
      setCart(prev =>
        prev.map(current =>
          current.cartItemId === cartItemId
            ? {
                ...current,
                quantity: Math.max(1, current.quantity + delta)
              }
            : current
        )
      );

      return;
    }

    try {
      if (delta > 0) {
        const response = await fetch(
          `${PRODUCTS_API_URL}/${item.id}/reserve`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              quantity: delta
            })
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          showToast(
            data.message || 'Not enough stock available.',
            'error'
          );

          await refreshProducts();

          return;
        }

        setCart(prev =>
          prev.map(current =>
            current.cartItemId === cartItemId
              ? {
                  ...current,
                  quantity: current.quantity + delta,
                  reservations: [
                    ...(current.reservations || []),
                    {
                      token: data.token,
                      quantity: delta
                    }
                  ]
                }
              : current
          )
        );
      } else {
        let remaining = Math.min(-delta, item.quantity);

        const reservations = (item.reservations || []).map(
          reservation => ({ ...reservation })
        );

        while (remaining > 0 && reservations.length > 0) {
          const reservation = reservations[0];

          const releaseAmount = Math.min(
            remaining,
            reservation.quantity
          );

          await releaseReservation(
            item.id,
            reservation,
            releaseAmount
          );

          reservation.quantity -= releaseAmount;
          remaining -= releaseAmount;

          if (reservation.quantity === 0) {
            reservations.shift();
          }
        }

        if (remaining > 0) {
          throw new Error(
            'Could not find all stock reservations for this cart item.'
          );
        }

        const newQuantity =
          item.quantity - Math.min(-delta, item.quantity);

        setCart(prev =>
          newQuantity > 0
            ? prev.map(current =>
                current.cartItemId === cartItemId
                  ? {
                      ...current,
                      quantity: newQuantity,
                      reservations
                    }
                  : current
              )
            : prev.filter(
                current => current.cartItemId !== cartItemId
              )
        );
      }

      await refreshProducts();
    } catch (error) {
      console.error('Update cart quantity:', error);

      showToast(
        error.message || 'Unable to update cart quantity.',
        'error'
      );

      await refreshProducts();
    }
  };

  // ==========================================
  // REMOVE FROM CART
  // ==========================================

  const removeFromCart = async (cartItemId) => {
    const item = cart.find(
      current => current.cartItemId === cartItemId
    );

    if (!item) return;

    try {
      if (!item.isCustom) {
        for (const reservation of item.reservations || []) {
          await releaseReservation(
            item.id,
            reservation,
            reservation.quantity
          );
        }
      }

      setCart(prev =>
        prev.filter(
          current => current.cartItemId !== cartItemId
        )
      );

      await refreshProducts();

      showToast('Removed item from shopping cart.');
    } catch (error) {
      console.error('Remove cart item:', error);

      showToast(
        error.message || 'Unable to remove item.',
        'error'
      );

      await refreshProducts();
    }
  };

  // ==========================================
  // CLEAR CART
  // ==========================================

  const clearCart = async () => {
    try {
      for (const item of cart) {
        if (item.isCustom) continue;

        for (const reservation of item.reservations || []) {
          await releaseReservation(
            item.id,
            reservation,
            reservation.quantity
          );
        }
      }

      setCart([]);

      await refreshProducts();

      showToast('Cart has been cleared.');
    } catch (error) {
      console.error('Clear cart:', error);

      showToast(
        error.message || 'Unable to clear cart.',
        'error'
      );

      await refreshProducts();
    }
  };

  // ==========================================
  // WISHLIST OPERATIONS
  // ==========================================

  const toggleWishlist = (cardId) => {
    setWishlist(prev => {
      if (prev.includes(cardId)) {
        showToast('Removed from your wishlist.');

        return prev.filter(id => id !== cardId);
      }

      showToast('Saved to your wishlist! 💜');

      return [...prev, cardId];
    });
  };

  const isInWishlist = (cardId) => wishlist.includes(cardId);

  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (email, password, rememberMe = true) => {
    try {
      const response = await fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          rememberMe
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.user) {
        const message = data.message || 'Login failed.';

        showToast(message, 'error');

        return {
          success: false,
          message
        };
      }

      setUser(data.user);

      showToast(`Welcome back, ${data.user.name}! ✨`);

      return {
        success: true,
        user: data.user
      };
    } catch (error) {
      console.error('Login error:', error);

      showToast('Unable to connect to the server.', 'error');

      return {
        success: false,
        message: error.message
      };
    }
  };

  // ==========================================
  // SIGNUP
  // ==========================================

  const signup = async (userData) => {
    try {
      const response = await fetch(`${AUTH_API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          fullName: userData.fullName || userData.name || '',
          email: userData.email,
          password: userData.password,
          phone: userData.phone || '',
          address: userData.address || '',
          city: userData.city || '',
          postalCode: userData.postalCode || ''
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.user) {
        const message = data.message || 'Signup failed.';

        showToast(message, 'error');

        return {
          success: false,
          message
        };
      }

      setUser(data.user);

      showToast(
        'Account created successfully! Welcome to ArtStudio 🌸'
      );

      return {
        success: true,
        user: data.user
      };
    } catch (error) {
      console.error('Signup error:', error);

      showToast('Unable to connect to the server.', 'error');

      return {
        success: false,
        message: error.message
      };
    }
  };

  // ==========================================
  // FORGOT PASSWORD
  // ==========================================

  const forgotPassword = async (email) => {
    try {
      const response = await fetch(
        `${AUTH_API_URL}/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            email: String(email || '').trim().toLowerCase()
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message:
            data.message || 'Unable to request password reset.'
        };
      }

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Forgot password error:', error);

      return {
        success: false,
        message: 'Unable to connect to the server.'
      };
    }
  };

  // ==========================================
  // RESET PASSWORD
  // ==========================================

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await fetch(
        `${AUTH_API_URL}/reset-password/${encodeURIComponent(token)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            newPassword
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Unable to reset password.'
        };
      }

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Reset password error:', error);

      return {
        success: false,
        message: 'Unable to connect to the server.'
      };
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = async () => {
    try {
      const response = await fetch(`${AUTH_API_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Logout failed.');
      }

      setUser(null);

      showToast('Logged out successfully.');

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);

      showToast(
        'Unable to log out. Please try again.',
        'error'
      );

      return {
        success: false,
        message: error.message
      };
    }
  };

  // ==========================================
  // CHANGE ADMIN LOGIN EMAIL
  // ==========================================

  const changeAdminEmail = async (newEmail, currentPassword) => {
    try {
      const response = await fetch(
        `${AUTH_API_URL}/admin/change-email`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            newEmail,
            currentPassword
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success || !data.user) {
        const message =
          data.message || 'Unable to update login email.';

        showToast(message, 'error');

        return {
          success: false,
          message
        };
      }

      setUser(data.user);

      showToast('Admin login email updated successfully!');

      return {
        success: true,
        user: data.user,
        message: data.message
      };
    } catch (error) {
      console.error('Admin email change error:', error);

      const message = 'Unable to connect to the server.';

      showToast(message, 'error');

      return {
        success: false,
        message
      };
    }
  };

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch(
        `${AUTH_API_URL}/change-password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            currentPassword,
            newPassword
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        const message =
          data.message || 'Unable to change password.';

        showToast(message, 'error');

        return {
          success: false,
          message
        };
      }

      showToast('Password changed successfully!');

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Password change error:', error);

      const message = 'Unable to connect to the server.';

      showToast(message, 'error');

      return {
        success: false,
        message
      };
    }
  };

  // ==========================================
  // UPDATE USER PROFILE
  // ==========================================

  const updateUserProfile = (updates) => {
    setUser(prev => ({
      ...prev,
      ...updates
    }));

    showToast('Profile details updated successfully! 💜');
  };

  // ==========================================
  // PLACE ORDER - SAVE ORDER IN MONGODB
  // ==========================================

  const placeOrder = async (orderDetails) => {
    try {
      if (!cart.length) {
        throw new Error('Your shopping cart is empty.');
      }

      if (!orderDetails?.shippingDetails) {
        throw new Error('Shipping details are missing.');
      }

      // Send cart and shipping details to backend.
      // Backend validates reservations and calculates order totals.
      const response = await fetch(ORDERS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          items: cart,
          shippingDetails: orderDetails.shippingDetails
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.order) {
        throw new Error(
          data.message || 'Unable to place your order.'
        );
      }

      const savedOrder = data.order;

      // Format backend order for the frontend.
      const newOrder = {
        ...savedOrder,

        id:
          savedOrder.orderNumber ||
          savedOrder.id ||
          savedOrder._id,

        date: savedOrder.createdAt
          ? savedOrder.createdAt.split('T')[0]
          : new Date().toISOString().split('T')[0],

        items: Array.isArray(savedOrder.items)
          ? savedOrder.items
          : cart,

        paymentMethod:
          savedOrder.paymentMethod || 'Cash on Delivery',

        shippingAddress:
          savedOrder.shippingDetails?.address ||
          orderDetails.shippingDetails.address ||
          '',

        status: savedOrder.status || 'Pending'
      };

      // Update frontend only after backend confirms success.
      setOrders(prev => [newOrder, ...prev]);

      // Clear cart only after successful order creation.
      setCart([]);

      // Refresh stock after successful order.
      await refreshProducts();

      showToast(
        `Order ${newOrder.id} placed successfully! 🎀`
      );

      return newOrder;
    } catch (error) {
      console.error('Place order:', error);

      showToast(
        error.message || 'Unable to place your order.',
        'error'
      );

      return null;
    }
  };

  // ==========================================
  // CANCEL ORDER
  // ==========================================

  const cancelOrder = (orderId) => {
    setOrders(prev =>
      prev.map(ord =>
        (ord.id === orderId || ord.orderNumber === orderId)
          ? { ...ord, status: 'Cancelled' }
          : ord
      )
    );

    showToast(`Order ${orderId} has been cancelled.`);
  };

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(ord =>
        (ord.id === orderId || ord.orderNumber === orderId)
          ? { ...ord, status: newStatus }
          : ord
      )
    );

    showToast(
      `Updated order ${orderId} status to "${newStatus}".`
    );
  };

  // ==========================================
  // PRODUCT IMAGE COMPRESSION
  // ==========================================

  const optimizeProductImage = async (file) => {
    if (!(file instanceof File)) return file;

    try {
      const bitmap = await createImageBitmap(file);

      const MAX_SIZE = 1600;
      const MAX_FILE_SIZE = 350 * 1024;

      const scale = Math.min(
        1,
        MAX_SIZE / Math.max(bitmap.width, bitmap.height)
      );

      if (scale === 1 && file.size <= MAX_FILE_SIZE) {
        bitmap.close();
        return file;
      }

      const canvas = document.createElement('canvas');

      canvas.width = Math.max(
        1,
        Math.round(bitmap.width * scale)
      );

      canvas.height = Math.max(
        1,
        Math.round(bitmap.height * scale)
      );

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        bitmap.close();
        return file;
      }

      ctx.drawImage(
        bitmap,
        0,
        0,
        canvas.width,
        canvas.height
      );

      bitmap.close();

      const compressedBlob = await new Promise(resolve => {
        canvas.toBlob(
          resolve,
          'image/webp',
          0.82
        );
      });

      if (!compressedBlob || compressedBlob.size >= file.size) {
        return file;
      }

      const newName =
        file.name.replace(/\.[^.]+$/, '') + '.webp';

      return new File(
        [compressedBlob],
        newName,
        {
          type: 'image/webp',
          lastModified: Date.now()
        }
      );
    } catch (error) {
      console.error('Image optimization error:', error);
      return file;
    }
  };

  // ==========================================
  // PRODUCT FORM DATA
  // ==========================================

  const buildProductFormData = async (cardData) => {
    const formData = new FormData();

    Object.entries(cardData).forEach(([key, value]) => {
      if (
        key === 'imageFile' ||
        key === 'image' ||
        value === undefined ||
        value === null ||
        value === ''
      ) {
        return;
      }

      if (
        typeof value === 'boolean' ||
        typeof value === 'number' ||
        typeof value === 'string'
      ) {
        formData.append(key, String(value));
      }
    });

    const imageFile =
      cardData.imageFile instanceof File
        ? cardData.imageFile
        : cardData.image instanceof File
          ? cardData.image
          : null;

    if (imageFile) {
      const optimizedImage =
        await optimizeProductImage(imageFile);

      formData.append('image', optimizedImage);
    }

    return formData;
  };

  // ==========================================
  // ADD PRODUCT TO MONGODB
  // ==========================================

  const addProduct = async (cardData) => {
    try {
      const formData = await buildProductFormData(cardData);

      const response = await fetch(PRODUCTS_API_URL, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Product could not be created.'
        );
      }

      const newProduct = normalizeProduct(data.product);

      setProducts(prev => [newProduct, ...prev]);

      showToast(
        `Product "${newProduct.name}" created successfully! ✨`
      );

      return {
        success: true,
        product: newProduct
      };
    } catch (error) {
      console.error('Add product error:', error);

      showToast(
        error.message || 'Failed to create product.',
        'error'
      );

      return {
        success: false,
        message: error.message
      };
    }
  };

  // ==========================================
  // UPDATE PRODUCT IN MONGODB
  // ==========================================

  const updateProduct = async (cardId, updates) => {
    try {
      const formData = await buildProductFormData(updates);

      const response = await fetch(
        `${PRODUCTS_API_URL}/${cardId}`,
        {
          method: 'PUT',
          credentials: 'include',
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Product could not be updated.'
        );
      }

      const updatedProduct = normalizeProduct(data.product);

      setProducts(prev =>
        prev.map(product =>
          product.id === cardId
            ? updatedProduct
            : product
        )
      );

      showToast('Product updated successfully! 🎨');

      return {
        success: true,
        product: updatedProduct
      };
    } catch (error) {
      console.error('Update product error:', error);

      showToast(
        error.message || 'Failed to update product.',
        'error'
      );

      return {
        success: false,
        message: error.message
      };
    }
  };

  // ==========================================
  // DELETE PRODUCT FROM MONGODB
  // ==========================================

  const deleteProduct = async (cardId) => {
    try {
      const response = await fetch(
        `${PRODUCTS_API_URL}/${cardId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Product could not be deleted.'
        );
      }

      setProducts(prev =>
        prev.filter(product => product.id !== cardId)
      );

      showToast('Product removed from catalog.');

      return { success: true };
    } catch (error) {
      console.error('Delete product error:', error);

      showToast(
        error.message || 'Failed to delete product.',
        'error'
      );

      return {
        success: false,
        message: error.message
      };
    }
  };

  // ==========================================
  // CUSTOM CARD OPERATIONS
  // ==========================================

  const saveCustomCard = (design) => {
    const newDesign = {
      ...design,
      id: 'saved-design-' + Date.now(),
      savedAt: new Date().toLocaleDateString()
    };

    setSavedCustomCards(prev => [
      newDesign,
      ...prev
    ]);

    showToast(
      'Design saved to your personalized studio! 💌'
    );
  };

  const deleteCustomCard = (designId) => {
    setSavedCustomCards(prev =>
      prev.filter(d => d.id !== designId)
    );

    showToast('Design deleted.');
  };

  // ==========================================
  // CART TOTALS
  // ==========================================

  const cartCount = cart.reduce(
    (acc, item) => acc + Number(item.quantity || 0),
    0
  );

  const cartSubtotal = cart.reduce(
    (acc, item) =>
      acc + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const deliveryFee =
    cartSubtotal > 3000 || cartSubtotal === 0
      ? 0
      : 250;

  const cartTotal = cartSubtotal + deliveryFee;

  // ==========================================
  // APP CONTEXT PROVIDER
  // ==========================================

  return (
    <AppContext.Provider
      value={{
        products,
        productsLoading,
        refreshProducts,

        cart,
        wishlist,
        user,
        authLoading,
        orders,
        savedCustomCards,
        toast,

        cartCount,
        cartSubtotal,
        deliveryFee,
        cartTotal,

        showToast,

        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,

        toggleWishlist,
        isInWishlist,

        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
        changeAdminEmail,
        changePassword,
        updateUserProfile,

        placeOrder,
        cancelOrder,
        updateOrderStatus,

        addProduct,
        updateProduct,
        deleteProduct,

        saveCustomCard,
        deleteCustomCard
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ==========================================
// CUSTOM HOOK
// ==========================================

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      'useApp must be used within an AppProvider'
    );
  }

  return context;
}

export { AppContext };

export default AppContext;
