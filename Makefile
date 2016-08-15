TESTS = $(shell find test -type f -name "*.test.js")
TEST_TIMEOUT = 10000
MOCHA_REPORTER = spec
# NPM_REGISTRY = "--registry=http://registry.npm.taobao.org"
NPM_REGISTRY = ""


all: test

install:
	@npm install $(NPM_REGISTRY)

pretest:
	@if ! test -f config.js; then \
		cp config.default.js config.js; \
	fi
	@if ! test -d public/upload; then \
		mkdir public/upload; \
	fi

test: install pretest
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
		--reporter $(MOCHA_REPORTER) \
		-r should \
		-r test/env \
		--timeout $(TEST_TIMEOUT) \
		$(TESTS)

test-cov cov: install pretest
	@NODE_ENV=test node \
		node_modules/.bin/istanbul cover --preserve-comments \
		./node_modules/.bin/_mocha \
		-- \
		-r should \
		-r test/env \
		--reporter $(MOCHA_REPORTER) \
		--timeout $(TEST_TIMEOUT) \
		$(TESTS)

loader-builder:
	@./node_modules/loader-builder/bin/builder ./src/server/views ./src/server

start-development:
	@node ./build/server.js

start-production: install loader-builder
	@MODE=production DEBUG=no PORT=80 HOST=shuoriyu.cn ./node_modules/.bin/pm2 start ./build/server.js -i 0 --name "shuoriyu" --max-memory-restart 400M

restart: install loader-builder
	@./node_modules/.bin/pm2 restart "shuoriyu"

stop:
	@./node_modules/.bin/pm2 stop "shuoriyu"

delete:
	@./node_modules/.bin/pm2 delete "shuoriyu"

.PHONY: install test cov test-cov build run start restart