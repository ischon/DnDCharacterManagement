# V2 Security Strategy

## Multi-Layer Isolation
V2 employs a defense-in-depth strategy combining code-level pathing with database-level enforcement.

### 1. App ID Isolation
The pathing strategy uses an `{appId}` root for data organization. Strict enforcement via App Check is currently **deferred** to Issue #162. 

V2 uses a **"Deny by Default"** strategy. No collection is accessible unless explicitly permitted by ownership-based rules.

```javascript
match /{appId}/{collectionName}/{documentId} {
  allow read, write: if false; // Universal baseline
  
  // Specific collection allow-lists follow here...
}
```

### 2. Identity and Ownership
- **User Authentication**: All requests require a valid Firebase Auth token.
- **Character Ownership**: A user can only write to a character document if their `uid` matches the `ownerUid` field.
- **DM Visibility**: DMs can read character data if the character is part of a party where the user is the `dmUid`.

## Deployment
These rules should be deployed via the Firebase CLI:
`firebase deploy --only firestore:rules`
