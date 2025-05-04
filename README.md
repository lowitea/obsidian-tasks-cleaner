# Tasks Cleaner Plugin

🧹 **Tasks Cleaner** is a plugin for [Obsidian](https://obsidian.md) that helps you automatically remove old completed tasks from your Markdown notes. It's perfect for users who track tasks with completion dates and want to keep their notes tidy.

This plugin is fully compatible with the [Tasks plugin](https://github.com/obsidian-tasks-group/obsidian-tasks). But it can also work separately.

## 🛠 Features

-   Detect completed tasks using a customizable regular expression.
-   Delete tasks older than a specified number of days.
-   Remove associated descriptions (indented lines under the task).
-   Filter which files to clean based on filename patterns.
-   Confirmation modal before deletion with a task summary.
-   Fully configurable via plugin settings.

## 📥 Installation

Follow the steps below to install Tasks Cleaner.

-   Search for "Tasks Cleaner" in Obsidian's community plugins browser
-   Enable the plugin in your Obsidian settings (find "Tasks Cleaner" under "Community plugins").
-   Check the settings. It makes sense to set the global filter early on (if you want one).

## ⚙️ Settings

Open **Settings → Community Plugins → Tasks Cleaner** to configure the plugin:

-   **Delete tasks older than (days):**
    Specifies how many days old a completed task must be to qualify for deletion.
    Default: `7`

-   **Task pattern (Regex):**
    Regular expression used to detect completed tasks.
    Must contain a capture group for the completion date (e.g. `(\d{4}-\d{2}-\d{2})`).
    Default: `- \[x\].*?✅\s*(\d{4}-\d{2}-\d{2})`

-   **Filename filter:**
    If set, only files whose names contain this string will be scanned.
    Leave empty to scan **all** Markdown files.

## ✅ Task Format

The plugin looks for completed tasks that include a completion date in this format:

```markdown
-   [x] Fixed the bug ✅ 2024-12-01
        This issue only appears in Firefox
        Additional explanation
```

If the completion date is older than the threshold, the task and all indented lines below it will be deleted.

## 💡 Example

Given a file TODO Project.md:

```markdown
-   [x] Fix bug ✅ 2024-12-01
        This happens in Firefox
-   [ ] Implement feature
```

If the threshold is 7 days, the first task and its description will be removed after confirmation.

## 🛡 Safe Deletion

Before deleting, the plugin displays a confirmation modal showing how many tasks will be removed from each file. Nothing is deleted until you confirm.

Keep your notes clean and focused — with Tasks Cleaner ✨
