let player_names = document.getElementsByName('player_name');
let player_ratings = document.getElementsByName('player_rating');
const tournament_list = document.getElementById('tournaments');

let tournaments = JSON.parse(localStorage.getItem('tournaments'));
if (tournaments == null) {
    tournaments = [];
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

function isValidRating(rating) {
    if (rating < 1000 || rating > 3300) {
        return false;
    }
    return true;
}

function pairingResults() {
    const tournament_name = document.getElementById('tournament_name').value;
    if (tournament_name.length < 3) {
        alert('Tournament name must be over 2 characters long');
        return;
    }
    for (const t of tournaments) {
        if (t.name == tournament_name) {
            alert('Tournament name is not unique');
            return;
        }
    }
    let players = [];
    for (let i = 0; i < player_names.length; i++) {
        if (player_names[i].value == '') {
            alert("Some players have empty names");
            return;
        }
        if (!isValidRating(Number(player_ratings[i].value))) {
            alert(`${player_names[i].value} has an invalid rating`);
            return;
        }
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
    tournaments.push({players: players, games: [], status: 'active', name: tournament_name});
    localStorage.setItem('tournaments', JSON.stringify(tournaments));
    location.href = `/swiss.html?tournament=${encodeURIComponent(tournament_name)}&round=1`;
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