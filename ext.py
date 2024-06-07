import mistune
from mistune import HTMLRenderer
from mistune import escape

class MyRenderer(HTMLRenderer):
    # def codespan(self, text):
    #     if text.startswith('$') and text.endswith('$'):
    #         return '<span class="math">' + escape(text) + '</span>'
    #     return '<code>' + escape(text) + '</code>'
    def block_math(self, text:str):
        # if '\\label' in text:
        #     print(True)
        #     # text = text.replace('\\', '\\\\')
        # else:
        #     print(False)
        return '<div class="math">$$\n' + text + "\n$$</div>\n"
    
    def inline_math(self, text):
        return r'<span class="math">$' + text + r"$</span>"


# # use customized renderer
# markdown = mistune.create_markdown(renderer=MyRenderer())
# print(markdown('hi `$*a^2=4$`'))


if __name__ == "__main__":
    import mistune
    # from rich import print

    markdown = mistune.create_markdown(
        # renderer="ast",
        renderer=MyRenderer(),
        # escape=True,
        plugins=["math"],
    )

    text = """

    $$
    f =  ma
    $$

    another equation - `eer`

    $$
    \begin{aligned}
    x &= 1 \\\
    y &= 2
    \end{aligned}
    $$

    Where $\Gamma$
    """
    tokens = markdown(text)

    print(tokens)
