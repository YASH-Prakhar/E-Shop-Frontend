// Mock API implementation - replace with real API calls
const API_BASE_URL = {
  orders: "http://localhost:8000/api/v1",
  auth: "http://localhost:8001/api/v1",
  products: "http://localhost:8002/api/v1",
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))


interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    username: string;
    email: string;
    is_admin: boolean;
  };
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL.auth}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data: LoginResponse = await response.json();
    return data;
  },

  async verifyToken(token: string): Promise<LoginResponse['user']> {
    const response = await fetch(`${API_BASE_URL}/api/v1/verify-token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Invalid token');
    }

    const data = await response.json();
    return data.user;
  },
}

// Define the product type based on the API response
interface Category {
  id: number;
  name: string;
  description: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  created_at: string;
  updated_at: string;
  category: Category;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export const productsApi = {
  async getProducts(params?: { 
    search?: string; 
    category?: number;
    page?: number; 
    limit?: number 
  }): Promise<ProductsResponse> {
    // Set default values and validate
    const page = Math.max(1, params?.page || 1);
    const limit = Math.min(1000, Math.max(1, params?.limit || 10));

    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category_id', params.category.toString());
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    try {
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL.products}/products?${queryParams.toString()}`, {
        headers,
      });
      
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('auth_token');
        throw new Error('Session expired. Please login again.');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to fetch products');
      }
      
      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch products');
    }
  },

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL.products}/products/${id}`);
    if (!response.ok) {
      throw new Error('Product not found');
    }
    return response.json();
  },

  // Admin operations remain the same but with corrected URLs
  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category'>) {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL.products}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });

    if (response.status === 403) {
      throw new Error('Admin access required');
    }
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    return response.json();
  },

  async updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category'>>) {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL.products}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (response.status === 403) {
      throw new Error('Admin access required');
    }
    if (!response.ok) {
      throw new Error('Failed to update product');
    }
    return response.json();
  },

  async deleteProduct(id: string) {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL.products}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 403) {
      throw new Error('Admin access required');
    }
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
    return { success: true };
  },
};

// export const ordersApi = {
//   async getOrders(userId?: string) {
//     await delay(800)
//     if (userId) {
//       return mockOrders.filter((o) => o.userId === userId)
//     }
//     return mockOrders
//   },

//   async createOrder(order: Omit<(typeof mockOrders)[0], "id" | "createdAt">) {
//     await delay(1000)
//     const newOrder = {
//       ...order,
//       id: Date.now().toString(),
//       createdAt: new Date().toISOString(),
//     }
//     mockOrders.push(newOrder)
//     return newOrder
//   },

//   async updateOrderStatus(id: string, status: string) {
//     await delay(1000)
//     const index = mockOrders.findIndex((o) => o.id === id)
//     if (index === -1) {
//       throw new Error("Order not found")
//     }
//     mockOrders[index].status = status
//     return mockOrders[index]
//   },
// }
