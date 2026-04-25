# AfriSole - Luxury Luxury E-Commerce

AfriSole is a "Quiet Luxury" boutique e-commerce platform for handcrafted African footwear. 
It features a high-performance 3D shoe customizer, real-time inventory monitoring, and a bespoke customer dashboard.

## Technical Stack
- **Frontend**: Vite + React, Tailwind CSS v4, TypeScript
- **3D Rendering**: Three.js, React Three Fiber, Drei
- **Backend**: Firebase (Firestore, Auth, Storage)
- **State Management**: Zustand
- **Animations**: GSAP (Scrollytelling), Motion

## Firebase Console Setup Instructions

### 1. Authentication
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. Navigate to **Authentication** > **Sign-in method**.
4. Enable **Google** sign-in.

### 2. Firestore Database
1. Navigate to **Firestore Database**.
2. If you haven't already, create a database in your preferred region.
3. The application will use the collections: `products`, `orders`, `users`, and `admins`.
4. **Admin Setup**: To grant yourself admin access for the `/admin` route:
   - Create a collection named `admins`.
   - Create a document with your `uid` (found in Auth tab) as the Document ID.
   - You don't need any fields, just the existence of the document grants access.

### 3. Security Rules
The security rules have been deployed automatically from `firestore.rules`. 
- **Products**: Publicly readable, writable only by admins.
- **Orders**: Readable/Writable only by the owner or admins.
- **Users**: Private data accessible only to the owner.

### 4. Storage Buckets
1. Navigate to **Storage**.
2. Click **Get Started** and follow the prompts.
3. Create a folder named `product_images` for your high-res artisan photography.

## Admin Drops
1. Sign in via the `/dashboard` page.
2. Navigate to `/admin`.
3. If your UID is in the `admins` collection, you can toggle `isLive` status and update real-time stock levels.
4. When stock falls below 5, the "Scarcity Engine" in the Shop triggers an alert for buyers.

## 3D Customizer
- Swap materials between **Akwete**, **Ankara**, and **Bespoke Leather**.
- Interactive Orbit controls for 360-degree inspection.
- Real-time texture swapping and personalization (Initials).
