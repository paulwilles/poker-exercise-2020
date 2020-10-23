/* Poker Hand Sorter (Engineer Role)
Submission by Paul Willes

poker hand consists of a combination of five playing cards, ranked in the following ascending order (lowest to highest):
Rank  Combination     Description
1     High card       Highest value card
2     Pair            Two cards of same value
3     Two pairs       Two different pairs
4     Three of a kind Three cards of the same value
5     Straight        All five cards in consecutive value order
6     Flush           All five cards having the same suit
7     Full house      Three of a kind and a Pair
8     Four of a kind  Four cards of the same value
9     Straight flush  All five cards in consecutive value order, with the same suit
10    Royal Flush     Ten, Jack, Queen, King and Ace in the same suit

The cards are valued in the order: 2, 3, 4, 5, 6, 7, 8, 9, 10, Jack, Queen, King, Ace*
* For this exercise, Ace is considered high only. (i.e. cannot be used as a low card below 2 in a straight).
Suits are: Diamonds (D), Hearts (H), Spades (S), Clubs (C)
When multiple players have the same ranked hand then the rank made up of the highest value cards wins. For example, pair of kings beats a pair of queens, and a straight with a high card of Jack beats a straight with high card of nine.
If two ranks tie, for example, if both players have a pair of Jacks, then highest cards in each hand are compared; if the highest cards tie then the next highest cards are compared, and so on.

Your task
You are to build a command line program that takes, via STDIN, a "stream" of hands for a two-player poker game. At the completion of the stream, your program should print to STDOUT the number of hands won by Player 1, and the number of hands won by Player 2.

Input
Each line read via STDIN will be a set of 10 cards. Each card is represented by 2 characters - the value and the suit. The first 5 cards in the line have been dealt to Player 1, the last 5 cards in the line belong to Player 2.

Output
At the completion of the stream into STDIN (EOF), the output of your file (in STDOUT) must clearly state how many hands Player 1 won, and how many hands Player 2 won. For example:
Player 1: 10 hands
Player 2: 12 hands
*/
const readline = require('readline');
const myInterface = readline.createInterface(process.stdin, process.stdout);

const values = '23456789TJQKA';
const suites = 'DHSC';
const handsize = 5;
const players=[];
players.push({
  name: 'Player1',
  hand: [],
  wins: 0
});
players.push({
  name: 'Player2',
  hand: [],
  wins: 0
});
let dealing = true;

let currentPlayer = 0; //Player1

myInterface.on('line', function (line) {
  dealing = true;
  players.forEach(player => player.hand = []);
  currentPlayer = 0;
  cards=line.split(' ');
  cards.forEach(card => {
    if (dealing) {
      const currentCard = {}
      currentCard.value = values.indexOf(card[0]) + 2;
      currentCard.suite = suites.indexOf(card[1]);
      players[currentPlayer].hand.push(currentCard);
      if (players[currentPlayer].hand.length === handsize) {
        currentPlayer++;
        if (currentPlayer === players.count) {
          dealing=false;
        }
      }
    }
  });
  // Rank Hands
  players.forEach(player => {
    player.hand.sort((a,b) => b.value - a.value);
    let straight = player.hand.every((card, index) => card.value === player.hand[0].value - index);
    let flush = player.hand.every((card, index) => card.suite === player.hand[0].suite);
    let groups = [];
    player.hand.forEach(card => {
      if ((groups.length === 0) || (groups[groups.length-1].value !== card.value)) {
        groups.push({ value: card.value, count: 1 })
      } else {
        groups[groups.length-1].count = groups[groups.length-1].count + 1;
      }
    });
    groups.sort((a,b) => b.count - a.count);
    let fourOfAKind = (groups[0].count === 4);
    let fullHouse = (groups[0].count === 3 && groups[1].count === 2);
    let threeOfAKind = (groups[0].count === 3 && groups[1].count === 1);
    let twoPair = (groups[0].count === 2 && groups[1].count === 2);
    let pair = (groups[0].count === 2 && groups[1].count === 1);
    // Check for Rank
    if (straight && flush && player.hand[0].value === 14) { // Royal Flush
      player.rank = groups.reduce((a,b) => a * 15 + b.value, 10) * Math.pow(15, 5 - groups.length);
    } else if (straight && flush) { // Straight Flush
      player.rank = groups.reduce((a,b) => a * 15 + b.value, 9) * Math.pow(15, 5 - groups.length);
    } else if (fourOfAKind) { // Four of a kind
      player.rank = groups.reduce((a,b) => a * 15 + b.value, 8) * Math.pow(15, 5 - groups.length);
    } else if (fullHouse) { // Full house
      player.rank = groups.reduce((a,b) => a * 15 + b.value, 7) * Math.pow(15, 5 - groups.length);
    } else if (flush) { // Flush
      player.rank = groups.reduce((a,b) => a * 15 + b.value, 6) * Math.pow(15, 5 - groups.length);
    } else if (straight) { // Straight
      player.rank = groups.reduce((a,b) => a * 15 + b.value, 5) * Math.pow(15, 5 - groups.length);
    } else if (threeOfAKind) { // Three of a kind
      player.rank = groups.reduce((a,b) => a * 15 + b.value, 4) * Math.pow(15, 5 - groups.length);
    } else if (twoPair) { // Two pairs
      player.rank = groups.reduce((a,b) => a * 15 + b.value, 3) * Math.pow(15, 5 - groups.length);
    } else if (pair) { // Pair
      player.rank = groups.reduce((a,b) => a * 15 + b.value, 2) * Math.pow(15, 5 - groups.length);
    } else { // High card
      player.rank = groups.reduce((a,b) => a * 15 + b.value, 1) * Math.pow(15, 5 - groups.length);
    }
  });
  // Calculate winner of hand
  const winner={}
  players.forEach((player, index) => {
    if (!Number.isInteger(winner.index) || (player.rank > winner.value)) {
      winner.index = index;
      winner.value = player.rank;
      winner.draw = false;
    } else if (player.rank === winner.value) {
      winner.draw = true;
    }
  })
  if (Number.isInteger(winner.index) && !winner.draw) {
    players[winner.index].wins = players[winner.index].wins + 1;
  }
});

myInterface.on('close', function (line) {
  // Display number of wins
  players.forEach(player => {
    console.log(`${player.name}: ${player.wins} hands`);
  });
});
