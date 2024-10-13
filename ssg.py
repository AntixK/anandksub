import re
import shutil
import tomllib
# import markdown
from datetime import datetime
from pathlib import Path
from typing import List, Tuple
from copy import deepcopy
from jinja2 import Environment, FileSystemLoader
from watchdog.observers import Observer
from watchdog.events import  FileSystemEventHandler
from time import perf_counter
import os
from pprint import pformat
from http import server
# from ext import MyExtension

# from markdown import markdown
# import mistune
# from mistune.directives import FencedDirective, Admonition, TableOfContents
# from ext import MyRenderer

import mistletoe
# from mistletoe.latex_renderer import LaTeXRenderer
# from mistletoe.contrib.mathjax import MathJaxRenderer
from ext import MyHtmlRenderer
from loguru import logger
from htmlmin import Minifier
import itertools
from collections import Counter


def parse_config(CONFIG_FILE : str):
    # Parse config.toml file
    with CONFIG_FILE.open("rb") as f:
        config = tomllib.load(f)

    config["build"]["build_dir"] =  Path("build") if config["build"]["build_dir"] == "" else Path(config["build"]['build_dir'])

    if config["build"]["content_dir"] == "":
        raise ValueError(f"'content_dir' in config.toml is empty. Set the correct content directory.")

    if config["build"]['assets_dir'] == "":
        raise ValueError(f"'assets_dir' in config.toml is empty. Set the correct content directory.")

    if config["build"]['templates_dir'] == "":
        raise ValueError(f"'templates_dir' in config.toml is empty. Set the correct content directory.")

    if config["build"]['css_dir'] == "":
        raise ValueError(f"'css_dir' in config.toml is empty. Set the correct content directory.")

    if config["build"]['libs_dir'] == "":
        raise ValueError(f"'libs_dir' in config.toml is empty. Set the correct content directory.")
    
    return config


# Precompile regex patterns
HEADER_PATTERN = re.compile(r'^\s*@.*$', re.MULTILINE)
CONTENT_PATTERN = re.compile(r'@def.*$', re.MULTILINE)

def gather_md_files(dir, only_modified:bool = False) -> List:
    return sorted(list(dir.glob("**/*.md")))

def gather_html_files(dir, only_modified:bool = False) -> List:
    return sorted(list(dir.glob("**/*.html")))

def render(clean: bool = False):
    t1_start = perf_counter() 
    if clean and BUILD_DIR.exists():
        logger.info("Cleaning build directory...")
        shutil.rmtree(BUILD_DIR)
    
    BUILD_DIR.mkdir(exist_ok=True)

    dirs_2_copy = [CSS_DIR, ASSETS_DIR, LIBS_DIR]
    if len(config["build"]["include_dirs"]) > 0:
        for dir in config["build"]["include_dirs"]:
            dirs_2_copy.append(Path(dir))

    # Copy  directories
    for dir in dirs_2_copy:
        shutil.copytree(dir, BUILD_DIR /dir.name, dirs_exist_ok=True)

    # TODO: Get modified files only when clean is false
    md_files = gather_md_files(CONTENT_DIR)

    logger.info(f"Found {len(md_files)} markdown file(s).")
    for md_file in md_files:
        # print(md_file)
        logger.info(f"Rendering {md_file}")
        # TODO: Only render the ones that has changed
        render_html(md_file, config)
    
    # Gather index html files
    html_files = gather_html_files(CONTENT_DIR)
    logger.info(f"Found {len(html_files)} html file(s).")
    for html_file in html_files:
        logger.info(f"Copying {html_file}")

        #Insert the html content into the template
        insert_hfun(html_file, config)

    FILETYPES_TO_COPY = [".js"]
    for filetype in FILETYPES_TO_COPY:
        files = list(CONTENT_DIR.glob(f"**/*{filetype}"))
        for file in files:
            logger.info(f"Copying {file}")
            print(file.relative_to(CONTENT_DIR))
            shutil.copy(file, BUILD_DIR / file.relative_to(CONTENT_DIR))


    t1_stop = perf_counter()
    logger.success(f"Rendering complete. Elapsed time: {(t1_stop - t1_start)*100:.4f}ms")
