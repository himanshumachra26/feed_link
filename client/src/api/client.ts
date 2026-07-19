import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

// Mock data generator for guest mode
const getMockData = (url: string, method: string) => {
  const guestRole = localStorage.getItem('guestRole') || 'DONOR';
  
  // Normalize URL by removing query params
  const cleanUrl = url.split('?')[0];

  if (cleanUrl === '/stats/dashboard') {
    if (guestRole === 'DONOR') {
      return { totalListings: 12, activeListings: 5, pendingRequests: 2, completedDonations: 8 };
    } else if (guestRole === 'NGO') {
      return { totalRequests: 15, pendingRequests: 3, acceptedRequests: 4, completedPickups: 8, availableListings: 9 };
    }
    return { totalUsers: 48, totalListings: 120, totalRequests: 85, completedRequests: 60 };
  }

  if (cleanUrl === '/admin/stats') {
    return { totalUsers: 48, totalListings: 120, totalRequests: 85, completedRequests: 60 };
  }

  if (cleanUrl === '/requests') {
    return [
      {
        id: 'req-1',
        listingId: 'list-1',
        ngoId: 'ngo-1',
        status: 'PENDING',
        message: 'We are available to pick this up.',
        createdAt: '2026-07-19T10:00:00Z',
        updatedAt: '2026-07-19T10:00:00Z',
        listing: {
          id: 'list-1',
          title: 'Fresh Vege***es',
          foodType: 'VEG',
          quantity: 10,
          unit: 'kg',
          city: 'Mum***i',
          donor: { id: 'donor-1', orgName: 'Res***rant Al***a', phone: '+91 98***76' }
        },
        ngo: {
          id: 'ngo-1',
          orgName: 'Fe***ing In***a NGO',
          city: 'Mum***i',
          phone: '+91 99***88'
        }
      },
      {
        id: 'req-2',
        listingId: 'list-2',
        ngoId: 'ngo-1',
        status: 'ACCEPTED',
        message: 'Need this for evening shelter.',
        createdAt: '2026-07-19T08:00:00Z',
        updatedAt: '2026-07-19T08:30:00Z',
        listing: {
          id: 'list-2',
          title: 'Bak*** Goods',
          foodType: 'VEG',
          quantity: 5,
          unit: 'box',
          city: 'Ben***uru',
          donor: { id: 'donor-2', orgName: 'Swe*** Del***ts Bakery', phone: '+91 88***11' }
        },
        ngo: {
          id: 'ngo-1',
          orgName: 'Fe***ing In***a NGO',
          city: 'Mum***i',
          phone: '+91 99***88'
        }
      }
    ];
  }

  if (cleanUrl === '/listings/mine') {
    return [
      {
        id: 'list-1',
        donorId: 'guest-id',
        title: 'Fresh Vege***es',
        foodType: 'VEG',
        category: 'Vegetables',
        quantity: 10,
        unit: 'kg',
        suitableFor: 'community',
        servings: 20,
        status: 'AVAILABLE',
        pickupStart: '2026-07-19T10:00:00Z',
        pickupEnd: '2026-07-19T14:00:00Z',
        address: '123 Gue*** St',
        city: 'Mum***i',
        expiresAt: '2026-07-19T18:00:00Z',
        createdAt: '2026-07-19T09:00:00Z'
      }
    ];
  }

  if (cleanUrl === '/listings') {
    if (method === 'post') {
      return { success: true };
    }
    return {
      listings: [
        {
          id: 'list-2',
          donorId: 'donor-2',
          title: 'Bak*** Goods',
          foodType: 'VEG',
          category: 'Bakery',
          quantity: 5,
          unit: 'box',
          suitableFor: 'community',
          servings: 15,
          status: 'AVAILABLE',
          pickupStart: '2026-07-19T10:00:00Z',
          pickupEnd: '2026-07-19T14:00:00Z',
          address: '456 Bak*** Ave',
          city: 'Ben***uru',
          expiresAt: '2026-07-19T18:00:00Z',
          createdAt: '2026-07-19T09:00:00Z',
          donor: { id: 'donor-2', orgName: 'Swe*** Del***ts Bakery', city: 'Ben***uru', verified: true }
        }
      ],
      total: 1
    };
  }

  if (cleanUrl === '/notifications/unread-count') {
    return { count: 2 };
  }

  if (cleanUrl === '/notifications') {
    return [
      { id: 'n-1', userId: 'guest-id', type: 'NEW_DONATION', title: 'New Don***ion posted', body: 'Swe*** Del***ts Bakery posted a new donation in Ben***uru', read: false, createdAt: '2026-07-19T11:00:00Z' },
      { id: 'n-2', userId: 'guest-id', type: 'REQUEST_ACCEPTED', title: 'Req***st Acce***ed', body: 'Your request for Fresh Vege***es was acce***ed', read: false, createdAt: '2026-07-19T10:30:00Z' }
    ];
  }

  if (cleanUrl === '/admin/users') {
    return {
      users: [
        { id: 'u-1', orgName: 'Res***rant Al***a', email: 'con***@res***al***a.com', role: 'DONOR', phone: '+91 98***76', city: 'De***i', verified: true, active: true, createdAt: '2026-07-19T00:00:00Z' },
        { id: 'u-2', orgName: 'Fe***ing In***a NGO', email: 'in***@fe***in***a.org', role: 'NGO', phone: '+91 99***88', city: 'Mum***i', verified: false, active: true, createdAt: '2026-07-19T00:00:00Z' }
      ],
      total: 2
    };
  }

  // Handle generic operations
  if (method === 'post' || method === 'patch' || method === 'put' || method === 'delete') {
    window.dispatchEvent(new CustomEvent('guest-login-required'));
    throw new Error('Login required to make changes');
  }

  return null;
};

// Attach JWT token on every request, or handle guest mode
api.interceptors.request.use((config) => {
  const isGuest = localStorage.getItem('isGuest') === 'true';
  const isAuthRequest = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');

  if (isGuest && !isAuthRequest) {
    config.adapter = async (cfg) => {
      const mockResult = getMockData(cfg.url || '', (cfg.method || 'get').toLowerCase());
      return {
        data: mockResult,
        status: 200,
        statusText: 'OK',
        headers: cfg.headers,
        config: cfg,
      };
    };
  } else {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — clear token and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export default api;
