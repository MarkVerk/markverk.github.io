let player_names = document.getElementsByName('player_name');
let player_ratings = document.getElementsByName('player_rating');
const tournament_list = document.getElementById('tournaments');

let tournaments = JSON.parse(localStorage.getItem('tournaments'));
if (tournaments == null) {
    tournaments = [];
}

if (tournaments.length == 0) {
    document.querySelector('.tournaments').innerHTML = '<i>Здесь пока нет турниров</i>';
}

for (const tournament of tournaments) {
    const li = document.createElement('li');
    const remove_button = document.createElement('button');
    remove_button.innerHTML = 'Удалить';
    remove_button.addEventListener('click', function () {
        tournaments.splice(tournaments.indexOf(tournament), 1);
        localStorage.setItem('tournaments', JSON.stringify(tournaments));
        location.reload();
    });
    const div = document.createElement('div');
    div.setAttribute('class', 'tournament');
    div.innerHTML = `<div style="flex: 1"><a href="/stats.html?tournament=${encodeURIComponent(tournament.name)}">${tournament.name}</a><div>`;
    if (tournament.status == 'active') {
        div.innerHTML += `<div style="color: green; width: 50px;">Идёт</div>`;
    }
    else {
        div.innerHTML += `<div style="color: gray"; width: 50px;>Завершён</div>`;
    }
    div.appendChild(remove_button);
    li.appendChild(div);
    tournament_list.appendChild(li);
}