# =============================================
## HELPER FUNCTIONS

def tag_list() -> dict:
    posts = gather_md_files(CONTENT_DIR)

    all_tags = []
    for post in posts:
        # Get the header information
        header_info, _ = get_header_info(post)
        # Convert tags to list of strings
        if "tags" in header_info:
            header_info["tags"] = list(map(str.strip, header_info["tags"].strip('][').replace('"', '').split(',')))
            all_tags += header_info["tags"]

    tags = Counter(all_tags)
    
    return tags

def current_year() -> int:
    return datetime.now().year

def recent_posts(N:int = 5) -> dict:
    return dict(itertools.islice(posts_by_dir(CONTENT_DIR / "blog").items(), N)) 

def posts_by_tag(tag:str) -> dict:
    posts = gather_md_files(CONTENT_DIR)

    result = {}
    for post in posts:
        # Get the header information
        header_info, _ = get_header_info(post)
        if tag in header_info["tags"]:
            result[header_info["published"]] = post.relative_to(CONTENT_DIR).stem
    
    return result

def posts_by_dir(directory:Path) -> dict:
    posts = gather_md_files(directory)

    result = {}
    for post in posts:
        # Get the header information
        header_info, _ = get_header_info(post)

        # Convert tags to list of strings
        if "tags" in header_info:
            header_info["tags"] = list(map(str.strip, header_info["tags"].strip('][').replace('"', '').split(',')))

        pub_date = datetime.strptime(header_info["published"], '%d %B %Y')
        pub_date = pub_date.strftime('%d %b %Y')

        result[pub_date] = {
            "url": f"{post.relative_to(directory).stem}",
            "title": header_info["title"],
            "tags": header_info["tags"],
        }

        if "description" in header_info:
            result[pub_date].update({"description":header_info["description"]})
    
    # Sort the posts by date
    result = dict(sorted(result.items(), key=lambda x: datetime.strptime(x[0], '%d %b %Y'), reverse=True))
    
    return result

def create_tag_cloud(tags: dict) -> str:
    # Create a tag cloud
    tag_cloud = """<ul class="cloud">"""

    for tag, count in tags.items():
        tag_cloud += f"""<li><span class="pound">#</span><span class="tags"><a href="/tag/{tag}/" data-weight={count}>{tag}</a>[{count}]</span></li>"""
    
    tag_cloud += """</ul>"""
    return tag_cloud


def dict_to_html_table(data: dict) -> str:
    html = """
    <table><colgroup>
    <col span="1" style="width: 30%;">
    <col span="1" style="width: 70%;">
    </colgroup>
    """

    for date, post in data.items():
        tags = [f"<span class='pound'>#</span>{t}" for t in post['tags']]
        if "description" in post:
            html += f"""
            <tr>
                <td>
                    <h3 class="date">{date}</h3>
                </td>
                <td>
                    <h3>
                    <a href={post['url']}>{post['title']}</a>
                    </h3>
                    <p class="tags">{post['description']}
                    </br>
                    {" ".join(i for i in tags)}
                    </p>
                </td>
            </tr>"""
        else:
            html += f"""
            <tr>
                <td>
                    <h3 class="date">{date}</h3>
                </td>
                <td>
                    <h3>
                    <a href={post['url']}>{post['title']}</a>
                    </h3>
                    <p class="tags">{" ".join(i for i in tags)}
                    </p>
                </td>
            </tr>"""
        
    html += """</table>"""
    return html

# =============================================
def insert_hfun(file: Path, config: dict):
    default_header = config["site"]
    default_header["current_year"] = current_year()

    index_data = {
        **default_header,
        "all_articles": dict_to_html_table(posts_by_dir(CONTENT_DIR / "blog")),
        "all_notes": dict_to_html_table(posts_by_dir(CONTENT_DIR / "notes")),
        "recent_posts": dict_to_html_table(recent_posts(5)),
        "tag_cloud": create_tag_cloud(tag_list()),
        # "tag_list": dict_to_html_table(tag_list()),
    }


    _env = Environment(loader=FileSystemLoader(str(file.parent)))
    template = _env.get_template(str(file.relative_to(file.parent)))
    html = template.render(index_data)
    save_html(file, html)


