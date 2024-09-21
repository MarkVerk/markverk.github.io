function pairingResults() {
    type = document.getElementById('tournament_type');
    var players = new Map();
    const player_names = document.getElementsByName('player_name');
    const player_ratings = document.getElementsByName('player_rating');
    for (let i = 0; i < player_names.length; i++) {
        if (players.has(player_names[i].value)) {
            alert("Имена игроков не должны совпадать");
            return;
        }
        players.set(player_names[i].value, {rating: player_ratings[i].value, games: [], score: 0});
    }
    if (players.size < 2) {
        alert("Игроков должно быть не меньше 2");
        return;
    }
    localStorage.setItem("tournament_type", type.options[type.selectedIndex].value);
    localStorage.setItem("players", JSON.stringify(Array.from(players)));
    localStorage.setItem("tour", "1");
    location.href = "/pairing.html";
}

function newPlayer() {
    const players_table = document.getElementById('players_table');
    var row = players_table.insertRow();
    row.innerHTML = "<tr><td><input type=\"text\" name=\"player_name\" style=\"border: 0; outline: none; font-size: 16px; width: 100%\"></td><td><input type=\"number\" name=\"player_rating\" style=\"border: 0; outline: none; font-size: 16px; width: 100%\"></td></tr>";
}