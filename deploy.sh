#!/bin/bash

git stash
if git show-ref --verify --quiet refs/heads/gh-pages; then
    echo "Checking out existing gh-pages branch"
    git checkout gh-pages
else
    echo "Creating and checking out new gh-pages branch"
    git checkout -b gh-pages
fi

git rm -rf . || true
git clean -fdx || true

echo "Pulling from main branch to overwrite gh-pages"
git pull origin main --force

echo "Building the project"
npm run build

mkdir -p docs

echo "Copying build files to docs directory"
cp -r .next/* docs/ || echo "Build directory not found. Please check your build output path."

echo "Committing changes to gh-pages branch"
git add docs
git commit -m "Deploy to GitHub Pages: $(date)"

echo "Pushing to gh-pages branch"
git push origin gh-pages

git checkout -

git stash pop || true

echo "Deployment complete!"