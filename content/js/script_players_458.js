let jsondata = "";
let apiUrl = "http://localhost/Superuser/?action=allplayers&csrf=53608003";

async function getJson(url) {
    let response = await fetch(url);
    let data = await response.json()
    return data;
}

async function main() {
    //OPTION 1
    //getJson(apiUrl).then(data => console.log(data));

    //OPTION 2
    JSONObject = await getJson(apiUrl);
    var count = Object.keys(JSONObject.jsonPlayers).length;

    // Loop through data.report instead of data
    for (var i = 0; i < count; i++) {
        var tr = $('<tr/>');

        // Indexing into data.report for each td element
        $(tr).append("<td>" + "Tag" + "</td>");
        $(tr).append("<td>" + JSONObject.jsonPlayers[i].personaname + "</td>");
        $(tr).append("<td>" + JSONObject.jsonPlayers[i].steam_age + "</td>");
        $(tr).append("<td>" + JSONObject.jsonPlayers[i].countrycode + "</td>");
        $('.mw2table').append(tr);
    }
    console.log(JSONObject.jsonPlayers);
    console.log(count);
}

main();