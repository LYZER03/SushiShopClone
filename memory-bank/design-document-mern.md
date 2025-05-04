# Design Document: Sushi Shop Clone Platform (MERN Stack)

## 1. Introduction

### 1.1 Purpose
This document outlines the design specifications for a sushi delivery and ordering platform similar to sushi-shop.fr, including both customer-facing frontend and restaurateur back-office components, built with the MERN stack.

### 1.2 Scope
The platform will enable customers to browse menus, place orders, track delivery, and allow restaurant staff to manage products, orders, and inventory through a dedicated back-office.

### 1.3 Target Audience
- Customers seeking to order sushi and Japanese cuisine
- Restaurant owners and staff
- Delivery personnel
- Platform administrators

## 2. Technology Stack

### 2.1 Frontend

- Framework: React with Vite
- Language: JavaScript/TypeScript
- UI Components: Chakra UI
- State Management: Zustand
- Routing: React Router v6+
- Data Fetching: React Query / Axios

### 2.2 Backend

- API Framework: Express.js
- Database: MongoDB
- ODM: Mongoose
- Authentication: Passport.js with JWT
- File Storage: Cloudinary for product images

### 2.3 Admin Panel

- Framework: React Admin
- Data Provider: Custom provider for Express.js API

### 2.4 Infrastructure

- Frontend Hosting: Netlify/Vercel
- Backend Hosting: Railway/Render
- Database: MongoDB Atlas
- CI/CD: GitHub Actions
- Monitoring: Sentry

## 3. System Architecture

### 3.1 High-Level Architecture
```
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│                │     │                │     │                │
│  Customer UI   │────▶│   Express API  │◀───▶│   MongoDB      │
│  (React/Vite)  │     │                │     │   Database     │
│                │     │                │     │                │
└────────────────┘     └────────────────┘     └────────────────┘
        │                     ▲
        │                     │
┌────────────────┐            │
│                │            │
│  Admin Panel   │────────────┘
│  (React-Admin) │
│                │
└────────────────┘
```

### 3.2 Data Flow
1. User requests are handled by React frontend
2. API requests are sent to Express backend
3. Express controllers process requests and interact with MongoDB through Mongoose
4. Authentication is managed via Passport.js and JWT tokens
5. React Query manages client-side data fetching and caching

## 4. Database Schema

### 4.1 Core Entities

#### User
```javascript
{
  _id: ObjectId,
  email: String (required, unique),
  passwordHash: String (required),
  firstName: String (required),
  lastName: String (required),
  role: String (enum: ["customer", "staff", "admin"]),
  addresses: [Address],
  createdAt: Date,
  updatedAt: Date
}
```

#### Product
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  price: Number (required),
  imageUrl: String,
  category: ObjectId (ref: "Category"),
  isAvailable: Boolean (default: true),
  ingredients: [String],
  allergens: [String],
  createdAt: Date,
  updatedAt: Date
}
```

#### Order
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: "User"),
  items: [{
    product: ObjectId (ref: "Product"),
    quantity: Number,
    price: Number
  }],
  status: String (enum: ["pending", "preparing", "delivering", "delivered", "cancelled"]),
  totalPrice: Number,
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  },
  paymentIntentId: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Category
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  displayOrder: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 4.2 Database Relationships
- User -> Orders (One-to-Many)
- Category -> Products (One-to-Many)
- Orders -> Products (Many-to-Many via items array)

## 5. Feature Specifications

### 5.1 Customer Portal

#### 5.1.1 Menu Browsing
Users can browse the menu with filtering by:
- Categories (maki, sushi, bowl, etc.)
- Dietary restrictions (vegetarian, gluten-free)
- Price range
- Popularity/rating

#### 5.1.2 Shopping Cart
- Add/remove items
- Adjust quantities
- Apply discount codes
- View subtotal, taxes, and delivery fees

#### 5.1.3 Checkout Flow
1. Cart review
2. Address selection/input
3. Delivery time selection
4. Payment integration (Stripe)
5. Order confirmation

#### 5.1.4 User Account
- Order history and reordering
- Saved addresses
- Payment methods
- Preferences and dietary restrictions

### 5.2 Restaurant Back-Office

#### 5.2.1 Dashboard
- Daily orders summary
- Revenue metrics
- Popular items
- Inventory alerts

#### 5.2.2 Order Management
- View incoming orders
- Update order status
- Handle special requests
- Process refunds

#### 5.2.3 Menu Management
- Add/edit products
- Update prices
- Manage categories
- Set availability

#### 5.2.4 Inventory Control
- Track ingredient usage
- Set low-stock alerts
- Mark items as unavailable

## 6. UI/UX Design

### 6.1 Design Principles
- Clean, minimalist interface with focus on food photography
- Mobile-first responsive design
- Accessibility compliance (WCAG 2.1 AA)
- Consistent branding elements

### 6.2 Color Palette
- Primary: `#E94560` (vibrant red)
- Secondary: `#0F3460` (deep blue)
- Accent: `#16213E` (dark navy)
- Background: `#FFFFFF` (white)
- Text: `#1A1A2E` (near-black)

### 6.3 Typography
- Headings: Poppins (sans-serif)
- Body: Inter (sans-serif)
- Alternative/Accent: Noto Sans JP (for Japanese terms)

### 6.4 Key Interface Components
- Product cards with hover effects
- Sticky navigation
- Floating cart summary
- Order progress indicators
- Responsive tables for admin views

## 7. API Endpoints

### 7.1 Public API

#### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh-token`

#### Products
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/categories`
- `GET /api/categories/:id/products`

#### Orders
- `POST /api/orders`
- `GET /api/orders/:id`
- `GET /api/orders/current-user`

#### User
- `GET /api/user/profile`
- `PUT /api/user/profile`
- `GET /api/user/addresses`
- `POST /api/user/addresses`

### 7.2 Admin API

#### Products Management
- `POST /api/admin/products`
- `PUT /api/admin/products/:id`
- `DELETE /api/admin/products/:id`

#### Orders Management
- `GET /api/admin/orders`
- `PUT /api/admin/orders/:id/status`

#### Analytics
- `GET /api/admin/analytics/sales`
- `GET /api/admin/analytics/popular-items`

## 8. Non-Functional Requirements

### 8.1 Performance
- Page load < 2 seconds (Core Web Vitals LCP)
- API response < 300ms
- Support 1000+ concurrent users

### 8.2 Security
- HTTPS for all connections
- Input validation
- CSRF protection
- Rate limiting
- JWT secure storage

### 8.3 Scalability
- Horizontal scaling of API servers
- MongoDB Atlas scaling options
- CDN for static assets
- Image optimization

### 8.4 Monitoring
- Error tracking with Sentry
- Performance monitoring
- API health checks
- Database query performance

## 9. Implementation Roadmap

### Phase 1: MVP (2 months)
- Basic product catalog
- Simple cart and checkout
- User registration and login
- Basic restaurant dashboard
- Order placement and tracking

### Phase 2: Enhanced Features (1 month)
- Payment integration
- Reviews and ratings
- Advanced filtering
- Order history and reordering

### Phase 3: Advanced Operations (1 month)
- Inventory management
- Analytics dashboard
- Promotions and discounts
- Mobile optimizations

## 10. Risk Assessment

### Technical Risks
- MongoDB performance with complex aggregations
- React Admin customization limitations
- Payment processing failures
- Mobile responsiveness challenges

### Mitigation Strategies
- Implement proper MongoDB indexing and query optimization
- Develop custom React Admin components when needed
- Implement redundant payment processing flows
- Mobile-first development approach with extensive testing