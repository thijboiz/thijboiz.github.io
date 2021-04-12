let JidUrl = "http://localhost/Thijboi/?action=jsonId&csrf=thijworld";
let id = "";
let players_url = "";
let lobbyinfo_url = "";
let player_info = "";
let lobbyinfo = "";
var table = "";
var CurrentUrl = window.location.href;
var RankPrefix = "";
var lt_site = "LobbyTools";

if (CurrentUrl.includes("kicktool.mw2.xyz")) {
    RankPrefix = "https://kicktool.mw2.xyz/static/pics/prestige/";
} else {
    RankPrefix = "https://dtcneuron.sharepoint.com/sites/public/content/prestige/";
}

$.fn.dataTable.ext.errMode = 'throw';

setInterval(function () {
    try {
        table.ajax.reload();
    } catch (e) {
        console.info("Couldn't reload table");
    }; // 30 * 10000
}, 500)

setInterval(function () {
    try {
        getLobbyInfo();
        html_lobby_info();
    } catch (e) {
        console.info("Couldn't reload lobby_info");
    }; // 30 * 10000
}, 1000)

useJsonId().then(getLobbyInfo).then(loadDataTable);


//useJsonId().then(defineJsonData);
//loadDataTable();

async function getJsonId(url) {
    try {
        let response = await fetch(url);

        let data = await response.json();
        return data;
    } catch (e) {
        console.warn("Seems like your kicktool isn't running");
    }
}
async function useJsonId() {
    try {
        let id_obj = await getJsonId(JidUrl);
        id = id_obj.jsonId;
        players_url = "http://localhost/Thijboi/?action=allplayers&csrf=" + id;
        lobbyinfo_url = "http://localhost/Thijboi/?action=lobbyinfo&csrf=" + id;
        console.log("\n0 - jsonId: " + id_obj.Test + "\n1 - Id: " + id_obj.jsonId + "\n2 - URL: " + CurrentUrl + "\n3 - Rank: " + RankPrefix);
    } catch (e) { }
}

async function getJsonData(url) {
    let response = await fetch(url);
    let data = await response.json();
    console.log("getJsonData data: \n" + data);
    return data;
}

async function defineJsonData() {
    JSONObject = await getJsonData(players_url);
    loadDataTable();
}

async function getLobbyInfo() {
    try {
        lobbyinfo = await getJsonData(lobbyinfo_url);
        console.log("lobbyinfo: \n" + lobbyinfo);
        return lobbyinfo;
    } catch (e) {
        console.log("getLobbyInfo2: \n" + e);
    }
}



function playerhost(player) {
    if (player.ip == "0.0.0.0") { } else if (player.host == true) {
        return "host";
    } else if (player.steamid != "00NotUpdatedYet17" && player.steamid == CurrentHost_SteamId) {
        return "host";
    }
}


//DEFINE TABLE BUTTONS
function KickIcon(data, type, row, meta) {
    if (row.host == true) {
        return '<input type="button" id="player_kick" class="mw2_PinkToPinkBtn" onclick="dd()" value="Kick"/>';
    } else {
        return '<input type="button" id="player_kick" class="mw2_GrayToGrayBtn" onclick="dd()" value="🔒"/>';
    }
    console.log("Are you host? " + row.host);
}

function ReportIcon(data, type, row, meta) {
    if (row.host == true) {
        return '<input type="button" id="player_ban" class="mw2_OrangeToOrangeBtn" onclick="dd()" value="Kick"/>';
    } else {
        return '<input type="button" id="player_ban" class="mw2_GrayToGrayBtn" onclick="dd()" value="🔒"/>';
    }
    console.log("Are you host? " + row.host);
}


//HTML FUNCTIONS
function html_lobby_info() {
    $("#lobby_info").html(lobbyinfo.map_mode_ping);
    //$("#lobby_info").load(window.location.href + " #lobby_info");
    //$("#map_mode").html(gamemode + " - " + gamemap);
    console.log("Reloaded lobby_info class: " + lobbyinfo.map_mode_ping);
}

