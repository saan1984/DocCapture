docker stop docker-track1
docker rm docker-track1
rm -rf docker-track1
unzip docker-track1.zip -d docker-track1
cd docker-track1
docker build -t docker-track1 .
docker run -d -p 9000:9000 --name docker-track1 docker-track1
docker logs -f docker-track1