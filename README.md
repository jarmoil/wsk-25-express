## Authorization Rules

### Roles

- **Admin**: Can update or delete any user or cat.
- **User**: Can only update or delete their own data.

### Protected Routes

1. **PUT `/api/v1/cats/:id`**

   - **Description**: Update a cat's information.
   - **Authorization**: Only the owner of the cat can update it.
   - **Middleware**: `authenticateToken`, `checkCatOwnership`

2. **DELETE `/api/v1/cats/:id`**

   - **Description**: Delete a cat.
   - **Authorization**: Only the owner of the cat can delete it.
   - **Middleware**: `authenticateToken`, `checkCatOwnership`

3. **PUT `/api/v1/users/:id`**
   - **Description**: Update a user's information.
   - **Authorization**: Users can only update their own information.
   - **Middleware**: `authenticateToken`, `checkUserOwnership`

### Example Error Responses

- **403 Forbidden**: Returned when a user tries to access or modify a resource they do not own.
  ```json
  {
    "message": "Forbidden: Not the owner of the cat"
  }
  ```

## Role-Based Authorization Rules

1. **PUT `/api/v1/cats/:id`**

   - **Admin**: Can update any cat.
   - **User**: Can only update their own cats.

2. **DELETE `/api/v1/cats/:id`**

   - **Admin**: Can delete any cat.
   - **User**: Can only delete their own cats.

3. **PUT `/api/v1/users/:id`**

   - **Admin**: Can update any user.
   - **User**: Can only update their own data.

4. **DELETE `/api/v1/users/:id`**
   - **Admin**: Can delete any user.
   - **User**: Can only delete their own data.
