let players = JSON.parse(localStorage.getItem('players'));
const games = JSON.parse(localStorage.getItem('games'));

for (const player of players) {
    player.total_opponent_rating = 0;
    player.wins = 0;
    player.losses = 0;
    player.draws = 0;
    player.byes = 0;
    player.history = '';
}

    for (let i = 0; i < games.length; i++) {
    for (const game of games[i]) {
        switch (game.result) {
            case "1-0":
                players[game.white].wins++;
                players[game.black].losses++;
                players[game.white].total_opponent_rating += players[game.black].rating;
                players[game.black].total_opponent_rating += players[game.white].rating;
                players[game.white].history += '1';
                players[game.black].history += '0';
                break;
            case "0-1":
                players[game.white].losses++;
                players[game.black].wins++;
                players[game.white].total_opponent_rating += players[game.black].rating;
                players[game.black].total_opponent_rating += players[game.white].rating;
                players[game.white].history += '0';
                players[game.black].history += '1';
                break;
            case "½-½":
                players[game.white].draws++;
                players[game.black].draws++;
                players[game.white].total_opponent_rating += players[game.black].rating;
                players[game.black].total_opponent_rating += players[game.white].rating;
                players[game.white].history += '½';
                players[game.black].history += '½';
                break;
            case "bye":
                players[game.white].byes++;
                players[game.white].history += 'B';
                break;
            default:
                alert('Invalid game');
                break;
        }
    }
}

players.sort((a, b) => b.wins + b.draws * 0.5 + b.byes - a.wins - a.draws * 0.5 - a.byes);


let tableHead = `
<tr>
    <th style="width: 100px">Место</th>
    <th width="200px">Игрок</th>
    <th style="width: 100px">Рейтинг</th>
    <th style="width: 100px">Очки</th>\n
`;
for (let i = 0; i < games.length; i++) {
    tableHead += `<th style="width: 20px">${i + 1}</th>\n`;
}
tableHead += `
    <th style="width: 100px">Перфоманс</th>
</tr>\n`;
document.getElementById('stats').innerHTML += tableHead;

for (let i = 0; i < players.length; i++) {
    const newRow = document.getElementById('stats').insertRow();
    newRow.insertCell().innerHTML = (i + 1).toString();
    newRow.insertCell().innerHTML = players[i].name;
    newRow.insertCell().innerHTML = players[i].rating;
    newRow.insertCell().innerHTML = players[i].wins + players[i].draws * 0.5 + players[i].byes;
    for (const result of players[i].history) {
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
    if (players[i].wins + players[i].draws + players[i].losses == 0) {
        newRow.insertCell().innerHTML = '0';
    }
    else {
        newRow.insertCell().innerHTML = Math.round((players[i].total_opponent_rating + 400 * (players[i].wins - players[i].losses)) / (players[i].wins + players[i].draws + players[i].losses));
    }
}