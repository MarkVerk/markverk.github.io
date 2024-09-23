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
    let players = [];
    let player_names = document.getElementsByName('player_name');
    let player_ratings = document.getElementsByName('player_rating');
    let type = document.getElementById('tournament_type');
    let round_count = document.getElementById('tour_count');
    for (let i = 0; i < player_names.length; i++) {
        players.push({name: player_names[i].value, rating: player_ratings[i].value});
    }
    if (players.length < 2) {
        alert("Player count must be at least 2");
        return;
    }
    if (hasDuplicates(players)) {
        alert("Player names must be unique");
        return;
    }
    if (round_count.value < 1) {
        alert("Invalid round count");
        return;
    }
    localStorage.setItem("tournament_type", type.options[type.selectedIndex].value);
    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("tour", "1");
    localStorage.setItem("games", JSON.stringify([]));
    localStorage.setItem("rounds", round_count.value);
    localStorage.setItem("odds", JSON.stringify([]));
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

function newPlayer() {
    const players_table = document.getElementById('players_table');
    var row = players_table.insertRow();
    row.innerHTML = "<tr><td><input type=\"text\" name=\"player_name\" style=\"border: 0; outline: none; font-size: 16px; width: 100%\"></td><td><input type=\"number\" name=\"player_rating\" style=\"border: 0; outline: none; font-size: 16px; width: 100%\"></td></tr>";
}