from pathlib import Path
import markdown
from typing import List
import re

BUILD_DIR: Path = Path("build")
BUILD_DIR.mkdir(exist_ok=True)
CONTENT_DIR: Path = Path("content")

# Precompile regex patterns
header_pattern = re.compile(r'^\s*@.*$', re.MULTILINE)
content_pattern = re.compile(r'@.*$', re.MULTILINE)

def gather_md_files(dir) -> List:
    return list(dir.glob("**/*.md"))

def render_html(file):
    # Read markdown content
    with open(file, "r") as f:
        content = f.read()

    # Parse header information
    # md_headers = [line for line in content.splitlines() if line.startswith('@')]
    # header_pattern = r'^\s*@.*$'
    # content_pattern = 
    md_headers= header_pattern.findall(content)
    md_content = content_pattern.sub('', content).strip()


    # header_extraction_pattern = r'(\w+)\s*=\s*(.*?)(?=\s*$)'
    # matches = re.findall(header_extraction_pattern, md_headers[1])

    # print(matches)
    # print(md_content)

    # Extract TLDR
    # Convert to html content
    html = markdown.markdown(md_content)

    # Save html content to file
    (BUILD_DIR / file.parent).mkdir(parents=True, exist_ok=True)
    with open(BUILD_DIR / file.parent / f"{file.stem}.html", "w+") as f:
        f.write(html)

md_files = gather_md_files(CONTENT_DIR)
render_html(md_files[0])

# import re

# def extract_key_values(text):
#     pattern = r'(\w+)\s*=\s*(.*?)(?=\s*,|\s*$)'
#     matches = re.findall(pattern, text)
#     return {key.strip(): value.strip() for key, value in matches}

# # Example usage:
# input_text = "text text1 = value1, text2 = value2, text3 = value3,"
# result = extract_key_values(input_text)
# print(result)