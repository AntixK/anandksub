.PHONY: all clean init

# Output filename (without extension)
DOCUMENT = main
BUILD_DIR = build

all: init $(BUILD_DIR)/$(DOCUMENT).pdf
	@echo "PDF created at $(BUILD_DIR)/$(DOCUMENT).pdf"

# Creates the build directory if it doesn't exist
init:
	mkdir -p $(BUILD_DIR)

# The build process requires multiple runs to resolve references and bibliography
$(BUILD_DIR)/$(DOCUMENT).pdf: $(DOCUMENT).tex references.bib
	pdflatex -file-line-error -shell-escape -output-directory=$(BUILD_DIR) $(DOCUMENT)
	TEXMFOUTPUT=$(BUILD_DIR): bibtex $(BUILD_DIR)/$(DOCUMENT)
	pdflatex -file-line-error -shell-escape -output-directory=$(BUILD_DIR) $(DOCUMENT)
	pdflatex -file-line-error -shell-escape -output-directory=$(BUILD_DIR) $(DOCUMENT)

# Clean up build directory
clean:
	rm -rf $(BUILD_DIR)