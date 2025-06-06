I'm going to create a single page html/javascript app that will be hosted on github pages.

The app will be built with html, javascript, and css.

The application will be an assistent for the 2024 (enegage Gams) version of a
board game called "Acquire". (https://boardgamegeek.com/boardgame/5/acquire)

I"d like to implement a dynamic version of the player board (Stockholder
Information) that will be displayed on the page.

Initially we will be implementing "Tycoon Mode" but later will want to also add
"Classic Mode".

It should be easy for the user to set the size (number of tiles) for each hotel chain.

From this we can calculates/display the following:

- the buy/sell price for each hotel chain
- the primary/secondary/tertiary values for the stockholder bonus

It should be possible for the user to set the number of stocks they have in
each chain, and thus quickly see the value of their shares:

- per hotel chain
- in total

It should be possible for the player to say "Sell shares" and then select the
hotel chain they want to sell shares of. They can say how many they wish to
sell, and the app will calculate the value of the shares they are selling.
