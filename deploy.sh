gulp dist
scp deploy-track1.sh dist/docker-track1.zip pppdc9prdaak.corp.intuit.net:
ssh -t pppdc9prdaak.corp.intuit.net "./deploy-track1.sh"

