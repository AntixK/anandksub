import re
import shutil
import tomllib
import markdown
from pathlib import Path
from typing import List
from copy import deepcopy
from jinja2 import Environment, FileSystemLoader


CSS_DIR: Path =  Path("_css")
CONFIG_FILE: Path = Path("config.toml")
TEMPLATE_DIR: Path = Path("_templates/")

# Parse config.toml file
with CONFIG_FILE.open("rb") as f:
    config = tomllib.load(f)

BUILD_DIR: Path =  Path("build") if config['build_dir'] == "" else Path(config['build_dir'])

if config['content_dir'] == "":
    raise ValueError(f"'content_dir' in config.toml is empty. Set the correct content directory.")

CONTENT_DIR: Path = Path(config['content_dir'])

# Load our template environment
env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))
html_template = env.get_template("head.html")

# print(html_template)

# Precompile regex patterns
header_pattern = re.compile(r'^\s*@.*$', re.MULTILINE)
content_pattern = re.compile(r'@.*$', re.MULTILINE)

def gather_md_files(dir) -> List:
    return list(dir.glob("**/*.md"))

def render(clean: bool = False):
    pass

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
    # md_headers = [line for line in content.splitlines() if line.startswith('@')]
    # header_pattern = r'^\s*@.*$'
    # content_pattern = 
    # print(len(content))
    md_headers= header_pattern.findall(content)
    md_content = content_pattern.sub('', content).strip()

    # print(len(md_content))

    header_extraction_pattern = r'(\w+)\s*=\s*(.*?)(?=\s*$)'
    matches = (re.findall(header_extraction_pattern, head)[0] for head in md_headers)
    _header_data = {k:v for k,v in matches}
    header_data.update(_header_data)

    html_data = deepcopy(header_data)
    html_data.update(site_data)

    # print(html_data)
    
    # Extract TLDR
    # Convert to html content
    html_content = markdown.markdown(md_content)
    html_data.update({"html_content":html_content})

    html = html_template.render(html_data)

    # print(html)
    # =============================================
    # Save html content to file
    print(file.parents[1])
    (BUILD_DIR / file.parent.name).mkdir(parents=True, exist_ok=True)
    with open(BUILD_DIR / file.parent.name / f"{file.stem}.html", "w+") as f:
        f.write(html)

BUILD_DIR.mkdir(exist_ok=True)
# Copy css directory
shutil.copytree(CSS_DIR, BUILD_DIR /CSS_DIR.name, dirs_exist_ok=True)
md_files = gather_md_files(CONTENT_DIR)
render_html(md_files[0])


# Utils
# 1. current_year
# 2. time_now
# 3. today
# 4. Get posts by directory (blog, notes)
# 5. Get recent posts
# 6. Get posts by tags
