import re
from mistletoe.html_renderer import HtmlRenderer
from mistletoe.block_token import Document
from mistletoe.latex_renderer import LaTeXRenderer
from mistletoe.base_renderer import BaseRenderer

import mistletoe
from mistletoe import span_token
from mistletoe.span_token import SpanToken
from mistletoe import token
from mistletoe.block_token import tokenize, BlockToken


class MyHtmlRenderer(HtmlRenderer, LaTeXRenderer):
    def __init__(self):
        super().__init__(TripleCommaDiv, 
                         FootNote, 
                         SpanFootNote, 
                         EqLabel,
                         EqrefLabel,
                         HTMLInMD, 
                         process_html_tokens=True)
        self.fn_counter = 0

        self.eq_counter = 0
        self.eq_map = {}

    def render_math(self, token):
        """
        Convert single dollar sign enclosed math expressions to the ``\\(...\\)`` syntax, to support
        the default MathJax settings which ignore single dollar signs as described at
        https://docs.mathjax.org/en/latest/basic/mathematics.html#tex-and-latex-input.
        """
        if token.content.startswith('$$'):
            return self.render_raw_text(token)
        # return '\\({}\\)'.format(self.render_raw_text(token).strip('$'))
        return self.render_raw_text(token)
    
    def render_triple_comma_div(self, token) -> str:
        inner = self.render_inner(token)
        return f'<div class="{token.classes}">{inner}</div>'
    
    def render_html_in_md(self, token):
        return token.children
    
    def render_span_foot_note(self, token) -> str:
        self.fn_counter += 1
        return f'<sup id="{token.label}"><a class="fnref" href="#{token.label}">[{token.label}]</a></sup>'

    def render_eq_label(self, token) -> str:
        # print(token.eqtag)
        self.eq_counter += 1

        self.eq_map[token.eqtag] = self.eq_counter
        
        return f"<a id={token.eqtag} class='anchor'></a>"
    
    def render_eqref_label(self, token) -> str:
        return f"<span class='eqref'>(<a href='#{token.eqtag}'>{token.eqtag}</a>)</span>"

    def render_foot_note(self, token) -> str:
        inner = self.render_inner(token)
        return f"""
        <p><table class="fndef" id="{token.tag}">
            <tr>
                <td class="fndef-backref"><a href="#{token.tag}">[{token.tag}]</a></td> 
                <td class="fndef-content">{inner.lstrip("<p>").rstrip("</p>")}</td>
            </tr>
        </table></p>
        """

    def render_document(self, token) -> str:
        self.footnotes.update(token.footnotes)
        inner = '\n'.join([self.render(child) for child in token.children])
        return '{}\n'.format(inner) if inner else ''
    

class HTMLInMD(BlockToken):
    @staticmethod
    def start(line):
        return line.startswith("!!!")

    @staticmethod
    def read(lines):
        first_line = next(lines)
        delimiter = "!!!"
        child_lines = []
        for line in lines:
            # print(line)
            if line.startswith(delimiter):
                if line[len(delimiter)] != ":":
                    # End block found:
                    break
            child_lines.append(line)

        children = "".join(child_lines)
        return children

    def __init__(self, match):
        self.children = match

class TripleCommaDiv(BlockToken):
    @staticmethod
    def start(line):
        return line.startswith(":::")

    @staticmethod
    def read(lines):
        first_line = next(lines)
        # Get class of the div
        classes = first_line.lstrip(":").strip()
        delimiter = ":::"
        child_lines = []
        for line in lines:
            if line.startswith(delimiter):
                if line[len(delimiter)] != ":":
                    # End block found:
                    break
            child_lines.append(line)
        children = tokenize(child_lines)
        return classes, children

    def __init__(self, match):
        self.classes, self.children = match


class SpanFootNote(SpanToken):
    pattern = re.compile(r'\[\^([^\]]+?)\](?!:)')
    parse_inner = False
    # parse_group = 2

    def __init__(self, match):
        # print(match.group(1))
        self.tag = match.group()
        self.label = match.group(1)

class EqLabel(SpanToken):
    pattern = re.compile(r'\\label\{(.*)\}')
    parse_inner = False

    def __init__(self, match):
        # print(match)
        # print(match.group(2))
        self.eqtag = match.group(1)

class EqrefLabel(SpanToken):
    pattern = re.compile(r'\\eqref\{(.*)\}')
    parse_inner = False
    # parse_group = 2

    def __init__(self, match):
        # print(match.group(1))
        self.eqtag = match.group(1)


class FootNote(BlockToken):
    @staticmethod
    def start(line):
        return line.startswith("[^")

    @staticmethod
    def read(lines) -> dict:
        delimiter = "]:"
        child_lines = {}
        for line in lines:
            if delimiter in line:
                fn_tag, fn_text = line.split("]:")
                children = tokenize([fn_text]) # Note: tokenize requires a list of strings

                return (fn_tag[2:], children)


    def __init__(self, match):
        self.tag = match[0]
        self.children = match[1]


if __name__ == "__main__":
    # Read markdown content
    with open("text.md", "r") as f:
        md_content = f.read()

    html_content = mistletoe.markdown(md_content, MyHtmlRenderer)


    print(html_content)