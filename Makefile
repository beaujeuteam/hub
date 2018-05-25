DIST_DIR = ./dist
CONFIG_DIR = ./config
BIN_DIR = ./node_modules/.bin
BIN_FILE = $(DIST_DIR)/app.js

build: $(DIST_DIR) node_modules $(CONFIG_DIR)/config.json
	#$(BIN_DIR)/browserify -g uglifyify src/app.js -o $(BIN_FILE) -t [ babelify ]
	$(BIN_DIR)/browserify src/app.js -o $(BIN_FILE) -t [ babelify ]

clean:
	rm -rf ./node_modules

doc: node_modules
	${BIN_DIR}/esdoc

test: node_modules
	$(BIN_DIR)/mocha ./test

start: build
	node server.js

.PHONY: build clean doc start

node_modules: package.json
	npm install --ignore-scripts

$(CONFIG_DIR)/config.json:
	cp $(CONFIG_DIR)/config.dist.json $(CONFIG_DIR)/config.json

$(DIST_DIR):
	mkdir -p $@
