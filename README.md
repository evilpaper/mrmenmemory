![Banner of the project](./client/images/banner.png)

# Mr Men Memory Match

A memory match game with Mr. Men and Little Miss characters. Responsive web, play on any device you like. Universal leaderboard. See if you make it to top 10.

Made for fun and the love of the Mr Men universe! [Play it here](https://evilpaper.com/mrmenmemory/)

Enjoy playing.

## Built with

### Client

The frontend is built with HTML, CSS and vanilla JS.

Some notes on implementation. Tried to use standard web technologies as much as possible. Aiming for the game to be enjoyable on as many devices as possible. No funky business.

The game initially loads one simple HTML file with three "views" where two views are overlays for leaderboard and finish game modal. The application state is in the HTML itself. Works fine for small projects like this.

Transitions between views are merley a matter of adding and removing CSS class "hidden" that change the opacity and apply a transition.

The cards are randomly selected from a larger pool of cards for each round to get some variation in the characters. Wnet for a 4 x 4 grid. Having more stated to get messy on small screens. A typical tradeoff.

Animations are stricly CSS animations for optimal performance.

EventListeners trigger on both "click" and "touchstart" to feel snappy on touch devices.

### Backend (persistent storage of best times)

The leaderbord use a tiny Express server in TypeScript. Postgres as database.

## Contributions

Changes and improvements are more than welcome! Feel free to fork and open a pull request. Please make your changes in a specific branch and request to pull into master! If you can, please make sure the game fully works before sending the PR, as that will help speed up the process.

## Licensing

You are welcome to do whatever you want with the code.
The graphical assets (images) of MR. MEN™ LITTLE MISS™ is copyright by © 2020 THOIP (a Sanrio company). All rights reserved.
