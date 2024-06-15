import re
import shutil
import tomllib
# import markdown
from pathlib import Path
from typing import List
from copy import deepcopy
from jinja2 import Environment, FileSystemLoader
# from watchdog.observers import Observer
# from watchdog.events import LoggingEventHandler
from time import perf_counter
import os
# from ext import MyExtension

# from markdown import markdown
# import mistune
# from mistune.directives import FencedDirective, Admonition, TableOfContents
# from ext import MyRenderer

import mistletoe
# from mistletoe.latex_renderer import LaTeXRenderer
# from mistletoe.contrib.mathjax import MathJaxRenderer
from ext import MyHtmlRenderer

t1_start = perf_counter() 

CONFIG_FILE: Path = Path("config.toml")

# Parse config.toml file
with CONFIG_FILE.open("rb") as f:
    config = tomllib.load(f)

BUILD_DIR: Path =  Path("build") if config["build"]["build_dir"] == "" else Path(config["build"]['build_dir'])

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

CONTENT_DIR: Path = Path(config["build"]['content_dir'])
TEMPLATE_DIR: Path = Path(config["build"]['templates_dir'])
LIBS_DIR: Path = Path(config["build"]['libs_dir'])
ASSETS_DIR: Path = Path(config["build"]['assets_dir'])
CSS_DIR: Path = Path(config["build"]['css_dir'])

# Load our template environment
env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))


# Precompile regex patterns
header_pattern = re.compile(r'^\s*@.*$', re.MULTILINE)
content_pattern = re.compile(r'@.*$', re.MULTILINE)

def gather_md_files(dir, only_modified:bool = False) -> List:
    # TODO: Optionally return only modified files
    return sorted(list(dir.glob("**/*.md")))

def render(clean: bool = False):
    if clean:
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
    for md_file in md_files:
        print(md_file)
        render_html(md_file)


def render_html(file):
    # Get default post data
    header_data = config['post']
    # Get default website data
    site_data = config['site']

    # =============================================
    # Read markdown content
    with open(file, "r") as f:
        content = f.read()

    # Parse header information
    md_headers= header_pattern.findall(content)
    # print(md_headers)
    md_content = content_pattern.sub('', content).strip()

    # print(len(md_content))

    _header_data = {}
    header_extraction_pattern = r'(\w+)\s*=\s*(.*?)(?=\s*$)'
    matches = (re.findall(header_extraction_pattern, head)[0] for head in md_headers)
    _header_data = {k:v.strip("\"") for k,v in matches}
    # Convert tags to list of strings
    if "tags" in _header_data:
        _header_data["tags"] = list(map(str.strip, _header_data["tags"].strip('][').replace('"', '').split(',')))
    
    if "has_code" in _header_data:
        _header_data["has_code"] = True if _header_data["has_code"] == "true" else False
    
    
    if "is_draft" in _header_data:
        _header_data["is_draft"] = True if _header_data["is_draft"] == "true" else False
    
    
    if "has_chart" in _header_data:
        _header_data["has_chart"] = True if _header_data["has_chart"] == "true" else False
    

    if "has_math" in _header_data:
        _header_data["has_math"] = True if _header_data["has_math"] == "true" else False
    

    if "show_info" in _header_data:
        _header_data["show_info"] = True if _header_data["show_info"] == "true" else False
    
    _header_data["read_time"] = get_read_time(md_content)
    # print(header_data)
    # print(_header_data)
    header_data.update(_header_data)

    print(header_data)


    html_data = deepcopy(header_data)
    html_data.update(site_data)

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

    html_content = mistletoe.markdown(md_content, MyHtmlRenderer)

    # print(html_content)

    html_data.update({"html_content":html_content})

    html_template = env.get_template("article.html")
    html = html_template.render(html_data)

    # =============================================
    # Save html content to file
    if file.parent == CONTENT_DIR:
        with open(BUILD_DIR  / f"{file.stem}.html", "w+") as f:
            f.write(html)
    else:
        (BUILD_DIR / file.parent.name).mkdir(parents=True, exist_ok=True)
        with open(BUILD_DIR / file.parent.name / f"{file.stem}.html", "w+") as f:
            f.write(html)

# ========================= Utilities =====================#
def get_read_time(text) -> int:
    num_words = len(text.split())
    reading_speed = 180 # Accounting for math equations
    return num_words  // reading_speed

def get_recent_posts():
    pass

def get_posts_by_tag():
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

render(clean=True)
t1_stop = perf_counter()
print(f"Elapsed time: {(t1_stop - t1_start)*100:.4f}ms") 
# Utils
# 1. current_year
# 2. time_now
# 3. today
# 4. Get posts by directory (blog, notes)
# 5. Get recent posts
# 6. Get posts by tags
