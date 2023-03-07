![Banner of the project](./images/banner.png)

# About

This is the client part of Mr Men Memory Match.

## How to Install

The client does not need to be installed. Since it's just a bare-bones html/css/js website it work fine as it is.

## How to Run

Just open the index.html file with your browser of choice and the main game should work just fine.

The leadeboard need the backend service (leaderboard-service) to run. Running local on you own computer it use locallhost.
If you intent to run it locally with a local leaderboard you should fire up the leaderboard-service part as well.
In these cases I use the command `python -m SimpleHTTPServer 3000` in the terminal to be able to access the client at http://localhost:3000 or the lovley tool [serve](https://www.npmjs.com/package/serve)

## How to Deploy

When deployed the leaderboard service url should point to the url given by the hosting provider for the leaderboard service. By default it run on localhost.
