# V2 Authentication System

## Overview
The V2 system uses Google Authentication for simplified user onboarding and cross-device sync. It follows Google's Branding Guidelines to ensure a premium and trustworthy user experience.

## Implementation Details
- **Library**: `vue3-google-login`
- **Identity Provider**: Google (OAuth 2.0)
- **Firebase Integration**: The application exchanges the Google Credential for a Firebase Auth Credential.

## Authentication Flow
1. **User Interaction**: User clicks the "Sign in with Google" button in `Login.vue`.
2. **Google OAuth**: A popup or redirect occurs where the user selects their account.
3. **Response Handling**: The `vue3-google-login` library returns a `CredentialCallback`.
4. **Firebase Token Exchange**: 
   - We extract the `response.credential`.
   - We create a Firebase `GoogleAuthProvider.credential`.
   - We call `signInWithCredential(auth, credential)`.
5. **Session Management**: Firebase persists the session.
6. **Reactive Navigation**: `App.vue` listens to `onAuthStateChanged` to dynamically toggle between **Login** and **Logout** links.
7. **Router Guards**: 
   - Uses an async `getCurrentUser` helper to ensure the auth state is fully initialized before routing.
   - Redirects unauthenticated users to `/login` for protected routes.
   - Redirects authenticated users away from `/login` back to the dashboard.

## Branding Adherence
- Official Google Sign-In button component is used to ensure compliance with logo, font, and padding requirements.
- The button is placed in a centered, clean container as per best practices.

## Configuration
- `VITE_GOOGLE_CLIENT_ID`: Required in `.env` for the OAuth flow to work.
