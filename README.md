# For Running My Application:
In the first terminal (for running the client):
```
npm run client
```
In the second terminal (for running the server):
```
npm run server
```


# The Known World

The Lannisters have taken over Kings Landing! Now all houses of the seven kingdoms declare war and head with their armies towards Kings Landing, to restore the order and be the next to sit on the Iron Throne.

### Mission 
We would like you to continue working on our Vue.js web application that will help us monitor the armies activity in The Known World. You will receive updates on the army’s position and score and display them on a map. Once an army arrives to Kings Landing, the battle begin and the House with the higher score wins.

### Demo
In this round, notice the White Walkers army is the first to arrive to Kings Landing.
Since they gained a higher score then the Lannisters, they have won.

![](public/demo.gif)

After refresh, a new game will start!

### Requirements - Client

1. Display all houses (by flag) on the map in their default positions.

2. Subscribe to updates (use the local service provided in the code as mock)

3. On new update, calculate the house new position and move it on the map. If the house reaches kings landing, it will stop there.

4. Determine the winner: the first house to reach Kings Landing will fight the Lannisters. The house with the higher score wins. Display a winner alert.

   

### Requirements - Server

1. implement RESTfull API to get the houses list (instead of using the init.json file provided in the client)
2. move the random update events logic to the server, and emit events to client via socket

### Notes

- You may, if you wish, re-write the client side in any framework of your choise.
- Priority is to complete the Client side, than move on to Server if you wish.

### Bonus Points

- Score Board: Display the list of houses sorted by score. The winner should be highlighted with bold text.
- Updates: Display a list of the incoming updates sorted from the latest -> oldest.
- Fetch the Houses list from a DB

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
