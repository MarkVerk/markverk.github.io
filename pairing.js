let players = JSON.parse(localStorage.getItem("players"));
let type = localStorage.getItem("tournament_type");
let games = JSON.parse(localStorage.getItem("games"));
let round_count = Number(localStorage.getItem("rounds"));
let odds = JSON.parse(localStorage.getItem("odds"));
let tour = Number(localStorage.getItem("tour"));

let pairing = [];

document.getElementById('tour').innerHTML = "<h1>" + "Тур " + tour + "<h1>";

let scores = new Map();

for (const player of players) {
    scores.set(player.name, 0);
}


for (const game of games) {
    switch (game.result) {
        case "1-0":
            scores.set(game.white, scores.get(game.white) + 1);
            break;
        case "0-1":
            scores.set(game.black, scores.get(game.black) + 1);
            break;
        case "0.5-0.5":
            scores.set(game.white, scores.get(game.white) + 0.5);
            scores.set(game.black, scores.get(game.black) + 0.5);
            break;
    }
}
for (const extra_point of odds) {
    scores.set(extra_point, scores.get(extra_point) + 1);
}


switch (type) {
    case "swiss":
        swiss();
        break;
    case "arena":
        break;
    case "knock-out":
        break;
}

pairing.sort((a, b) => scores.get(b.white) - scores.get(a.white));
for (const pair of pairing) {
    const newRow = document.getElementById('players').insertRow();
    newRow.insertCell().innerHTML = pair.white + "  (" + scores.get(pair.white) + ")";
    newRow.insertCell().innerHTML = players.find((a) => a.name == pair.white).rating;
    newRow.insertCell().innerHTML = pair.black + "  (" + scores.get(pair.black) + ")";
    newRow.insertCell().innerHTML = players.find((a) => a.name == pair.black).rating;
    newRow.insertCell().innerHTML = "<input name=\"game_result\"type=\"text\"></input>";
}

function nextTour() {
    tour++;
    const resultsHTML = document.getElementsByName('game_result');
    for (let i = 0; i < resultsHTML.length; i++) {
        games.push({white: pairing[i].white, black: pairing[i].black, result: resultsHTML[i].value});
    }
    localStorage.setItem("games", JSON.stringify(games));
    localStorage.setItem("tour", tour.toString());
    localStorage.setItem("odds", JSON.stringify(odds));
    if (tour == round_count) {
        location.href = "/stats.html";
        return;
    }
    location.reload();
}

function swiss() {
    players.sort((a, b) => b.rating - a.rating);
    let groups_map = new Map();
    for (const player of players) {
        if (groups_map.has(scores.get(player.name))) {
            groups_map.get(scores.get(player.name)).push(player.name);
            continue;
        }
        groups_map.set(scores.get(player.name), [player.name]);
    }
    let groups = [];
    for (const [key, value] of groups_map.entries()) {
        groups.push(value);
    }
    groups.sort((a, b) => scores.get(b[0]) - scores.get(a[0]));
    for (let i = 0; i < groups.length; i++) {
        const current = groups[i];
        if (current.length % 2 == 1) {
            if (i == groups.length - 1) {
                odds.push(current[current.length - 1]);
            }
            else {
                groups[i + 1].unshift(current.pop());
            }
        }
        for (let j = 0; j < Math.trunc(current.length / 2); j++) {
            if (Math.random() > 0.5) {
                pairing.push({white: current[j], black: current[j + Math.trunc(current.length / 2)]});
            }
            else {
                pairing.push({black: current[j], white: current[j + Math.trunc(current.length / 2)]});
            }
        }
    }
}