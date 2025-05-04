# Maintenance Guide

1. Make release commit
    ```bash
    npm version patch
    # or
    npm version minor
    # or
    npm version major
    ```
1. Push all to upstream
    ```bash
    git push origin master --follow-tags
    ```
1. Build release `main.js`
    ```bash
    npm run build
    ```
1. [Create](https://github.com/lowitea/obsidian-tasks-cleaner/releases/new) a new release specifying pushed tag
   ⚠️ Add `main.js`, `style.css`, `manifest.json` to the release assets
