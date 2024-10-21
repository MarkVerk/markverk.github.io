let players = [];
let player_names = document.getElementsByName('player_name');
let player_ratings = document.getElementsByName('player_rating');
let type = document.getElementById('tournament_type');
let specific = document.getElementById('specific');



function onTypeSelected(that) {
    switch (type.options[type.selectedIndex].value) {
        case 'swiss':
            specific.innerHTML = '';
            break;
        case 'arena':
            specific.innerHTML = '';
            break;
        case 'knock-out':
            specific.innerHTML = '';
            break;
        default:
            alert('Invalid tournament type');
            break;
    }
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
        alert("Player count must be at least 2");
        return;
    }
    if (hasDuplicates(players)) {
        alert("Player names must be unique");
        return;
    }
    localStorage.setItem("tournament_type", type.options[type.selectedIndex].value);
    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("round", "1");
    localStorage.setItem("games", JSON.stringify([]));
    switch (type.options[type.selectedIndex].value) {
        case 'swiss':
            location.href = '/swiss.html';
            break;
        case 'arena':
            location.href = '/arena.html';
            break;
        case 'knock-out':
            location.href = '/knock-out';
            break;
        default:
            alert('Invalid tournament type');
            break;
    }
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