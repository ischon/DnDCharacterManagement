# V2 Database Pathing Strategy

## Overview
To ensure strict isolation between different environments (Dev, Staging, Prod) and potentially different deployments, V2 implements a global pathing strategy where every database reference is prefixed with a verified **App ID**.

## Path Structure
The root of every path is the `appId`:
`{appId}/{collection}/{document}`

Example:
- `1:123456789:web:abcdef/users/uid_123`
- `1:123456789:web:abcdef/characters/char_456`

## Implementation Details
The `FirestoreService` automatically prepends the `VITE_FIREBASE_APP_ID` to all collection and document references. This centralizes the logic and prevents hardcoded environmental paths in UI components or stores.

### FirestoreService.ts
```typescript
private getPath(collectionName: string, documentId?: string): string {
  return documentId ? `${this.appId}/${collectionName}/${documentId}` : `${this.appId}/${collectionName}`;
}
```

## Security Rule Enforcement
Security rules are designed to validate that the `appId` in the request path matches the `app_id` in the App Check token:

```plaintext
match /{appId}/{document=**} {
  allow read, write: if appId == request.appCheck.token.app_id;
}
```
This ensures that even if a project configuration is leaked, unauthorized apps cannot access data belonging to another App ID.