def get_header_info(file: Path) -> Tuple[dict, str]:
     # Read markdown content
    with open(file, "r") as f:
        content = f.read()

    # Parse header information
    md_headers= HEADER_PATTERN.findall(content[:500])
    md_content = CONTENT_PATTERN.sub('', content).strip()

    _header_data = {}
    header_extraction_pattern = r'(\w+)\s*=\s*(.*?)(?=\s*$)'
    matches = (re.findall(header_extraction_pattern, head)[0] for head in md_headers)
    _header_data = {k:v.strip("\"") for k,v in matches}

    return _header_data, md_content


def get_meta_info(file, config: dict):

    default_header = config["post"]
    # =============================================
    
    _header_data, md_content = get_header_info(file)

    header_data = {}
    header_data["title"] = _header_data["title"]

    if "published" in _header_data:
        header_data["published"] = _header_data["published"]
    else:
        header_data["published"] = default_header["published"]
        logger.warning(f"Published date not set for {file}.")
    
    if "description" in _header_data:
        header_data["description"] = _header_data["description"]
    else:
        header_data["description"] = default_header["description"]
        logger.warning(f"description not set for {file}.")

    # Convert tags to list of strings
    if "tags" in _header_data:
        header_data["tags"] = list(map(str.strip, _header_data["tags"].strip('][').replace('"', '').split(',')))
    
    if "has_code" in _header_data:
        header_data["has_code"] = True if _header_data["has_code"] == "true" else False
    else:
        header_data["has_code"] = default_header["has_code"]
        logger.warning(f"Code status not set for {file}.")
    
    if "is_draft" in _header_data:
        header_data["is_draft"] = True if _header_data["is_draft"] == "true" else False
    else:
        header_data["is_draft"] = True
        logger.warning(f"Draft status not set for {file}.")
    
    if "has_chart" in _header_data:
        header_data["has_chart"] = True if _header_data["has_chart"] == "true" else False
    else:
        header_data["has_chart"] = False
        logger.warning(f"Chart status not set for {file}.")
    
    if "has_math" in _header_data:
        header_data["has_math"] = True if _header_data["has_math"] == "true" else False
    else:
        header_data["has_math"] = False
        logger.warning(f"Math status not set for {file}.")
    
    if "show_info" in _header_data:
        header_data["show_info"] = True if _header_data["show_info"] == "true" else False
    else:
        header_data["show_info"] = True
        logger.warning(f"Info status not set for {file}.")

    # if "is_index" in _header_data:
    #     header_data["is_index"] = True if _header_data["is_index"] == 'true' else False
    # else:
    #     header_data["is_index"] = True
    #     logger.warning(f"Index status not set for {file}.")

    header_data["read_time"] = get_read_time(md_content)

    return header_data, md_content

def render_html(file: Path, config: dict) -> None:
    # Get the general info about the website
    site_data = config['site']
    site_data["current_year"] = current_year()

    header_data, md_content = get_meta_info(file, config)
    # if header_data["is_index"]:
    #     html_data = deepcopy(site_data)
    # else:
    html_data = deepcopy(site_data)
    html_data.update(header_data)

    # Convert to html content
    # html_content = markdown.markdown(md_content, 
    #                                  output_format='html5', 
    #                                  encoding="utf-8",
    #                                  extensions=[
    #                                             #  'markdown.extensions.smarty',
    #                                              'markdown.extensions.footnotes',
    #                                              'markdown.extensions.fenced_code',
    #                                             #  MyExtension(),
    #                                              ])
    # markdown = mistune.create_markdown(plugins=['footnotes', 
    #                                             'math',
    #                                              FencedDirective([
    #                                                 Admonition(),
    #                                                 TableOfContents(),
    #                                             ]),
    #                                             ], 
    #                                    renderer="html")
    # html_content = markdown(md_content)

    # print(html_data)
    html_content = mistletoe.markdown(md_content, MyHtmlRenderer)

    html_data.update({"html_content":html_content})

    html_template = env.get_template("article.html")
    html = html_template.render(html_data)

    # print(html)

    if DO_MINIFY:
        # print()
        logger.info(f"Minifying {file}")
        html = minify_html(html)

    # =============================================
    save_html(file, html)

