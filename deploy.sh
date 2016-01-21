gulp dist
scp deploy-careapp.sh dist/careapp.zip pppdc9prdaak.corp.intuit.net:
ssh -t pppdc9prdaak.corp.intuit.net "./deploy-careapp.sh"

