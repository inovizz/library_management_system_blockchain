# LMS: A community library management system
[![Build Status](https://travis-ci.org/Imaginea/lms.svg?branch=master)](https://travis-ci.org/Imaginea/lms)

Pool your books to create a virtual library. Implemented on the Ethereum blockchain using Solidity, Truffle, Zeppelin and others.

## Usage

TBD

## Building and the frontend

1. First run `truffle compile`, then run `truffle migrate` to deploy the contracts onto your network of choice (default "development").
1. Then run `npm start` to build the app and serve it on http://localhost:8080


## Debugging

```
$ truffle console
truffle(development)> compile
truffle(development)> lms.new('Owner name')
```
If getOwner is a constant function, you will get the output immediately on the console
```
truffle(development)> lms.at("contract address").getOwner()   
```
if getOwner is not a constant function, use events (say Owner is an event).
```
truffle(development)> lms.at('contract address').getOwner()
truffle(development)> lms.at('contract address').Owner(function (e, result) { if (!e) {console.log(result)}})
```
Note: Don't forget to add any new contracts to the migration file.
