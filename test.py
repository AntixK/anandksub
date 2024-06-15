# import mistune
# from rich import print

# markdown = mistune.create_markdown(
#     renderer="ast",
#     # renderer='html',
#     # escape=True,
#     # plugins=['math'],
# )

# text = """

# $$
# f =  ma
# $$
# ```
# tkjhsdf
# ```
# !["RANSAC result"](/media/post_images/ransac_result.svg "RANSAC result")


# Where $\Gamma$
# """
# tokens = markdown(text)

# print(tokens)

import mistletoe
from mistletoe import Document, HtmlRenderer
from mistletoe.ast_renderer import ASTRenderer
from mistletoe import block_token, span_token

text = """
$$
f =  ma
$$

$$
\\begin{aligned}
f \&=  ma \\\
\\end{aligned}
$$

```
tkjhsdf
```
!["RANSAC result"](/media/post_images/ransac_result.svg "RANSAC result")


Where $\\Gamma$
"""

class MathJaxRenderer(HtmlRenderer):
    def __init__(self, **kwargs):
        """
        Args:
            **kwargs: additional parameters to be passed to the ancestors'
                      constructors.
        """
        super().__init__(**kwargs)

    # mathjax_src = '<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-MML-AM_CHTML"></script>\n'

    def render_math(self, token):
        """
        Convert single dollar sign enclosed math expressions to the ``\\(...\\)`` syntax, to support
        the default MathJax settings which ignore single dollar signs as described at
        https://docs.mathjax.org/en/latest/basic/mathematics.html#tex-and-latex-input.
        """

        if token.content.startswith('$$') or token.content.startswith('$'):
            # print(f"content:{token.content}")
            # return self.render_raw_text(token)
            return token.content
            # return token.content
        # return '\\({}\\)'.format(self.render_raw_text(token).strip('$'))
    
    # def render_inner(self, token) -> str:
    #     """
    #     Recursively renders child tokens. Joins the rendered
    #     strings with no space in between.

    #     If newlines / spaces are needed between tokens, add them
    #     in their respective templates, or override this function
    #     in the renderer subclass, so that whitespace won't seem to
    #     appear magically for anyone reading your program.

    #     Arguments:
    #         token: a branch node who has children attribute.
    #     """
    #     return ''.join(map(self.render, token.children))
    
    # def render_image(self, token: span_token.Image) -> str:
    #     return self.render_inner(token)

    def render_document(self, token):
        """
        Append CDN link for MathJax to the end of <body>.
        """
        return super().render_document(token) #+ self.mathjax_src
    
    # with HtmlRenderer() as renderer:     # or: `with HtmlRenderer(AnotherToken1, AnotherToken2) as renderer:`
    #     doc = Document(fin)              # parse the lines into AST
    #     rendered = renderer.render(doc)  # render the AST

print('&' in text)

print(mistletoe.markdown(text, MathJaxRenderer))