# My Static Site Generator

TODO
- [ ] Basic Features
  - [x] Convert markdown to HTML
  - [x] Directly render HTML
  - [ ] Pagination
  - [ ] Pre-commit hooks
  - [x] Math support
  - [ ] footnotes support
  - [ ] Utility Functions
    - [ ] recent posts
    - [ ] sorted posts list
    - [x] read time
  - [ ] Live updates
  - [ ] Shortcodes
  - [ ] Metrics (web-page sizes)
  - [ ] Build-time
  - [ ] logging
  - [ ] Convert fonts to woff2 (atleast set warning)
  - [x] Katex macros
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
- Prefer pure python libs
  
Non-goals
1. Support for mdx
2. Support for sass

Note:
1. For block math code, you need a new line before and after the $$.


Bugs
- [x] Replace @ defs with ::
- [x] Handle images
- [ ] Eqrefs
- [x] Divs
- [ ] clipboard
- [ ] chart.js
 
## Usage

```
antixk.dev
  ├── assets
  │   ├── fonts       # Put all your fonts here
  │   └── icons       # Put all your icons here
  ├── build           # All your built files will be here
  │                   # Just deploy this directory when publishing
  ├── config.toml     # Default website configuration
  ├── content         # Put all your site content here
  │   ├── 403.md
  │   ├── 404.md
  │   ├── blog
  │   │   └── article.md
  │   ├── index.md    # Front page
  │   ├── media       # Put your site media here
  │   └── notes       # You can also include notes to be published
  ├── _css            # Put your style sheets here
  │   └── minimal.css
  ├── _libs           # Put all your js libraries here
  ├── LICENSE
  ├── README.md
  ├── requirements.txt
  ├── ssg.py          # Main site builder
  └── _templates      # Contains all the default template
```

```
python -m ssg.py render --clean --optimize
python -m ssg.py --help
python -m ssg.py serve
python -m ssg.py test_performance
```