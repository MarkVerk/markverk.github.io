let players = JSON.parse(localStorage.getItem('players'));
let games = JSON.parse(localStorage.getItem('games'));
const params = new URLSearchParams(location.search);
let round = params.get('round');
let current_round = JSON.parse(localStorage.getItem('round'));
const pairing_table = document.getElementById('players');


if (round < 3) {
    document.getElementById('end_tournament').hidden = true;
}

let pairing = [];

document.getElementById('tour').innerHTML = `<h1>Тур ${round}</h1>`;

for (let i = 0; i < current_round; i++) {
    document.getElementById('rounds').innerHTML += `<li><a href="/swiss.html?round=${i + 1}"> ${i + 1} </a></li>\n`;
}

for (const player of players) {
    player.score = 0;
    player.color_streak = 0;
    player.played_with = new Set();
}

for (let i = 0; i < round - 1; i++) {
    for (const game of games[i]) {
        if (game.result == 'bye') {
            players[game.white].score++;
            continue;
        }
        if (players[game.white].color_streak < 0) {
            players[game.white].color_streak = 0;
        }
        else {
            players[game.white].color_streak++;
        }
        if (players[game.black].color_streak > 0) {
            players[game.black].color_streak = 0;
        }
        else {
            players[game.black].color_streak--;
        }
        switch (game.result) {
            case '1-0':
                players[game.white].score++;
                break;
            case '0-1':
                players[game.black].score++;
                break;
            case '½-½':
                players[game.white].score += 0.5;
                players[game.black].score += 0.5;
                break;
        }
        players[game.white].played_with.add(game.black);
        players[game.black].played_with.add(game.white);
    }
}

if (round < current_round) { // history
    document.getElementById('end_tournament').hidden = true;
    document.getElementById('next_round').hidden = true;
    displayRound();
}
else {
    pairPlayers();
}


function displayRound() {
    for (const game of games[round - 1]) {
        const newRow = pairing_table.insertRow();
        newRow.insertCell().innerHTML = players[game.white].name;
        newRow.insertCell().innerHTML = players[game.white].rating;
        if (game.black == -1) {
            newRow.insertCell().innerHTML = '';
            newRow.insertCell().innerHTML = '';
            newRow.insertCell().innerHTML = 'Bye';
            continue;
        }
        newRow.insertCell().innerHTML = players[game.black].name;
        newRow.insertCell().innerHTML = players[game.black].rating;
        newRow.insertCell().innerHTML = game.result;
    }
}


function nextRound() {
    games[round - 1] = [];
    for (let i = 0; i < pairing.length; i++) {
        if (pairing[i].black == -1) {
            games[round - 1].push({white: pairing[i].white, black: -1, result: 'bye'});
            continue;
        }
        const selectedResult = pairing_table.rows.item(i + 1).cells.item(4).firstChild;
        if (selectedResult.selectedIndex == 0) {
            games[round - 1] = [];
            alert('All results must be selected');
            return;
        }
        games[round - 1].push({white: pairing[i].white, black: pairing[i].black, result: selectedResult.options[selectedResult.selectedIndex].value});
    }
    round++;
    current_round++;
    localStorage.setItem('games', JSON.stringify(games));
    localStorage.setItem('round', JSON.stringify(current_round));
    location.search = `?round=${round.toString()}`;
}


function pairPlayers() {
    const unmatched = players.length - dutch().size * 2;
    if (unmatched > 1) {
        localStorage.setItem('status', 'finished');
        location.href = '/stats.html';
    }
    
    pairing.sort((a, b) => players[b.white].score + players[b.black]?.score - players[a.white].score - players[a.black]?.score);
    for (const pair of pairing) {
        const newRow = pairing_table.insertRow();
        newRow.insertCell().innerHTML = players[pair.white].name + `  (${players[pair.white].score})`;
        newRow.insertCell().innerHTML = players[pair.white].rating;
        if (pair.black == -1) {
            newRow.insertCell().innerHTML = '';
            newRow.insertCell().innerHTML = '';
            newRow.insertCell().innerHTML = 'Bye';
            continue;
        }
        newRow.insertCell().innerHTML = players[pair.black].name + `  (${players[pair.black].score})`;
        newRow.insertCell().innerHTML = players[pair.black].rating;
        newRow.insertCell().innerHTML = 
        `<select>
        <option value="">Не выбрано</option>
        <option value="1-0">Победа белых</option>
        <option value="½-½">Ничья</option>
        <option value="0-1">Победа черных</option>
        </select>`;
    }
}

function dutch() {
    let odd = -1;
    if (players.length % 2 == 1) {
        odd = 0;
        for (let i = 1; i < players.length; i++) {
           if (players[i].score > players[odd].score) {
              continue;
           }
           if (players[i].score < players[odd].score || players[i].rating < players[odd].rating) {
              odd = i;
           }
        }
    }
    let weights = [];
    for (let p1 = 0; p1 < players.length - 1; p1++) {
        for (let p2 = p1 + 1; p2 < players.length; p2++) {
            if (players[p1].played_with.has(p2)) {
                continue;
            }
            if (players[p1].color_streak > 1 && players[p2].color_streak > 1) {
                continue;
            }
            if (players[p1].color_streak < -1 && players[p2].color_streak < -1) {
                continue;
            }
            if (p1 == odd || p2 == odd) {
                weights.push([p1, p2, -1000]);
                continue;
            }
            const weight = -Math.abs(players[p1].score - players[p2].score);
            weights.push([p1, p2, weight]);
        }
    }
    const matching = blossom(weights, true);
    let matched = new Set();
    for (let i = 0; i < matching.length; i++) {
        if (matched.has(i)) {
            continue;
        }
        if (matching[i] == -1) {
            pairing.push({white: i, black: -1});
            continue;
        }
        if (players[matching[i]].color_streak > players[i]) {
            pairing.push({white: i, black: matching[i]});
            continue;
        }
        pairing.push({white: matching[i], black: i});
        matched.add(matching[i]);
    }
    return matched;
}

function endTournament() {
    games[round - 1] = [];
    for (let i = 0; i < pairing.length; i++) {
        if (pairing[i].black == -1) {
            games[round - 1].push({white: pairing[i].white, black: -1, result: 'bye'});
            continue;
        }
        const selectedResult = pairing_table.rows.item(i + 1).cells.item(4).firstChild;
        if (selectedResult.selectedIndex == 0) {
            games[round - 1] = [];
            alert('All results must be selected');
            return;
        }
        games[round - 1].push({white: pairing[i].white, black: pairing[i].black, result: selectedResult.options[selectedResult.selectedIndex].value});
    }
    localStorage.setItem('status', 'finished');
    localStorage.setItem('games', JSON.stringify(games));
    location.href = '/stats.html';
}