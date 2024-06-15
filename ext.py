# import mistune
# from mistune import HTMLRenderer
# from mistune import escape


# DIV_BLOCK_PATTERN = r'^\@\@\n(?P<div_text>.+?)\@\\@$'

# def div_block(md):
#     md.block.register('div_block', DIV_BLOCK_PATTERN, parse_div_block, before='list')
#     if md.renderer and md.renderer.NAME == 'html':
#         md.renderer.register('div_block', render_div_block)

# def parse_div_block(block, m, state):
#     text = m.group('div_text')
#     # use ``state.append_token`` to save parsed block math token
#     state.append_token({'type': 'div_block', 'raw': text})
#     # return the end position of parsed text
#     # since python doesn't count ``$``, we have to +1
#     # if the pattern is not ended with `$`, we can't +1
#     return m.end() + 1

# def render_div_block(renderer, text):
#     # token with type and (text or raw), e.g.:
#     # {'type': 'block_math', 'raw': 'a^b'}
#     return '<div class="important">' + text + '</div>'

# class MyRenderer(HTMLRenderer):
#     # def codespan(self, text):
#     #     if text.startswith('$') and text.endswith('$'):
#     #         return '<span class="math">' + escape(text) + '</span>'
#     #     return '<code>' + escape(text) + '</code>'
#     def block_math(self, text:str):
#         # if '\\label' in text:
#         #     print(True)
#         #     # text = text.replace('\\', '\\\\')
#         # else:
#         #     print(False)
#         return '<div class="math">$$\n' + text + "\n$$</div>\n"
    
#     def inline_math(self, text):
#         return r'<span class="math">$' + text + r"$</span>"


# # # use customized renderer
# # markdown = mistune.create_markdown(renderer=MyRenderer())
# # print(markdown('hi `$*a^2=4$`'))


# if __name__ == "__main__":
#     import mistune
#     from rich import print

#     markdown = mistune.create_markdown(
#         renderer="ast",
#         # renderer='html',
#         # escape=True,
#         # plugins=['math'],
#     )

#     text = """

#     $$
#     f =  ma
#     $$

#     !["RANSAC result"](/media/post_images/ransac_result.svg "RANSAC result")


#     Where $\Gamma$
#     """
#     tokens = markdown(text)

#     print(tokens)


from mistletoe.html_renderer import HtmlRenderer

from mistletoe.latex_renderer import LaTeXRenderer

import mistletoe
from mistletoe import span_token
from mistletoe.block_token import tokenize, BlockToken


class MyHtmlRenderer(HtmlRenderer, LaTeXRenderer):
    def __init__(self):
        super().__init__(TripleCommaDiv, HTMLInMD, process_html_tokens=True)

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
    
    def render_triple_comma_div(self, token):
        inner = self.render_inner(token)
        return f'<div class="{token.classes}">{inner}</div>'
    
    def render_html_in_md(self, token):
        return token.children

    # def escape_html_text(self, s: str) -> str:
    #     """
    #     Like `html.escape()`, but this  looks into the current rendering options
    #     to decide which of the quotes (double, single, or both) to escape.

    #     Intended for escaping text content. To escape content of an attribute,
    #     simply call `html.escape()`.
    #     """
    #     # print(f"S = {s}")
    #     # s = s.replace("&", "&amp;")  # Must be done first!
    #     # s = s.replace("<", "&lt;")
    #     # s = s.replace(">", "&gt;")
    #     if self.html_escape_double_quotes:
    #         s = s.replace('"', "&quot;")
    #     if self.html_escape_single_quotes:
    #         s = s.replace('\'', "&#x27;")
        
    #     if s[-1] == "\\":
    #         s+= "\\"
        
    #     # print(f"S = {s}")
        
    #     return s
    
    # @staticmethod
    # def render_line_break(token: span_token.LineBreak) -> str:
    #     # print(token)
    #     return '\n' # if token.soft else '<br />\n'

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
        # children = tokenize(child_lines)
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