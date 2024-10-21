let players = JSON.parse(localStorage.getItem('players'));
const games = JSON.parse(localStorage.getItem('games'));
const last_round = Number(localStorage.getItem('round'));

for (const player of players) {
    player['total_opponent_rating'] = 0;
    player['wins'] = 0;
    player['losses'] = 0;
    player['draws'] = 0;
    player['byes'] = 0;
}


for (const game of games) {
    switch (game.result) {
        case "1-0":
            players[game.white].wins++;
            players[game.black].losses++;
            players[game.white].total_opponent_rating += players[game.black].rating;
            players[game.black].total_opponent_rating += players[game.white].rating;
            break;
        case "0-1":
            players[game.white].losses++;
            players[game.black].wins++;
            players[game.white].total_opponent_rating += players[game.black].rating;
            players[game.black].total_opponent_rating += players[game.white].rating;
            break;
        case "0.5-0.5":
            players[game.white].draws++;
            players[game.black].draws++;
            players[game.white].total_opponent_rating += players[game.black].rating;
            players[game.black].total_opponent_rating += players[game.white].rating;
            break;
        case "1-":
            players[game.white].byes++;
            break;
        case "-1":
            players[game.black].byes++;
            break;
    }
}

players.sort((a, b) => b.wins + b.draws * 0.5 + b.byes - a.wins - a.draws * 0.5 - a.byes);

for (let i = 0; i < players.length; i++) {
    const newRow = document.getElementById('stats').insertRow();
    newRow.insertCell().innerHTML = (i + 1).toString();
    newRow.insertCell().innerHTML = players[i].name;
    newRow.insertCell().innerHTML = players[i].rating;
    newRow.insertCell().innerHTML = players[i].wins + players[i].draws * 0.5 + players[i].byes;
    newRow.insertCell().innerHTML = Math.round((players[i].total_opponent_rating + 400 * (players[i].wins - players[i].losses)) / (players[i].wins + players[i].draws + players[i].losses));
}