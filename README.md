# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

---

## Firebase Configuration

To run this application and use Firebase services, you need to configure your Firebase project correctly. Please follow the steps below.

### 1. Set up your Firebase API Key

Your application needs a Firebase Web API Key to connect to your Firebase project.

1.  **Find your API Key:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Select your project (`studio-8025684314-1fc15`).
    *   Click the **Project Overview** gear icon ⚙️ and select **Project settings**.
    *   Under the **General** tab, in the "Your apps" card, select the "Web" app (it might be named `nextn` or similar).
    *   In the app settings, find the **Firebase SDK snippet** section and select **Config**.
    *   Copy the `apiKey` value.

2.  **Create and configure the environment file:**
    *   In your project's root directory, create a new file named `.env.local`.
    *   Add the following line to the file, replacing `YOUR_API_KEY` with the key you copied from the Firebase console.

    ```.env.local
    NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
    ```

### 2. Enable Authentication Providers

This application is configured to use Anonymous and Email/Password authentication. You must enable them in the Firebase console.

1.  Go to the [Firebase Console](https://console.firebase.google.com/) and select your project.
2.  In the left-hand menu, go to **Build > Authentication**.
3.  Click the **Sign-in method** tab.
4.  Enable the following providers:
    *   **Email/Password**
    *   **Anonymous**

After completing these steps, your application will be able to authenticate users and connect to Firebase services without errors.
