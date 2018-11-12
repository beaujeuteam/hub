DIST_DIR = ./dist
CONFIG_DIR = ./config
BIN_DIR = ./node_modules/.bin
BIN_FILE = $(DIST_DIR)/app.js

build-dev: $(DIST_DIR) node_modules $(CONFIG_DIR)/config.json
	$(BIN_DIR)/browserify src/app.js -d -o $(BIN_FILE) -t [ babelify ]

build: $(DIST_DIR) node_modules $(CONFIG_DIR)/config.json
	$(BIN_DIR)/browserify src/app.js -t [ babelify ] | $(BIN_DIR)/uglifyjs --keep-fnames -c -o $(BIN_FILE)

clean:
	rm -rf ./node_modules  && rm -rf $(DIST_DIR)

doc: node_modules
	${BIN_DIR}/esdoc

test: node_modules
	$(BIN_DIR)/mocha ./test

start: build-dev
	node server.js

changelog: node_modules
	$(BIN_DIR)/conventional-changelog -p angular -i CHANGELOG.md -s

.PHONY: build-dev build clean doc start changelog

node_modules: package.json
	npm install --ignore-scripts

$(CONFIG_DIR)/config.json:
	cp $(CONFIG_DIR)/config.dist.json $(CONFIG_DIR)/config.json

$(DIST_DIR):
	mkdir -p $@
