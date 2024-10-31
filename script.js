let players = [];
let player_names = document.getElementsByName('player_name');
let player_ratings = document.getElementsByName('player_rating');
const tournament_list = document.getElementById('tournaments');

let tournaments = JSON.parse(localStorage.getItem('tournaments'));
if (tournaments == null) {
    tournaments = [];
}

for (const tournament of tournaments) {
    const li = document.createElement('li');
    const remove_button = document.createElement('button');
    remove_button.innerHTML = 'Удалить';
    remove_button.addEventListener('click', function () {
        tournaments.splice(tournaments.indexOf(tournament), 1);
        localStorage.setItem('tournaments', JSON.stringify(tournaments));
        li.remove();
    });
    li.innerHTML = `<a href="/stats.html?tournament=${encodeURIComponent(tournament.name)}">${tournament.name}</a>`;
    li.appendChild(remove_button);
    tournament_list.appendChild(li);
}

function hasDuplicates(players) {
    let taken = new Set();
    for (let i = 0; i < players.length; i++) {
        if (taken.has(players[i].name)) {
            return true;
        }
        taken.add(players[i].name);
    }
    return false;
}

function pairingResults() {
    for (let i = 0; i < player_names.length; i++) {
        players.push({name: player_names[i].value, rating: Number(player_ratings[i].value)});
    }
    if (players.length < 2) {
        alert('Player count must be at least 2');
        return;
    }
    if (hasDuplicates(players)) {
        alert('Player names must be unique');
        return;
    }
    tournaments.push({players: players, games: [], status: 'active', name: document.getElementById('tournament_name').value});
    localStorage.setItem('tournaments', JSON.stringify(tournaments));
    location.href = `/swiss.html?tournament=${encodeURIComponent(document.getElementById('tournament_name').value)}&round=1`;
}

function removePlayer(that) {
    that.parentNode.parentNode.remove();
}

function newPlayer() {
    const players_table = document.getElementById('players_table');
    const row = players_table.insertRow();
    row.insertCell().innerHTML = '<button onclick="removePlayer(this)" style="font-size: 20px; border: 0; outline: none; background-color:transparent">-</button><input name="player_name" type="text" style="font-size: 16px; border: 0; outline: none; width: 80%">';
    row.insertCell().innerHTML = '<input name="player_rating" type="number" style="font-size: 16px; border: 0; outline: none; width: 100%">';
}