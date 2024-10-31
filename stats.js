const tournaments = JSON.parse(localStorage.getItem('tournaments'));
const params = new URLSearchParams(location.search);
const tournament_name = decodeURIComponent(params.get('tournament'));
let tournament = tournaments.find((a) => a.name == tournament_name);


document.getElementById('rounds_link').href = `/swiss.html?tournament=${tournament_name}&round=1`;

for (const player of tournament.players) {
    player.total_opponent_rating = 0;
    player.wins = 0;
    player.losses = 0;
    player.draws = 0;
    player.byes = 0;
    player.history = '';
}

for (let i = 0; i < tournament.games.length; i++) {
    for (const game of tournament.games[i]) {
        switch (game.result) {
            case "1-0":
                tournament.players[game.white].wins++;
                tournament.players[game.black].losses++;
                tournament.players[game.white].total_opponent_rating += tournament.players[game.black].rating;
                tournament.players[game.black].total_opponent_rating += tournament.players[game.white].rating;
                tournament.players[game.white].history += '1';
                tournament.players[game.black].history += '0';
                break;
            case "0-1":
                tournament.players[game.white].losses++;
                tournament.players[game.black].wins++;
                tournament.players[game.white].total_opponent_rating += tournament.players[game.black].rating;
                tournament.players[game.black].total_opponent_rating += tournament.players[game.white].rating;
                tournament.players[game.white].history += '0';
                tournament.players[game.black].history += '1';
                break;
            case "½-½":
                tournament.players[game.white].draws++;
                tournament.players[game.black].draws++;
                tournament.players[game.white].total_opponent_rating += tournament.players[game.black].rating;
                tournament.players[game.black].total_opponent_rating += tournament.players[game.white].rating;
                tournament.players[game.white].history += '½';
                tournament.players[game.black].history += '½';
                break;
            case "bye":
                tournament.players[game.white].byes++;
                tournament.players[game.white].history += 'B';
                break;
            default:
                alert('Invalid game');
                break;
        }
    }
}

tournament.players.sort((a, b) => b.wins + b.draws * 0.5 + b.byes - a.wins - a.draws * 0.5 - a.byes || performance(b) - performance(a) || b.wins - a.wins);


let tableHead = `
<tr>
    <th style="width: 100px">Место</th>
    <th width="200px">Игрок</th>
    <th style="width: 100px">Рейтинг</th>
    <th style="width: 100px">Очки</th>\n
`;
for (let i = 0; i < tournament.games.length; i++) {
    tableHead += `<th style="width: 20px">${i + 1}</th>\n`;
}
tableHead += `
    <th style="width: 100px">Перфоманс</th>
</tr>\n`;
document.getElementById('stats').innerHTML += tableHead;

for (let i = 0; i < tournament.players.length; i++) {
    const newRow = document.getElementById('stats').insertRow();
    newRow.insertCell().innerHTML = (i + 1).toString();
    newRow.insertCell().innerHTML = tournament.players[i].name;
    newRow.insertCell().innerHTML = tournament.players[i].rating;
    newRow.insertCell().innerHTML = tournament.players[i].wins + tournament.players[i].draws * 0.5 + tournament.players[i].byes;
    for (const result of tournament.players[i].history) {
        switch (result) {
            case '1':
                newRow.insertCell().innerHTML = '<span title="Победа" style="color: green">1</span>';
                break;
            case '0':
                newRow.insertCell().innerHTML = '<span title="Поражение" style="color: red">0</span>';
                break;
            case '½':
                newRow.insertCell().innerHTML = '<span title="Ничья" style="color: gray">½</span>';
                break;
            case 'B':
                newRow.insertCell().innerHTML = '<span title="Bye" style="color: gray">1</span>';
                break;
        }
    }
    if (tournament.players[i].wins + tournament.players[i].draws + tournament.players[i].losses == 0) {
        newRow.insertCell().innerHTML = '0';
    }
    else {
        newRow.insertCell().innerHTML = performance(tournament.players[i]);
    }
}

function performance(player) {
    return Math.round((player.total_opponent_rating + 400 * (player.wins - player.losses)) / (player.wins + player.draws + player.losses));
}