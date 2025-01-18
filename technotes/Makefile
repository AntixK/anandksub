help: ## Display help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'


build_pdf:
	rm -r build/*
	pdflatex -halt-on-error -file-line-error -shell-escape -interaction=nonstopmode -output-directory build pointcloud_notes.tex
	bibtex build/pointcloud_notes.aux 
	pdflatex -halt-on-error -file-line-error -shell-escape -interaction=nonstopmode -output-directory build pointcloud_notes.tex
	pdflatex -halt-on-error -file-line-error -shell-escape -interaction=nonstopmode -output-directory build pointcloud_notes.tex
.PHONY: clean