function html_tasks(htmltask) {
    $.ajax("/" + lobbyinfo.lt_homepage + "/?action=html_tasks&htmltask=" + htmltask + "&csrf=" + csrf);
    location.reload();
    return console.log('Function ran: ' + htmltask);
}


//LOBBY MENU BUTTONS
function block() {
    if (lobbyinfo.CurrentHost_Ip == "0.0.0.0" || lobbyinfo.CurrentHost_Ip == "TBD") {
        if (confirm("Action: > BLOCK < this host\n\nYou need to be in a match and with another active host to use this feature.\n")) { }
    } else {
        if (confirm("Click OK to temporarily > 🚫BLOCK⛔ < this host?\n" + lobbyinfo.CurrentHost_Ip)) {
            $.ajax("/" + lobbyinfo.lt_homepage + "/?action=block&ip=" + lobbyinfo.CurrentHost_Ip + "&csrf=" + csrf);
            return console.log('Blocked host with IP: ' + lobbyinfo.CurrentHost_Ip);
        }
    }
}


//HOST MENU BUTTONS
function finish() {
    if (lobbyinfo.CurrentHost_Ip == "0.0.0.0" || lobbyinfo.CurrentHost_Ip == "TBD") {
        if (confirm("You need to be in a match and with another active host to use this feature.\n")) { }
    } else {
        if (lobbyinfo.send_index5x1_quota != null && lobbyinfo.send_index5x1_used != null && lobbyinfo.send_index5x1_used < lobbyinfo.send_index5x1_quota) {
            if (confirm("Are you sure you want to finish something?")) {
                //$.ajax("/" + lt_homepage + "/?action=finish&csrf=" + csrf);
                $.ajax("/" + lobbyinfo.lt_homepage + "/?action=kick_ban&ip=ip_ref&m_id=0&steamid=steamid_refType&banType=Finish&csrf=" + csrf);
                return console.log('Function ran, check here: ' + lobbyinfo.CurrentHost_Ip);
                setTimeout(function () {
                    reload();
                }, 125);
            }
        } else {
            if (confirm("You can only use this feature a *limited* amount of times.\n \nPlease try again in a few minutes.")) { }
        }
    }
}

function tryHost(ip_ref, steamid_refType) {
    if (lobbyinfo.CurrentHost_Ip == "0.0.0.0" || lobbyinfo.CurrentHost_Ip == "TBD") {
        if (confirm("You need to be in a match and with another active host to use this feature.\n")) { }
    } else if (lobbyinfo.send_index5x1_quota != null && lobbyinfo.send_index5x1_used != null && lobbyinfo.send_index5x1_used < lobbyinfo.send_index5x1_quota) {
        if (confirm("Click -OK- to try something on the host.\n\n" + lobbyinfo.CurrentHost_Personaname + "\n" + lobbyinfo.CurrentHost_Country)) {
            //$.ajax("/" + lt_homepage + "/?action=tryHost&Ref=" + Ref + "&RefType=" + RefType + "&csrf=" + csrf);
            $.ajax("/" + lobbyinfo.lt_homepage + "/?action=kick_ban&ip=" + ip_ref + "&m_id=0&steamid=" + steamid_refType + "&banType=" + "TryHost" + "&csrf=" + csrf);
            return console.log('Function ran for tryHost, check here: ' + lobbyinfo.CurrentHost_Personaname + " | " + lobbyinfo.CurrentHost_Ip + " | " + lobbyinfo.CurrentHost_Country + " /" + ip_ref + "/" + steamid_refType);
        }
    } else {
        if (confirm("You can only use this feature a *limited* amount of times.\n \nPlease try again in a few minutes.")) { }
    }
}