def save_html(file: Path, html: str) -> None:

    # print(file, file.relative_to(CONTENT_DIR))
    # Save html content to file
    # if file.parent == CONTENT_DIR:
    #     with open(BUILD_DIR  / f"{file.stem}.html", "w+") as f:
    #         f.write(html)
    # else:

    parent_dir = file.relative_to(CONTENT_DIR).parent
    if not parent_dir.exists():
        (BUILD_DIR / parent_dir).mkdir(parents=True, exist_ok=True)
    with open(BUILD_DIR / parent_dir / f"{file.stem}.html", "w+") as f:
        f.write(html)
    

# ========================= Utilities =====================#
def get_read_time(text: str) -> int:
    num_words = len(text.split())
    reading_speed = 180 # Accounting for math equations
    return num_words // reading_speed

def get_recent_posts(dir: Path, config:dict, N:int = -1) -> dict:
    md_files = gather_md_files(dir)
    header_infos = {}
    for md_file in md_files:
        header_data, _ = get_meta_info(md_file, config)
        # print(md_file, header_data['published'])
        header_infos[header_data['published']] =  str(md_file)
    # print( header_infos)
    recent_posts = dict(sorted(header_infos.items(), key=lambda x: datetime.strptime(x[0], '%d %B %Y'), reverse=True))
    print(recent_posts)
    # print(sorted(header_infos.keys(), key=lambda x: datetime.strptime(x, '%d %B %Y'), reverse=True))
    

def get_posts_by_tag(tag:str):
    pass

# # observer =  Observer()
# # event_handler = LoggingEventHandler()
# # observer.schedule(event_handler, CONTENT_DIR, recursive=True)
# # observer.start()

# # try:
# #     while observer.isAlive():
# #         observer.join(1)
# # finally:
# #     observer.stop()
# #     observer.join()


# Utils
# 1. current_year
# 2. time_now
# 3. today
# 4. Get posts by directory (blog, notes)
# 5. Get recent posts
# 6. Get posts by tags


# ============================ Sanity Checks =========================== #
# Check for woff/woff2 font files
def check_for_optimized_font_files():
    # parse css, html, and js files
    # look for corresponding font files
    logger.info(f"Looking for unoptimized font assets in {LIBS_DIR} and {ASSETS_DIR}...")

    font_suffixes = ['woff', 'woff2', 'ttf', 'otf']
    font_files = {suffix: list(LIBS_DIR.glob(f'**/*.{suffix}')) for suffix in font_suffixes}
    font_files.update({suffix: font_files[suffix] + list(ASSETS_DIR.glob(f'**/*.{suffix}')) for suffix in font_suffixes})

    if len(font_files['ttf']) > 0:
        logger.info(f"Consider converting the following ttf fonts to woff/woff2 {font_files['ttf']}")
    
    if len(font_files['otf']) > 0:
        logger.info(f"Consider converting the following otf fonts to woff/woff2 {font_files['ttf']}")
    
    if len(font_files['otf']) == 0 and len(font_files['ttf']) == 0:
        logger.info(f"All font assets are optimized.")


def check_for_optimized_image_formats():
    media_dir = CONTENT_DIR / "media"
    media_files = sorted(list(media_dir.glob('**/*.*')))
    logger.info(f"Looking for unoptimized media in {media_dir}...")
    logger.info(f"Found {len(media_files)} media assets.")

    un_opt = [m for m in media_files if m.suffix not in ['.webp', '.svg', '.pdf', '.mp4']]
    # print(media_files[0].suffix)
    if len(un_opt) > 0:
        logger.warning(f"The following assets are not optimized. Consider optimizing them before publishing.{pformat(un_opt)}")
    else:
        logger.info(f"All media assets are optimized.")

