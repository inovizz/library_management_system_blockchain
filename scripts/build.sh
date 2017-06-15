#!/usr/bin/env bash

# Used by Jenkins to deploy code to EC2 instance.
# After deploying a new contract, update the contract address below.

cd lms
sed -i s/0x[0-9a-z]*/0xa1f1405b1aae0bf18d4515e140a62186b8ab0f3c/ app/config.js
sed -i s/localhost/ec2-35-164-104-24.us-west-2.compute.amazonaws.com/ app/web3.js
sed -i s/localhost/ec2-35-164-104-24.us-west-2.compute.amazonaws.com/ server/routes.js
sed -i s/localhost/ec2-35-164-104-24.us-west-2.compute.amazonaws.com/ index.js
sed -i s/localhost/ec2-35-164-104-24.us-west-2.compute.amazonaws.com/ truffle.js
sed -i s/localhost/ec2-35-164-104-24.us-west-2.compute.amazonaws.com/ scripts/overdue_books_reminder.js
npm install && npm run build
