build:
	go build -o bin/server

test:
	go test

docker:
	docker build -t sage-dashboard:$(BUILD_NUMBER) .

deploy:
	-docker stop sage-dashboard
	-docker rm sage-dashboard
	docker run -p 8083:3001 --name sage-dashboard --net sagenetwork -d sage-dashboard:$(DEPLOY_TAG)	
