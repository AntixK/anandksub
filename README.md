# My Static Site Generator

TODO
- [ ] Basic Features
  - [ ] Convert markdown to HTML
  - [ ] Directly render HTML
  - [ ] Pagination
  - [ ] Pre-commit hooks
  - [ ] Math support
  - [ ] footnotes support
  - [ ] Utility Functions
    - [ ] recent posts
    - [ ] sorted posts list
    - [ ] read time
  - [ ] Live updates
  - [ ] Shortcodes
  - [ ] Metrics (web-page sizes)
  - [ ] Build-time
  - [ ] logging
  - [ ] Convert fonts to woff2 (atleast set warning)
  - [ ] Katex macros
- [ ] Advanced Features
  - [ ] Resize Images
  - [ ] Auto convert images to webp
  - [ ] Pre-render equations
  - [ ] Pre-render code highlighting
  - [ ] Minify HTML
  - [ ] RSS Feed

goals
- Minimal dependencies
- fast load and reload times
- Optimized output
- well tested
  
Non-goals
1. Support for mdx
2. Support for sass


## Usage

```
.
├── assets
│   ├── fonts
│   └── icons
├── build
│   ├── blog
│   │   └── clever-trick-reparam.html
│   └── _css
│       └── ak.css
├── config.toml
├── content
│   ├── 403.md
│   ├── 404.md
│   ├── blog
│   │   └── clever-trick-reparam.md
│   ├── index.md
│   ├── media
│   └── notes
├── _css
│   └── ak.css
├── _libs
├── LICENSE
├── README.md
├── requirements.txt
├── ssg.py
└── _templates
    ├── head.html
    └── page_foot.html
```