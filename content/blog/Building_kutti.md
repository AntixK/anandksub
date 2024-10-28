@def title = "Building my own static site generator"
@def published = "28 October 2024"
@def description = "The zillionth post about building a static site generator."
@def tags = ["static-site-generator", "python"]
@def is_draft = false
@def show_info = true
@def has_code = true
@def has_chart = false
@def has_math = false


&emsp; Until last week, this site was build using the [Franklin.jl](https://github.com/tlienart/Franklin.jl) static site generator, written in Julia. It was quite new back when I first started using it in 2021. At that point, I was learning the Julia language, partly for work and partly out of curiosity. Franklin.jl provided a nice opportunity to learn Julia, outside of the scientific computing domain. As such, I wrote a handful of useful Julia scripts to automate some of the HTML rendering tasks.

However, the development of the Franklin.jl project has since been slow, with numerous of unaddressed issues and feature requests. Furthermore, the built-time was getting slower and slower - for instance, it took me almost 3 minutes to build and launch the site locally. This was not acceptable to me, as I wanted to quickly be able to iterate on the site design and content.

After procrastinating for a year, I finally decided to build my own static site generator. I could have used any of the existing static site generators, but I had the following requirements -
1. Seamless migration of the existing content and with no visual changes. This includes the custom divs, HTML-in-Markdown, custom CSS, and support for JS libraries like KaTeX, chart.js, and highlight.js.
2. It should be blazing fast - my target was a build time of less than 50ms. Additionally, it should have hot-reloading capability.
3. It should have minimal dependencies, and a small codebase. My ideal requirement was to write content on my Ipad Pro, and deploy the site.


## Introducing Kutti

&emsp; Kutti (*lit.* small in Tamizh) is my purpose-built static-site generator. It is customized to my *current* needs. I am happy with it's current state and after some testing, I hope to declare it feature-complete. It is primarily for my personal use, however the [code](https://github.com/AntixK/anandksub) is available publicly for anyone to read and use.

```plaintext
My site
  ├── assets
  │   ├── fonts       # Put all your fonts here
  │   └── icons       # Put all your icons here
  ├── __site          # All your built files will be here
  │                   # Just deploy this directory when publishing
  ├── config.toml     # Default website configuration
  ├── content         # Put all your site content here
  │   ├── 404.html
  │   ├── blog
  │   │   ├── index.html # Front page of blog section
  │   │   └── article.md
  │   ├── index.html     # Front page
  │   ├── media          # Put your site media here
  │   └── notes          # You can also include other folders
  │       ├── index.html # Front page of notes section
  │       └── note1.md
  ├── _css               # Put your style sheets here
  │   └── minimal.css
  ├── _libs              # Put all your js libraries here
  ├── LICENSE
  ├── README.md
  ├── requirements.txt
  ├── kutti.py           # Main site builder
  └── _templates         # Contains all the default template
```

Kutti is a single-file Python script that reads a `content` directory. This contains all my content - including markdown, HTML, and media files. Kutti scans this directory and renders everything into a `__site` directory with the directory structure intact. The `__site` directory is what I deploy to my server, using Netlify. The HTML templates files and the CSS files are available in the `_templates` and `_css` directories, respectively.

I also refactored my messy CSS files into a single minimal CSS file.

I use the wonderful [`mistletoe`](https://github.com/miyuchina/mistletoe) library to parse and render markdown files. Mistletoe quickly became my favourite for its speed, simplicity, and extendability. It is an excellent example of the KISS (Keep It Simple, Stupid) principle. I could easily extend it to support the following
1. Render embedded HTML in markdown files. Any HTML code within `!!!` block will be rendered as is. This is quite useful for adjusting media and displaying interactive charts.
2. Footnote support with backlinks. I also added the functionality to number the footnotes instead of using the default human-readable tags.
3. Support for custom divs. I can now use `::: <div-name>` blocks to render content within `div` with custom CSS classes. This is useful for creating algorithm blocks and callout boxes.
4. Support for equation labels. Since my blog is math-heavy, I need a way to refer back to equations using labels.

The fact that all of this could be done easily and with a few lines of code, is testament to mistletoe's design. A crucial feature of mistletoe that enabled all of the above is the precedence rules. This allowed me to parse the foonote and equation labels at the end, to avoid any conflicts.

Kutti supports templates and hot-reloading using the `jinja2` and  `watchdog` libraries respectively. To maintain simplicity, I use a single template for both articles and notes, while other pages are written in HTML with standardized headers and footers. Finally, the site metadata and build configurations can be customized thorough the `config.toml` file.

The site can be built using

```python
python kutti.py
```

This launches a local server at `http://localhost:8188` with hot-reloading enabled. My current site was built in less than 30ms. I have setup Netlify such that a simple push to the GitHub repository triggers a deploy action from the `__site` directory.

Kutti also has some quality-of-life features like comprehensive logging, scanning for unoptimized media files, and HTML minification.


## Conclusion

It was a joy to build my own static site generator to satisfy my needs. I have tried to use only pure-python libraries for easy portability - especially to build it on my Ipad on the go.
