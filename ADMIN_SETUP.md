# Admin Panel Setup Guide

This guide will help you set up and use the admin panel for your business directory.

## Features

The admin panel provides the following functionality:

- **Dashboard**: Overview of platform statistics (total businesses, messages, monthly activity)
- **Business Management**: Add, edit, and delete businesses
- **Message Viewer**: View and manage contact form submissions
- **Secure Authentication**: Session-based login system

## Initial Setup

### Step 1: Create Your First Admin User

Run the following command to create an admin account:

```bash
npm run create-admin
```

You will be prompted to enter:
- Admin Name
- Admin Email
- Password

Example:
```
=== Create Admin User ===

Admin Name: John Doe
Admin Email: admin@example.com
Password: your-secure-password

✓ Admin user created successfully!
```

### Step 2: Access the Admin Panel

Once your admin user is created, you can log in at:

```
https://your-domain.com/admin/login
```

Or during development:
```
http://localhost:3000/admin/login
```

## Admin Panel Pages

### 1. Dashboard (`/admin/dashboard`)
- View total businesses and messages
- See monthly statistics
- Quick links to main functions

### 2. Businesses (`/admin/businesses`)
- View all businesses in a searchable table
- Add new businesses with all details
- Edit existing business information
- Delete businesses
- Search by name, category, city, or phone

### 3. Messages (`/admin/messages`)
- View all contact form submissions
- Search through messages
- Reply to messages via email
- Delete messages

## Managing Businesses

### Adding a Business

1. Go to `/admin/businesses`
2. Click "Adaugă Afacere"
3. Fill in the required fields:
   - Nume Afacere (Business Name)
   - Categorie (Category)
   - Adresă (Address)
   - PLZ (Postal Code)
   - Oraș (City)
   - Telefon (Phone)
4. Optionally add GPS coordinates (Latitudine/Longitudine)
5. Click "Salvează"

### Editing a Business

1. Go to `/admin/businesses`
2. Find the business in the list
3. Click the pencil icon
4. Update the information
5. Click "Salvează"

### Deleting a Business

1. Go to `/admin/businesses`
2. Find the business in the list
3. Click the trash icon
4. Confirm the deletion

## Security Features

- Password hashing using SHA-256
- Session-based authentication
- 7-day session expiration
- Secure token validation
- Protected API endpoints

## Creating Additional Admin Users

To create more admin users, simply run the setup command again:

```bash
npm run create-admin
```

Each admin will have full access to all admin functions.

## Troubleshooting

### Cannot Log In

1. Verify your admin user was created successfully
2. Check that you're using the correct email and password
3. Clear your browser cache and try again

### Edge Functions Not Working

The admin system relies on three edge functions:
- `admin-login`: Handles authentication
- `admin-verify`: Verifies session tokens
- `admin-logout`: Handles logout

These are automatically deployed and configured.

## Database Tables

The admin system uses these tables:

- `admin_users`: Stores admin credentials
- `admin_sessions`: Manages login sessions
- `businesses`: Your business directory
- `contact_messages`: Contact form submissions

All tables have Row Level Security (RLS) enabled for maximum security.
