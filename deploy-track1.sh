docker stop docker_nodejs_careapp
docker rm docker_nodejs_careapp
rm -rf careapp
unzip careapp.zip -d careapp
cd careapp
docker build -t docker-careapp .
docker run -d -p 3000:3000 --name docker_nodejs_careapp docker-careapp
docker logs -f docker_nodejs_careapp