html_minifier = Minifier(
        remove_comments=True,
        remove_empty_space=True,
        remove_all_empty_space=False, # Be very careful when changing this
        keep_pre=True,
)

def minify_html(html_str: str) -> str:
    return html_minifier.minify(html_str)

# ============================ Watchdogs =========================== #

class ContentMonitor(FileSystemEventHandler):
    def on_any_event(self, event):
        if event.is_directory:
            return
        elif event.event_type in ["created", "modified"]:
            logger.info(f"Reloading server due to file change: {event.src_path}")
            render(clean=True)

# ============================ Server =========================== #
class SSGHTTPRequestHandler(server.SimpleHTTPRequestHandler):
    SUFFIXES = [".html", "/index.html", "/"]
    JS_EXTENSIONS = (".js", ".mjs")
    CSS_EXTENSIONS = (".css", ".scss")
    MEDIA_EXTENSIONS = (".webp", ".svg", ".pdf", ".mp4", ".png", ".jpg", ".jpeg", ".gif")
    FONT_EXTENSIONS = (".woff", ".woff2", ".ttf", ".otf")

    def translate_path(self, path):
        path = server.SimpleHTTPRequestHandler.translate_path(self, path)
        relpath = os.path.relpath(path, os.getcwd())
        fullpath = os.path.join(self.server.base_path, relpath)
        return fullpath

    def do_GET(self):
        if self.path not in self.SUFFIXES:
            print(self.path)
            # self.path = self.path.lstrip("/")
            if (not self.path.endswith(".html") and 
                not self.path.endswith("/") and 
                not self.path.endswith(self.MEDIA_EXTENSIONS) and 
                not self.path.endswith(self.JS_EXTENSIONS) and
                not self.path.endswith(self.CSS_EXTENSIONS) and 
                not self.path.endswith(self.FONT_EXTENSIONS)):
                self.path += ".html"
                print(self.path)


        server.SimpleHTTPRequestHandler.do_GET(self)
    
    def send_error(self, code, message=None):
        if code == 404:
            with open(BUILD_DIR / "404.html", "r") as f:
                msg_404 = f.read()
            self.error_message_format = f"""{msg_404}"""

        server.SimpleHTTPRequestHandler.send_error(self, code, message)


class SSGHTTPServer(server.HTTPServer):
    def __init__(self, base_path, *args, **kwargs):
        self.allow_reuse_address = True
        server.HTTPServer.__init__(self, *args, **kwargs)
        self.base_path = base_path


if __name__ == "__main__":
    

    CONFIG_FILE: Path = Path("config.toml")

    config = parse_config(CONFIG_FILE)
    BUILD_DIR: Path   = config["build"]["build_dir"]

    CONTENT_DIR: Path  = Path(config["build"]['content_dir'])
    TEMPLATE_DIR: Path = Path(config["build"]['templates_dir'])
    LIBS_DIR: Path     = Path(config["build"]['libs_dir'])
    ASSETS_DIR: Path   = Path(config["build"]['assets_dir'])
    CSS_DIR: Path      = Path(config["build"]['css_dir'])

    DO_MINIFY: bool    = config["render"]["minify_html"]

    # Load our template environment
    env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))

    render(clean=True)
    check_for_optimized_image_formats()
    check_for_optimized_font_files()


    # Setup the watcdog observer
    event_handler = ContentMonitor()
    observer = Observer()
    observer.schedule(event_handler, CONTENT_DIR, recursive=True)
    observer.start()

    try:
        with SSGHTTPServer(str(BUILD_DIR),(config["server"]["host"], config["server"]["port"]), SSGHTTPRequestHandler) as httpd:
            logger.info(f"Starting server at http://{config['server']['host']}:{config['server']['port']}")
            httpd.serve_forever()

    except KeyboardInterrupt:
            observer.stop()

    observer.join()
