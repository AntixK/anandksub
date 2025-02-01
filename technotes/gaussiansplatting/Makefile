help: ## Display help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

BUILDDIR="build"
CURDIR:= $(dir $(abspath $(firstword $(MAKEFILE_LIST))))
ROOTDIR:=$(abspath $(dir $(lastword $(MAKEFILE_LIST)))/../)

build_pdf:
	$(info Current Directory = "$(ROOTDIR)")
	$(info Root Directory = "$(CURDIR)")

	if [ -d $(BUILDDIR) ]; then if [ "$(ls -A $(BUILDDIR))" ]; then rm -r $(BUILDDIR)/*; else echo "Build Dir is Clean"; fi else mkdir $(BUILDDIR); fi

	pdflatex -halt-on-error -file-line-error -shell-escape -interaction=nonstopmode -output-directory build gaussiansplatting.tex
	bibtex build/gaussiansplatting.aux
	pdflatex -halt-on-error -file-line-error -shell-escape -interaction=nonstopmode -output-directory build gaussiansplatting.tex
	pdflatex -halt-on-error -file-line-error -shell-escape -interaction=nonstopmode -output-directory build gaussiansplatting.tex
.PHONY: clean
