#!/bin/bash
# Script to push code to GitHub

echo "Pushing code to GitHub..."

# Initialize git if not already initialized
if [ ! -d .git ]; then
    git init
fi

# Add all files
git add .

# Commit
git commit -m "Deploy ServiciiPentruRomani"

# Remove old origin if it exists
git remote remove origin 2>/dev/null

# Add new origin
git remote add origin https://github.com/CsokeSebastian/Servicii-Pentru-Romani.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main

echo ""
echo "✅ Code pushed to GitHub successfully!"
echo ""
echo "Next steps:"
echo "1. Go to https://app.netlify.com"
echo "2. Click 'Add new site' → 'Import an existing project'"
echo "3. Choose GitHub and select 'Servicii-Pentru-Romani' repository"
echo "4. Deploy and add environment variables (see DEPLOYMENT_GUIDE.md)"
