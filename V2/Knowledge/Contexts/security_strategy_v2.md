# V2 Security Strategy

## Multi-Layer Isolation
V2 employs a defense-in-depth strategy combining code-level pathing with database-level enforcement.

### 1. App ID Isolation
The pathing strategy uses an `{appId}` root for data organization. Strict enforcement via App Check is currently **deferred** to Issue #162. During this intermediate phase, the rules require only a valid Firebase Auth token.

```plaintext
match /{appId}/{collectionName}/{documentId} {
  allow read, write: if request.auth != null;
}
```

### 2. Identity and Ownership
- **User Authentication**: All requests require a valid Firebase Auth token.
- **Character Ownership**: A user can only write to a character document if their `uid` matches the `ownerUid` field.
- **DM Visibility**: DMs can read character data if the character is part of a party where the user is the `dmUid`.

## Deployment
These rules should be deployed via the Firebase CLI:
`firebase deploy --only firestore:rules`
