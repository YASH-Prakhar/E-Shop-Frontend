// Mock API implementation - replace with real API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock data
const mockUsers = [
  { id: "1", email: "admin@example.com", password: "admin123", name: "Admin User", role: "admin" as const },
  { id: "2", email: "user@example.com", password: "user123", name: "John Doe", role: "user" as const },
]

const mockProducts = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 7999,
    description: "High-quality wireless headphones with noise cancellation",
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    stock: 50,
    rating: 4.5,
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 15999,
    description: "Feature-rich smartwatch with health tracking",
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    stock: 30,
    rating: 4.3,
  },
  {
    id: "3",
    name: "Running Shoes",
    price: 6399,
    description: "Comfortable running shoes for daily exercise",
    image: "/placeholder.svg?height=300&width=300",
    category: "Sports",
    stock: 100,
    rating: 4.7,
  },
  {
    id: "4",
    name: "Coffee Maker",
    price: 11999,
    description: "Automatic coffee maker with programmable settings",
    image: "/placeholder.svg?height=300&width=300",
    category: "Home",
    stock: 25,
    rating: 4.2,
  },
]

const mockOrders = [
  {
    id: "1",
    userId: "2",
    items: [{ productId: "1", quantity: 1, price: 7999 }],
    total: 7999,
    status: "delivered",
    createdAt: "2024-01-15T10:00:00Z",
    shippingAddress: "123 Main St, City, State 12345",
  },
  {
    id: "2",
    userId: "2",
    items: [{ productId: "2", quantity: 1, price: 15999 }],
    total: 15999,
    status: "shipped",
    createdAt: "2024-01-20T14:30:00Z",
    shippingAddress: "123 Main St, City, State 12345",
  },
]

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
    const response = await fetch(`${API_BASE_URL}/api/v1/login`, {
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

export const productsApi = {
  async getProducts(params?: { search?: string; category?: string; page?: number; limit?: number }) {
    await delay(800)
    let filteredProducts = [...mockProducts]

    if (params?.search) {
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(params.search!.toLowerCase()) ||
          p.description.toLowerCase().includes(params.search!.toLowerCase()),
      )
    }

    if (params?.category) {
      filteredProducts = filteredProducts.filter((p) => p.category === params.category)
    }

    const page = params?.page || 1
    const limit = params?.limit || 10
    const start = (page - 1) * limit
    const end = start + limit

    return {
      products: filteredProducts.slice(start, end),
      total: filteredProducts.length,
      page,
      totalPages: Math.ceil(filteredProducts.length / limit),
    }
  },

  async getProduct(id: string) {
    await delay(500)
    const product = mockProducts.find((p) => p.id === id)
    if (!product) {
      throw new Error("Product not found")
    }
    return product
  },

  async createProduct(product: Omit<(typeof mockProducts)[0], "id">) {
    await delay(1000)
    const newProduct = { ...product, id: Date.now().toString() }
    mockProducts.push(newProduct)
    return newProduct
  },

  async updateProduct(id: string, updates: Partial<(typeof mockProducts)[0]>) {
    await delay(1000)
    const index = mockProducts.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error("Product not found")
    }
    mockProducts[index] = { ...mockProducts[index], ...updates }
    return mockProducts[index]
  },

  async deleteProduct(id: string) {
    await delay(1000)
    const index = mockProducts.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error("Product not found")
    }
    mockProducts.splice(index, 1)
    return { success: true }
  },
}

export const ordersApi = {
  async getOrders(userId?: string) {
    await delay(800)
    if (userId) {
      return mockOrders.filter((o) => o.userId === userId)
    }
    return mockOrders
  },

  async createOrder(order: Omit<(typeof mockOrders)[0], "id" | "createdAt">) {
    await delay(1000)
    const newOrder = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    mockOrders.push(newOrder)
    return newOrder
  },

  async updateOrderStatus(id: string, status: string) {
    await delay(1000)
    const index = mockOrders.findIndex((o) => o.id === id)
    if (index === -1) {
      throw new Error("Order not found")
    }
    mockOrders[index].status = status
    return mockOrders[index]
  },
}
