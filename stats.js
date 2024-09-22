let players = JSON.parse(localStorage.getItem('players'));
const games = JSON.parse(localStorage.getItem('games'));
const odds = JSON.parse(localStorage.getItem('odds'));
const rounds = Number(localStorage.getItem('round_count'));

for (const player of players) {
    player['total_opponent_rating'] = 0;
    player['wins'] = 0;
    player['losses'] = 0;
    player['draws'] = 0;
    player['bye'] = 0;
}


for (const game of games) {
    const white = players.find((a) => a.name == game.white);
    const black = players.find((a) => a.name == game.black);
    white.total_opponent_rating += Number(black.rating);
    black.total_opponent_rating += Number(white.rating);
    switch (game.result) {
        case "1-0":
            white.wins++;
            black.losses++;
            break;
        case "0-1":
            white.losses++;
            black.wins++;
            break;
        case "0.5-0.5":
            white.draws++;
            black.draws++;
            break;
    }
}
for (const extra_point of odds) {
    players.find((a) => a.name == extra_point).bye++;
}

players.sort((a, b) => b.wins + b.draws * 0.5 + b.bye - a.wins - a.draws * 0.5 - a.bye);

console.log(players);

for (let i = 0; i < players.length; i++) {
    const newRow = document.getElementById('stats').insertRow();
    newRow.insertCell().innerHTML = (i + 1).toString();
    newRow.insertCell().innerHTML = players[i].name;
    newRow.insertCell().innerHTML = players[i].rating;
    newRow.insertCell().innerHTML = players[i].wins + players[i].draws * 0.5 + players[i].bye;
    newRow.insertCell().innerHTML = Math.round((players[i].total_opponent_rating + 400 * (players[i].wins - players[i].losses)) / (players[i].wins + players[i].draws + players[i].losses));
}