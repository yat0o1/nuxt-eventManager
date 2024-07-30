.PHONY: build up down logs

build:
	docker-compose up --build -d

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f
