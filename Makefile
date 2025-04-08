build:
	docker build -t geolize-ui:local -f Dockerfile .

run:
	docker run -d -p 3000:80 --name geolize-ui geolize-ui:local

stop:
	docker rm -f geolize-ui

deploy: build
	@docker tag geolize-ui:local sangnguyenitp/geolize-ui:$(tag)
	@docker tag geolize-ui:local sangnguyenitp/geolize-ui:latest
	@docker push sangnguyenitp/geolize-ui:$(tag)
	@docker push sangnguyenitp/geolize-ui:latest
	