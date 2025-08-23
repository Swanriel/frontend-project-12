install:
	npm ci

build:
	cd frontend && npm install && npm run build

start:
	npx start-server -s ./frontend/dist

develop:
	cd frontend && npm run dev

lint:
	npx eslint .

.PHONY: install build start develop lint