
install:
	@cnpm install

loader_builder:
    @./node_modules/loader-builder/bin/builder ./src/server/views ./src/server

build-config:
	cp ./src/server/config.default.js ./src/server/config.js

build-release:
	@PORT=80 WEBSITE_HOSTNAME=shuoriyu.cn NODE_ENV=production npm run build -- --release

start-production: install build-release
	@PORT=80 WEBSITE_HOSTNAME=shuoriyu.cn NODE_ENV=production ./node_modules/.bin/pm2 start ./build/server.js -i 0 --name "shuoriyu" --max-memory-restart 400M

stop:
	@./node_modules/.bin/pm2 stop "shuoriyu"

delete:
	@./node_modules/.bin/pm2 delete "shuoriyu"