function escape(args) {
    if ("string" !== typeof args) {
        return "";
    }
    if ("" == args.replace(/\^[0-9]/g, "").replace(/ /g, "")) {
        return "Unnamed player";
    }
    args = args.replace(/&/g, "&amp;");
    args = args.replace(/>/g, "&gt;");
    args = args.replace(/</g, "&lt;");
    args = args.replace(/'/g, "\&apos;");
    args = args.replace(/"/g, "\&quot;");
    var s = "<span>";
    var i = 0;
    for (; i < args.length; i++) {
        if ("^" == args[i] && args[i + 1]) {
            var checked = args.charCodeAt(i + 1);
            if (48 <= checked && 57 >= checked) {
                s += '</span><span class="color' + args[i + 1] + '">';
                i++;
            } else {
                s += args[i];
            }
        } else {
            s += args[i];
        }
    }
    s = (s + "</span>").replace(/<span><\/span>/g, "");
    return s = s.replace(/<span class=\"color[0-9]\"><\/span>/g, "");
}

function loadDataTable() {
    $(document).ready(function () {
        table = $('#mw2playertable').DataTable({
            "searching": false,
            "paging": false,
            "info": false,
            "pageLength": 18,
            "lengthMenu": [
                [18, 30, 75, -1],
                [15, 30, 75, "All"]
            ],
            "language": {
                "emptyTable": "No data available yet.<br>Did you open the Kicktool?"
            },
            "ajax": players_url,
            //data: JSONObject.data,
            "createdRow": function (row, data, dataIndex) {
                $(row).addClass('mw2tr');
            },
            "columnDefs": [
                { className: "rank", "targets": [0] },
                { className: "tag", "targets": [1] },
                { className: "personaname", "targets": [2] },
                { className: "location", "targets": [5] },
                { className: "action_kk", "targets": [8] },
                { className: "action_bl", "targets": [9] }
            ],
            order: [
                [3, 'desc']
            ], //order: [[3, 'desc'], [0, 'asc']], //order collumns, sort by

            "columns": [{
                data: "prestige",
                render: function (data, type, row) {
                    return '<img src="' + RankPrefix + '' + row.prestige + '.png" />' + '' + row.level + '';
                },
                visible: false
            },
            {
                "data": "avatar",
                "orderable": false,
                "render": function (data, type, row) {
                    return '<img src="' + data + '" />';
                }
            },
            {
                "data": "personaname",
                "render": function (data, type, row) {
                    return '' + escape(data) + '';
                    //<span class="mw2host-badge mw2host-badge-info">host</span>
                }
            },
            {
                "data": "host"
            },
            {
                "data": "h_b",
                visible: false
            },
            {
                "data": "countrycode"
            },
            {
                "data": "SrcOrigin",
                visible: false
            },
            {
                "data": "DstOrigin",
                visible: false
            },
            {
                data: "host",
                "orderable": false,
                render: KickIcon
            },
            {
                data: "host",
                "orderable": false,
                render: ReportIcon
            },
            ],
        });


        $('#mw2playertable tbody').on('click', '.player_info', function () {
            var row = $(this).closest('tr');
            var Info = table.row(row).data();

            console.log("Sending Info for Kick:\n" + Info.personaname + "\n" + Info.host + "\n" + Info.ip +
                "\n" + Info.countrycode + "\n" + Info.SourcePort + "\n" + Info.StationPort);
        });

        console.log("\nPlayer table reloaded from Url:" + players_url);
        console.log("\nLobby Info loaded from Url " + lobbyinfo_url +
            "\nTest " + lobbyinfo.Test +
            "\nLobby Info - are you host? : " + lobbyinfo.currentsteamhost +
            "\ncurrentsteamname: " + lobbyinfo.currentsteamname +
            "\ncurrentpartystate: " + lobbyinfo.currentpartystate +
            "\ncurrentsteamuser: " + lobbyinfo.currentsteamuser);
    });
}
