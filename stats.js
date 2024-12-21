const tournaments = JSON.parse(localStorage.getItem('tournaments'));
const params = new URLSearchParams(location.search);
const tournament_name = decodeURIComponent(params.get('tournament'));
let tournament = tournaments.find((a) => a.name == tournament_name);
const player_info = document.getElementById('player info');


document.getElementById('rounds_link').href = `/swiss.html?tournament=${tournament_name}&round=1`;
document.getElementById('header_text').innerHTML = `Результаты турнира "${tournament_name}"<br>`;

if (tournament.status == 'active') {
    document.getElementById('header_text').innerHTML += '<div style="color: green">Турнир идёт</div>';
}
else {
    document.getElementById('header_text').innerHTML += '<div style="color: gray">Турнир завершён</div>';
}

const show_player = params.get('player');

for (const player of tournament.players) {
    player.total_opponent_rating = 0;
    player.wins = 0;
    player.losses = 0;
    player.draws = 0;
    player.byes = 0;
    player.history = [];
    player.scores = new Map();
}

for (let i = 0; i < tournament.games.length; i++) {
    for (const game of tournament.games[i]) {
        switch (game.result) {
            case "1-0":
                tournament.players[game.white].wins++;
                tournament.players[game.black].losses++;
                tournament.players[game.white].total_opponent_rating += tournament.players[game.black].rating;
                tournament.players[game.black].total_opponent_rating += tournament.players[game.white].rating;
                tournament.players[game.white].history.push({color: 1, opponent: game.black, result: 'W'});
                tournament.players[game.black].history.push({color: 0, opponent: game.white, result: 'L'});
                tournament.players[game.white].scores.set(game.black, 1);
                tournament.players[game.black].scores.set(game.white, 0);
                break;
            case "0-1":
                tournament.players[game.white].losses++;
                tournament.players[game.black].wins++;
                tournament.players[game.white].total_opponent_rating += tournament.players[game.black].rating;
                tournament.players[game.black].total_opponent_rating += tournament.players[game.white].rating;
                tournament.players[game.white].history.push({color: 1, opponent: game.black, result: 'L'});
                tournament.players[game.black].history.push({color: 0, opponent: game.white, result: 'W'});
                tournament.players[game.white].scores.set(game.black, 0);
                tournament.players[game.black].scores.set(game.white, 1);
                break;
            case "½-½":
                tournament.players[game.white].draws++;
                tournament.players[game.black].draws++;
                tournament.players[game.white].total_opponent_rating += tournament.players[game.black].rating;
                tournament.players[game.black].total_opponent_rating += tournament.players[game.white].rating;
                tournament.players[game.white].history.push({color: 1, opponent: game.black, result: 'D'});
                tournament.players[game.black].history.push({color: 0, opponent: game.white, result: 'D'});
                tournament.players[game.white].scores.set(game.black, 0.5);
                tournament.players[game.black].scores.set(game.white, 0.5);
                break;
            case "bye":
                tournament.players[game.white].byes++;
                tournament.players[game.white].history.push({opponent: -1, result: 'B'});
                break;
            default:
                alert('Invalid game');
                break;
        }
    }
}

if (show_player) {
    const player = tournament.players[show_player];
    let tbody = '';
    for (const game of player.history) {
        if (game.result == 'B') {
            tbody += `
            <tr>
                <td>${player.name}</td>
                <td>1 - </td>
                <td></td>
            </tr>
            `;
            continue;
        }
        if (game.color == 1) {
            switch (game.result) {
                case 'W':
                    result = '1 - 0';
                    break;
                case 'L':
                    result = '0 - 1';
                    break;
                case 'D':
                    result = '½ - ½';
                    break;
            }
            tbody += `
                <tr>
                    <td>${player.name}</td>
                    <td>${result}</td>
                    <td>${tournament.players[game.opponent].name}</td>
                </tr>
            `;
        }
        else {
            switch (game.result) {
                case 'W':
                    result = '0 - 1';
                    break;
                case 'L':
                    result = '1 - 0';
                    break;
                case 'D':
                    result = '½ - ½';
                    break;
            }
            tbody += `
                <tr>
                    <td>${tournament.players[game.opponent].name}</td>
                    <td>${result}</td>
                    <td>${player.name}</td>
                </tr>
            `;
        }
    }
    player_info.innerHTML = `
    <h3>${player.name}</h3>
    <table border="2">
    <tr>
        <th>Белые</th>
        <th>Результат</th>
        <th>Черные</th>
    <tr>
    ${tbody}
    </table>
    `;
}

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


let standing = [];

for (let i = 0; i < tournament.players.length; i++) {
    standing[i] = i;
}

standing.sort(comparePlayers);

for (let i = 0; i < standing.length; i++) {
    const player = tournament.players[standing[i]];
    const newRow = document.getElementById('stats').insertRow();
    newRow.insertCell().innerHTML = (i + 1).toString();
    newRow.insertCell().innerHTML = `<a href="/stats.html?tournament=${encodeURIComponent(tournament_name)}&player=${standing[i]}">${player.name}</a>`;
    newRow.insertCell().innerHTML = player.rating;
    newRow.insertCell().innerHTML = player.wins + player.draws * 0.5 + player.byes;
    for (const game of player.history) {
        switch (game.result) {
            case 'W':
                newRow.insertCell().innerHTML = '<span title="Победа" style="color: green">1</span>';
                break;
            case 'L':
                newRow.insertCell().innerHTML = '<span title="Поражение" style="color: red">0</span>';
                break;
            case 'D':
                newRow.insertCell().innerHTML = '<span title="Ничья" style="color: gray">½</span>';
                break;
            case 'B':
                newRow.insertCell().innerHTML = '<span title="Bye" style="color: gray">1</span>';
                break;
        }
    }
    if (player.wins + player.draws + player.losses == 0) {
        newRow.insertCell().innerHTML = '0';
    }
    else {
        newRow.insertCell().innerHTML = performance(player);
    }
}

function performance(player) {
    return Math.round((player.total_opponent_rating + 400 * (player.wins - player.losses)) / (player.wins + player.draws + player.losses));
}

function comparePlayers(a, b) {
    const player1 = tournament.players[a];
    const player2 = tournament.players[b];
    if (player1.wins + player1.draws * 0.5 + player1.byes - player2.wins - player2.draws * 0.5 - player2.byes != 0) {
        return player2.wins + player2.draws * 0.5 + player2.byes - player1.wins - player1.draws * 0.5 - player1.byes;
    }
    if (player1.scores.has(b)) {
        return player2.scores.get(a) - player1.scores.get(b);
    }
    return player2.total_opponent_rating - player1.total_opponent_rating;
}