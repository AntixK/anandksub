# Main Makefile for building all TeX projects in technotes subdirectories
.PHONY: all clean init $(PROJECTS)

# Dynamically find all project directories that contain main.tex files
# Exclude common directory as it appears to contain shared definitions
PROJECTS := $(filter-out common,$(sort $(dir $(wildcard */main.tex))))
PROJECTS := $(patsubst %/,%,$(PROJECTS))



# Document settings
DOCUMENT = main
BUILD_DIR = build

# Build all projects
all: init $(PROJECTS)
	@echo "Found projects: $(PROJECTS)"
	@echo "All PDFs have been built successfully"

# Create build directories for all projects
init:
	@for proj in $(PROJECTS); do \
		mkdir -p $$proj/$(BUILD_DIR); \
	done

# Generic rule for building any project
$(PROJECTS):
	@echo "Building $@ project..."
	@$(MAKE) -C $@ all

# Clean all build directories
clean:
	@for proj in $(PROJECTS); do \
		echo "Cleaning $$proj build directory..."; \
		$(MAKE) -C $@ clean; \
	done