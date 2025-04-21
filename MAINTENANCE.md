# Maintenance Guide

1. Make release commit
    ```bash
    npm version patch
    # or
    npm version minor
    # or
    npm version major
    ```
1. Make a new git tag
    ```bash
    git tag -a <NEW_VERSION>
    ```
1. Push all to upstream
    ```bash
    git push origin master --follow-tags
    ```
1. [Create](https://github.com/lowitea/obsidian-tasks-cleaner/releases/new) a new release specifying pushed tag
