let players = new Map(JSON.parse(localStorage.getItem("players")));
type = localStorage.getItem("tournament_type");
console.log(players, type);
document.getElementById('tour').innerHTML = "<h1>" + "Тур " + localStorage.getItem("tour") + "<h1>";
switch (type) {
    case "swiss":
        break;
    case "arena":
        break;
    case "knock-out":
        break;
}