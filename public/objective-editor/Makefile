build:
	go build -o bin/server

test:
	go test

docker:
	docker build -t sage-assess-editor:$(BUILD_NUMBER) .

deploy:
	-docker stop assessment-editor
	-docker rm assessment-editor
	docker run -p 8082:3000 --name assessment-editor --net sagenetwork -d sage-assess-editor:$(DEPLOY_TAG)	
