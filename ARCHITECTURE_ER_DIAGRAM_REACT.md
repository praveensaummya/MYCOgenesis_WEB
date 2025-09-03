# 🏗️ MYCOgenesis_WEB - Architecture & ER Diagram (React Frontend)
**Adapted for a React-based Frontend Implementation**

## 📋 **Table of Contents**
- [System Overview](#-system-overview)
- [Enhanced Entity Relationship Diagram](#-enhanced-entity-relationship-diagram)
- [React Frontend Architecture](#-react-frontend-architecture)
- [Firebase Integration Architecture](#-firebase-integration-architecture)
- [Sanity CMS Enhanced Architecture](#-sanity-cms-enhanced-architecture)
- [Performance & Resilience Systems](#-performance--resilience-systems)
- [Data Flow Diagrams](#-data-flow-diagrams)
- [Security & Access Control](#-security--access-control)
- [Scalability & Future Architecture](#-scalability--future-architecture)
- [API Integration Points](#-api-integration-points)
- [Deployment Architecture (React)](#-deployment-architecture-react)

---
- [SEO & AI SEO Considerations](#-seo--ai-seo-considerations)

## 🌟 **System Overview**

MYCOgenesis_WEB is a hybrid content management system using **dual data sources** with a **React-based frontend**:
- **Sanity.io CMS**: Primary content management (Products, Blog Posts, Categories)
- **Firebase**: Authentication, user management, analytics, and real-time features
- **React Frontend**: Modern, component-based user interface

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MYCOgenesis_WEB ECOSYSTEM                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                 │
│  │    React    │    │   Sanity    │    │   Firebase  │                 │
│  │   Frontend  │◄───┤     CMS     │    │   Backend   │                 │
│  │             │    │             │    │             │                 │
│  └─────────────┘    └─────────────┘    └─────────────┘                 │
│         │                   │                   │                      │
│         │                   │                   │                      │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                 │
│  │   Users     │    │   Content   │    │    Admin    │                 │
│  │ (Public)    │    │  Editors    │    │   Users     │                 │
│  │             │    │             │    │             │                 │
│  └─────────────┘    └─────────────┘    └─────────────┘                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```
---

## 🗄️ **Enhanced Entity Relationship Diagram**

### **Core Entities & Relationships (Including Phase 1 Enhancements)**
```
mermaid
erDiagram
    %% Firebase Authentication
    FIREBASE_USERS {
        string uid PK "Firebase Auth UID"
        string email
        string displayName
        string photoURL
        timestamp createdAt
        timestamp lastSignInTime
        string[] providerData
    }

    %% Firestore User Profiles
    USER_PROFILES {
        string uid PK "Same as Firebase Auth UID"
        string email
        string role "user|editor|admin"
        string status "active|inactive|suspended"
        object profile
        timestamp createdAt
        timestamp updatedAt
    }

    %% Sanity CMS - Products
    SANITY_PRODUCTS {
        string _id PK "Sanity Document ID"
        string name
        object slug
        string shortDescription
        text description
        array images
        reference category_ref FK
        string availability "available|out-of-stock|seasonal|discontinued"
        array healthBenefits
        text cookingTips
        object nutritionalInfo
        boolean isFeatured
        number sortOrder
        object seo
    }

    %% Sanity CMS - Categories
    SANITY_CATEGORIES {
        string _id PK "Sanity Document ID"
        string name
        object slug
        text description
        object image
        string color "Hex color code"
        number sortOrder
        boolean isActive
    }

    %% Sanity CMS - Blog Posts
    SANITY_BLOG_POSTS {
        string _id PK "Sanity Document ID"
        string title
        object slug
        string excerpt
        array content "Rich text blocks"
        object featuredImage
        object author
        array categories "String array"
        array tags "String array"
        datetime publishedAt
        string status "draft|published|archived"
        boolean isFeatured
        number readingTime
        object seo
    }

    %% Firebase - User Analytics
    FIREBASE_ANALYTICS {
        string docId PK
        string userId FK
        string sessionId
        string page
        timestamp timestamp
        object eventData
        string userAgent
        string ipAddress
    }

    %% Firebase - Contact Inquiries
    FIREBASE_CONTACT_INQUIRIES {
        string docId PK
        string name
        string email
        string subject
        text message
        string status "new|read|responded|closed"
        timestamp createdAt
        string respondedBy FK
        timestamp respondedAt
    }

    %% Firebase - Blog Post Views
    FIREBASE_BLOG_VIEWS {
        string docId PK
        string sanityPostId FK "Reference to Sanity blog post"
        number viewCount
        timestamp lastViewed
        array viewHistory
    }

    %% Firebase - Product Views
    FIREBASE_PRODUCT_VIEWS {
        string docId PK
        string sanityProductId FK "Reference to Sanity product"
        number viewCount
        timestamp lastViewed
        array viewHistory
    }

    %% Firebase Storage - Images
    FIREBASE_STORAGE_IMAGES {
        string path PK "Storage path"
        string filename
        string contentType
        number size
        string downloadURL
        string uploadedBy FK
        timestamp uploadedAt
        object metadata
    }

    %% Relationships
    FIREBASE_USERS ||--|| USER_PROFILES : "uid"
    USER_PROFILES ||--o{ FIREBASE_ANALYTICS : "userId"
    USER_PROFILES ||--o{ FIREBASE_CONTACT_INQUIRIES : "respondedBy"
    USER_PROFILES ||--o{ FIREBASE_STORAGE_IMAGES : "uploadedBy"
    
    SANITY_CATEGORIES ||--o{ SANITY_PRODUCTS : "category_ref"
    SANITY_BLOG_POSTS ||--o{ FIREBASE_BLOG_VIEWS : "sanityPostId"
    SANITY_PRODUCTS ||--o{ FIREBASE_PRODUCT_VIEWS : "sanityProductId"
```
---

## ⚛️ **React Frontend Architecture**

### **Component-Based Structure**

The frontend is built using React components, promoting reusability, modularity, and a clear separation of concerns.
```
┌─────────────────────────────────────────────────────────────────────┐
│                       REACT FRONTEND                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📄 Pages                  🧩 Components             ⚛️ Contexts/Hooks │
│  ├─ HomePage.js            ├─ Header.js             ├─ AuthContext.js │
│  ├─ BlogPage.js            ├─ Footer.js             ├─ DataFetchingHooks.js │
│  ├─ BlogPostPage.js        ├─ Navigation.js         └─ StateManagement.js  │
│  ├─ BusinessPage.js        ├─ ProductCard.js                           │
│  ├─ FAQPage.js             ├─ BlogPostPreview.js                       │
│  ├─ TutorialPage.js        ├─ LoadingSpinner.js                        │
│  └─ ...                    ├─ ErrorMessage.js                          │
│                            ├─ Forms/                                   │
│  🗺️ Routing                 └─ UI Elements                               │
│  ├─ react-router-dom       (Buttons, Inputs, etc.)                    │
│  ├─ Next.js Pages                                                      │
│  └─ ...                     🎨 Styling (Tailwind CSS)                  │
│                             ├─ Utility classes                          │
│  📦 Data Fetching & Logic   ├─ Component-specific styles                │
│  ├─ API calls (Sanity, Firebase) └─ Responsive design                     │
│  ├─ State Management                                                   │
│  ├─ Event Handlers                                                     │
│  └─ Client-side logic                                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```
### **Data Flow within React**

Components fetch data using hooks or services, manage their local state, and render the UI. Global state or shared data (like user authentication) is managed via React Context or a state management library.
```
javascript
// Data Flow Example within React
import useSanityData from \'../hooks/useSanityData\';
import { useAuth } from \'../contexts/AuthContext\';

function BlogPostPage({ slug }) {
    const { data: post, loading, error } = useSanityData(\'blogPost\', { slug });
    const { currentUser } = useAuth();

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage error={error} />;
    if (!post) return <NotFoundMessage />;

    return (
        <div>
            <h1>{post.title}</h1>
            <p>By {post.author?.name}</p>
            {/* Render post content */}
            {/* Conditional rendering based on currentUser */}
        </div>
    );
}
```
---

## 🔥 **Firebase Integration Architecture**

### **Firebase Services Configuration**
```
javascript
// Firebase Configuration Structure (Used in React Initialization)
const firebaseConfig = {
    projectId: "mycogen-57ade",
    authDomain: "mycogen-57ade.firebaseapp.com",
    databaseURL: "https://mycogen-57ade-default-rtdb.firebaseio.com",
    storageBucket: "mycogen-57ade.firebasestorage.app",
    // ... other config
}

// Initialized Services (Accessed via Firebase SDK in React)
┌─────────────────────────────────────────────────────────────────────┐
│                      FIREBASE SERVICES                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🔐 AUTHENTICATION      🗄️  FIRESTORE         📁 STORAGE           │
│  ├─ Email/Password      ├─ users/             ├─ images/           │
│  ├─ Google OAuth        ├─ blogs/             ├─ uploads/          │
│  ├─ Facebook OAuth      ├─ products/          ├─ temp/             │
│  ├─ Role-based access   ├─ contact-inquiries/ └─ user-avatars/     │
│  └─ Session management  ├─ analytics/                              │
│                         └─ blog-views/         📊 ANALYTICS        │
│                                                ├─ Page views       │
│  🔴 REALTIME DATABASE   ⚡ FUNCTIONS           ├─ User behavior    │
│  ├─ IoT sensor data     ├─ Image processing   ├─ Content metrics  │
│  ├─ Live notifications  ├─ Email triggers     └─ Business insights│
│  └─ Connection status   └─ Data validation                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```
### **Firebase Collections Schema**
```
yaml
# Firestore Collections Structure (Accessed by React using Firebase SDK)

users/{uid}:
  uid: string                    # Firebase Auth UID
  email: string                  # User email
  role: string                   # "user" | "editor" | "admin"
  status: string                 # "active" | "inactive" | "suspended"
  profile:
    displayName: string
    photoURL: string
    bio: string
    preferences: object
  createdAt: timestamp
  updatedAt: timestamp

contact-inquiries/{docId}:
  name: string
  email: string
  subject: string
  message: string
  status: string                 # "new" | "read" | "responded" | "closed"
  createdAt: timestamp
  respondedBy: string            # User UID
  respondedAt: timestamp

analytics/{docId}:
  userId: string                 # User UID (optional)
  sessionId: string
  page: string
  event: string
  data: object
  timestamp: timestamp
  userAgent: string
  ipAddress: string

blog-views/{docId}:
  sanityPostId: string          # Reference to Sanity blog post
  viewCount: number
  lastViewed: timestamp
  viewHistory: array

product-views/{docId}:
  sanityProductId: string       # Reference to Sanity product
  viewCount: number
  lastViewed: timestamp
  viewHistory: array
```
---

## 🎨 **Sanity CMS Architecture**

### **Sanity Schema Structure**
```
javascript
// Sanity Content Types (Defined in Sanity Studio, accessed by React Frontend)
┌─────────────────────────────────────────────────────────────────────┐
│                        SANITY CMS SCHEMAS                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🍄 PRODUCTS              🏷️  CATEGORIES           📝 BLOG_POSTS    │
│  ├─ _id                   ├─ _id                    ├─ _id          │
│  ├─ name                  ├─ name                   ├─ title        │
│  ├─ slug                  ├─ slug                   ├─ slug         │
│  ├─ shortDescription      ├─ description            ├─ excerpt      │
│  ├─ description           ├─ image                  ├─ content[]    │
│  ├─ images[]              ├─ color                  ├─ featuredImage│
│  ├─ category (ref)        ├─ sortOrder              ├─ author       │
│  ├─ availability          ├─ isActive               ├─ categories[] │
│  ├─ healthBenefits[]      └─ ...                    ├─ tags[]       │
│  ├─ cookingTips                                     ├─ publishedAt  │
│  ├─ nutritionalInfo       🔍 SEO FIELDS             ├─ status       │
│  ├─ isFeatured            ├─ metaTitle              ├─ isFeatured   │
│  ├─ sortOrder             ├─ metaDescription        ├─ readingTime  │
│  └─ seo                   └─ keywords[]             └─ seo          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```
### **Sanity Data Relationships**
```
CATEGORIES ──────────┐
    │                │
    │ (1:many)       │
    ▼                │
PRODUCTS             │
    │                │
    │ (referenced)   │
    ▼                ▼
BLOG_POSTS ─────── SEO_DATA
    │
    │ (embedded)
    ▼
RICH_CONTENT[]
├─ Text blocks
├─ Images  
├─ Callouts
└─ Links
```
---

## 🔄 **Data Flow Diagrams**

### **Content Loading Flow (React)**
```
┌─────────────┐    API Call    ┌─────────────┐    Transform/ ┌─────────────┐
│    React    │───────────────►│   Sanity    │    Map       │  React      │
│   Frontend  │                │     CMS     │──────────────►│  Components │
└─────────────┘                └─────────────┘                └─────────────┘
       ▲                                                              │
       │                                                              ▼
       │                        Rendered UI                  ┌─────────────┐
       └──────────────────────────────────────────────────────│   Browser   │
                                                              └─────────────┘
```
### **Authentication Flow (React)**
```
┌─────────────┐    Login     ┌─────────────┐    Auth State ┌─────────────┐
│    User     │─────────────►│   Firebase  │    Update    │    React    │
│ (via React) │              │    Auth     │──────────────►│  Frontend   │
└─────────────┘              └─────────────┘               └─────────────┘
       ▲                             │                             │
       │          Profile            ▼                             ▼
       │         Creation    ┌─────────────┐     Role Check ┌─────────────┐
       └────────────────────│  Firestore  │◄───────────────│  Auth Context│
                            │    Users    │                │   / Hooks   │
                            └─────────────┘                └─────────────┘
```
### **Real-time Update Flow (React)**
```
┌─────────────┐   Content    ┌─────────────┐   Firestore  ┌─────────────┐
│   Editor    │─────────────►│   Sanity    │   Change     │  Real-time  │
│   (CMS)     │              │    Studio   │──────────────►│  Listeners  │
└─────────────┘              └─────────────┘               │  (in React) │
                                     │                           │
┌─────────────┐   Analytics  ┌─────────────┐   Data       ┌─────────────┐
│  User       │─────────────►│  Firebase   │   Update     │    React    │
│ Activity    │              │  Firestore  │──────────────►│  Components │
└─────────────┘              └─────────────┘               └─────────────┘
```
---

## 🛠️ **Service Layer Architecture (React Adapted)**

### **JavaScript Services/Hooks Structure**

In a React application, the "Service Layer" often manifests as custom hooks, utility functions, and potentially dedicated service classes or libraries that are consumed by components.
```
javascript
// React Service/Data Layer Organization
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA & SERVICE LAYER (REACT)               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🎨 SANITY CLIENT & UTILS    🔥 FIREBASE SDK & UTILS                │
│  ├─ sanityClient.js         ├─ firebaseInit.js                    │
│  │  (init client)            ├─ firebaseConfig.js                   │
│  ├─ sanityQueries.js        ├─ auth/                               │
│  │  (GraphQL/GROQ queries)   │  ├─ useAuth.js (React Hook)         │
│  ├─ useSanityData.js        │  ├─ login.js (Utility function)     │
│  │  (Generic data hook)      │  └─ signup.js (Utility function)    │
│  └─ imageBuilder.js         └─ firestoreUtils.js                    │
│                                 ├─ getUserProfile.js                │
│  📊 CONTENT FETCHING HOOKS      └─ updateUserProfile.js              │
│  ├─ useBlogPosts.js                                                │
│  ├─ useProductCatalog.js    🔧 UTILITY HOOKS / FUNCTIONS         │
│  ├─ useSingleBlogPost.js     ├─ useErrorHandling.js                │
│  ├─ useSingleProduct.js      ├─ useLoadingState.js                 │
│  └─ ...                       ├─ useRealtimeUpdates.js              │
│                               ├─ seoUtils.js (Helpers for meta tags)│
│                               └─ contentRenderer.js (Sanity block) │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```
### **Service Consumption Pattern in React**

React components use hooks or imported functions to interact with data sources.
```
javascript
// Service Consumption Example in a React Component
import { useBlogPosts } from \'../hooks/useBlogPosts\';
import { useAuth } from \'../contexts/AuthContext\'; // Or global state management

function BlogPage() {
    const { posts, loading, error } = useBlogPosts({ limit: 10 });
    const { currentUser, isLoading: authLoading } = useAuth();

    if (loading || authLoading) return <LoadingSpinner />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <div>
            <h1>Latest Blog Posts</h1>
            <div className=\"post-list\">
                {posts.map(post => (
                    <BlogPostPreview key={post._id} post={post} />
                ))}
            </div>
        </div>
    );
}
```
---

## 🔒 **Security & Access Control**

### **Firebase Security Rules**
```
javascript
// Firestore Security Rules Structure (Remains the same, enforced on the backend)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User profiles - users can read/write their own
    match /users/{userId} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
      allow read: if request.auth != null 
                  && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'editor'];
    }
    
    // Contact inquiries - authenticated users can create, admins can manage
    match /contact-inquiries/{docId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null 
                                   && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Analytics - system writes, admins read
    match /analytics/{docId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null 
                  && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // View counters - public read, system increment (handled server-side or via Function)
    match /{viewType}-views/{docId} {
      allow read: if true; // Allow public read for views
      allow write: if false; // Prevent client writes directly
      // Consider using Firebase Functions to increment views securely
    }
  }
}
```
### **Role-Based Access Control (Frontend Handling)**

While Firebase Security Rules enforce access on the backend, the React frontend implements UI logic based on user roles fetched from the user profile.
```
yaml
# User Roles & Permissions (Frontend UI Logic based on User Profile Role)
roles:
  user:
    permissions:
      - Display: public content (blog posts, products)
      - Access: public pages (Home, Blog, Shop, etc.)
      - Submit: contact forms
      - View/Edit: own profile
    
  editor:
    inherits: user
    permissions:
      - Access: Sanity CMS Studio link
      - Access: Editor-specific dashboard/features (if any)
    
  admin:
    inherits: editor
    permissions:
      - Access: Admin-specific dashboard/features (if any)
      - View: analytics summaries
```
---

## 🔌 **API Integration Points**

### **External API Endpoints (Accessed by React Frontend)**
```
yaml
# Sanity CMS API
sanity_api:
  base_url: "https://[PROJECT_ID].api.sanity.io"
  version: "v2024-01-01"
  endpoints:
    query: "/data/query/production" # Use GROQ/GraphQL queries
    images: "/images/production"    # Image asset URLs
    listen: "/data/listen/production" # Real-time updates (if used)

# Firebase APIs (Accessed by React Frontend via SDK)
firebase_api:
  auth: "https://identitytoolkit.googleapis.com/v1"
  firestore: "https://firestore.googleapis.com/v1"
  storage: "https://storage.googleapis.com/storage/v1"
  analytics: "https://www.googleapis.com/analytics/v3" # Via SDK

# Content Delivery
cdn:
  sanity_images: "https://cdn.sanity.io/images/[PROJECT_ID]/production"
  firebase_storage: "https://firebasestorage.googleapis.com/v0/b/[BUCKET]/o"
```
### **Data Synchronization Flow (React Context)**
```
Content Creation Flow:
1. Editor creates content in Sanity Studio
2. Sanity validates and stores content
3. React Frontend uses Sanity Client to fetch data (e.g., in useEffect or data hooks)
4. Fetched data updates React component state
5. UI re-renders with new content

User Interaction Flow:
1. User interacts with website (view, click, etc.) in React UI
2. Event handlers trigger updates to Firebase (e.g., increment view count via Function)
3. Firebase updates data
4. Real-time listeners (in React hooks/components) receive updates
5. React state is updated, UI re-renders

Real-time Update Flow:
1. Content changes in Sanity or data changes in Firebase
2. Sanity Listen API or Firebase Firestore Listeners notify React Frontend
3. React components/hooks subscribed to these listeners receive updates
4. Component state is updated
5. UI re-renders in real-time
```
---

## 📊 **Performance & Monitoring (React Context)**

### **Caching Strategy (React Adapted)**
```
javascript
// Multi-layer Caching (Integrated within React and Deployment)
┌─────────────────────────────────────────────────────────────────────┐
│                         CACHING LAYERS (REACT)                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🌐 CDN CACHE              ⚛️ REACT STATE/CONTEXT 💾 SERVICE WORKER│
│  ├─ Sanity images          ├─ Component local state  ├─ Offline pages │
│  ├─ Static assets          ├─ Shared app state       ├─ API responses │
│  └─ Built assets (JS/CSS)  ├─ Data fetching hooks    └─ Asset cache   │
│                            └─ Auth context                            │
│  🔄 DATA FETCHING CACHE    📱 BROWSER CACHE          🚀 SSR/SSG CACHE │
│  ├─ In-memory cache        ├─ Static files           ├─ Page pre-render│
│  ├─ Library cache          ├─ CSS/JS                 ├─ API route cache│
│  │  (e.g., SWR, React Query) └─ Images                 └─ Built HTML     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```
### **Monitoring Points (React Integrated)**
```
yaml
# System Monitoring (Integrated via React Lifecycle & Analytics)
monitoring:
  performance:
    - page_load_times (Framework dependent, e.g., Next.js metrics)
    - api_response_times (Logged in data fetching hooks)
    - image_loading_speed (Optimized images)
    - time_to_first_contentful_paint (Framework dependent)
  
  availability:
    - sanity_cms_uptime (Monitor API calls)
    - firebase_services_status (Monitor SDK status)
    - website_uptime (Hosting platform)
    - cdn_performance
  
  user_experience:
    - bounce_rate (Analytics)
    - page_views (React Router/Next.js events)
    - user_interactions (React event handlers logging to Analytics)
    - conversion_metrics (Analytics)
  
  errors:
    - react_component_errors (Error Boundaries)
    - javascript_errors (Global error handler)
    - api_failures (Logged in data fetching hooks)
    - authentication_issues (Auth context error handling)
    - data_loading_failures (Logged in data hooks/components)
```
---

## 🚀 **Deployment Architecture (React)**

### **Hosting & Deployment Strategy (React Specific)**
```
┌─────────────────────────────────────────────────────────────────────┐
│                     DEPLOYMENT PIPELINE (REACT)                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📝 DEVELOPMENT          🔧 BUILD PROCESS           🚀 DEPLOYMENT    │
│  ├─ Local React Dev Server ├─ Webpack/Vite Build    ├─ Vercel/Netlify│
│  ├─ Sanity Studio        ├─ Babel Transpilation     │   (for Next.js/ │
│  ├─ Firebase emulators   ├─ Asset Optimization      │   Gatsby)     │
│  └─ Hot Module Replacement├─ Code Splitting          ├─ Firebase     │
│                            └─ Bundle Generation       │   Hosting     │
│                                                     └─ Custom Hosting │
│  🧪 TESTING              ⚙️  CONFIGURATION                          │
│  ├─ Unit tests           ├─ Environment variables   📊 MONITORING   │
│  ├─ Integration tests    ├─ Security rules (Firebase)├─ Error tracking│
│  ├─ Component tests      ├─ API keys management    ├─ Analytics     │
│  └─ E2E tests            └─ Database indexes       └─ Alerts       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```
---

## 🎯 **Key Integration Points Summary (React Context)**

### **Critical Data Flows**

1. **Content Management**: Sanity CMS → React Data Hooks → React Components → Frontend Display
2. **User Authentication**: Firebase Auth → React Auth Context/Hooks → React Components (Conditional Rendering/Routing)
3. **Real-time Updates**: Content Changes → Firebase/Sanity Listeners → React Hooks → React Components (State Updates)
4. **Analytics**: User Actions (React Events) → Firebase Analytics SDK
5. **File Management**: User Uploads (React UI) → Firebase Storage SDK → CDN Delivery

### **System Dependencies**
```
yaml
# Critical Dependencies
critical_services:
  - firebase_auth: "User authentication and session management"
  - sanity_cms: "Content creation and management"
  - firebase_firestore: "User data and analytics storage"
  - firebase_storage: "File uploads and media management"
  - react: "Frontend UI library"
  - react_framework: "Routing, SSR/SSG (e.g., Next.js)"

optional_services:
  - firebase_analytics: "User behavior tracking"
  - firebase_realtime_db: "IoT sensor data (future feature)"
  - firebase_functions: "Server-side processing (future feature)"
  - third_party_apis: "Payment processing, email services (future)"
```
This architecture provides a robust, scalable foundation for the MYCOGEN mushroom farming business website with a modern React frontend, leveraging Sanity and Firebase for content and backend services.

---

**Last Updated**: August 2024  
**Version**: 1.1 (React Adapted)
**Maintainer**: MYCOGEN Development Team