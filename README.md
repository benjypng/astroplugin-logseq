# astroplugin-logseq
![Version](https://img.shields.io/github/v/release/benjypng/logseq-freehand-plugin?style=flat-square&color=0969da) ![Downloads](https://img.shields.io/github/downloads/benjypng/logseq-freehand-plugin/total?style=flat-square&color=orange) ![License](https://img.shields.io/github/license/benjypng/logseq-freehand-plugin?style=flat-square)

> Turn [Logseq](https://logseq.com/) into a headless CMS for your [Astro](https://astro.build/) blog.

---

This plugin creates a synchronization bridge between a local Logseq graph and Astro Content Collections.

It operates by polling the Logseq HTTP API for pages containing specific tags and writing them as Markdown files to defined directories within an Astro project. This allows a Logseq graph to function as a content source for static site generation without manual export steps.

## Functionality
* **API Polling:** Connects to the local Logseq HTTP API to retrieve page content.
* **Selective Sync:** Filters pages based on user-defined tags (e.g., `blog`, `notes`) and maps them to specific target directories.
* **Block Preservation:** Maintains the hierarchy of Logseq blocks, rendering them as nested lists in the output Markdown.
* **Change Detection:** Compares fetched content against existing files on disk to minimize unnecessary write operations.

## Installation
npm install astroplugin-logseq

## Configuration
### 1. Enable Logseq HTTP API
For this plugin to function, the Logseq HTTP API must be active:

1.  Navigate to **Settings** > **Features** in Logseq.
2.  Enable **HTTP API Server**.
3.  In the **Authorization tokens** section, generate a new token.

### 2. Integration Setup
Add the integration to `astro.config.mjs`. The configuration accepts a `targets` array to map specific Logseq tags to corresponding file system paths.

```typescript
import { defineConfig } from 'astro/config';
import logseq from 'astroplugin-logseq';

export default defineConfig({
  integrations: [
    logseq({
      // Required: The authorization token generated in Logseq
      token: 'YOUR_SECRET_LOGSEQ_TOKEN',

      // Required: mapping tags to destination directories
      targets: [
        {
          tag: 'blog',
          directory: 'src/content/blog'
        },
        {
          tag: 'notes',
          directory: 'src/content/notes'
        }
      ],

      // Optional: API URL (defaults to http://127.0.0.1:12315/api)
      apiUrl: 'http://127.0.0.1:12315/api',
      
      // Optional: Polling interval in ms (defaults to 500)
      pollingInterval: 1000,
    })
  ],
});
```

### 3. Usage
Once configured, the plugin will poll the API when the Astro development server is running (`npm run dev`).

To trigger a sync for a specific page, add the configured tag to the page properties or body in Logseq:

## Metadata Handling
The plugin currently generates Frontmatter based on the available system data from the Logseq API:

* **Title:** Mapped from the Logseq Page Title.
* **Date:** Mapped from the Logseq `created-at` timestamp.

*Note: The ability to override the date via custom page properties is not yet implemented.*

**Output Example:**

---
title: "Project Documentation"
date: 1767755762522
---

Primary block content.

  - Child block 1
  - Child block 2
    - Grandchild block

## ☕️ Support
If you enjoy this plugin, please consider supporting the development!

<div align="center">
  <a href="https://github.com/sponsors/benjypng"><img src="https://img.shields.io/badge/Sponsor-GitHub-ea4aaa?style=for-the-badge&logo=github" alt="Sponsor on Github" /></a>&nbsp;<a href="https://www.buymeacoffee.com/hkgnp.dev"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee" /></a>
</div>

## License
MIT
