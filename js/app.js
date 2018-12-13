var App = {};
App.start_value = 0;
App.goal_value = 25000;
App.current_value = 1000;

var pubnub = PUBNUB.init({
    publish_key: "pub-c-1b29544e-6e89-44c6-8163-a6fd0e9302f1",
    subscribe_key: "sub-c-79af275c-b112-11e8-8ee3-1e33c3063db8",
    ssl: true
});

pubnub.subscribe({
    channel: "touch_a_life",
    message: function (m) {
        console.log("GOT NOTIFICATION - > " + JSON.stringify(m));


        if (m.action_type && m.action_type == 'reset') {
            App.current_value = m.total;
            $("#fixture").thermometer("setValue", App.current_value);
            return;
        }

        if (m.amount) {
            App.current_value = App.current_value + m.amount;
            $("#fixture").thermometer("setValue", App.current_value);
        }


    }
});

function getUrlParams(prop) {
    var params = {};
    var search = decodeURIComponent(
        window.location.href.slice(window.location.href.indexOf("?") + 1)
    );
    var definitions = search.split("&");
    definitions.forEach(function (val, key) {
        var parts = val.split("=", 2);
        params[parts[0]] = parts[1];
    });
    return prop && prop in params ? params[prop] : params;
}

function RGB2HTML(red, green, blue) {
    var decColor = 0x1000000 + blue + 0x100 * green + 0x10000 * red;
    return '#' + decColor.toString(16).substr(1);
}

function init() {
    $("#fixture").thermometer({
        startValue: 100,
        height: "100%",
        width: "1000",
        bottomText: "",
        topText: "",
        animationSpeed: 1000,
        maxValue: App.goal_value,
        minValue: 100,
        textColour: "#fff",
        // tickColour: '#fff',
        liquidColour: function (value) {
            var grn = ~~((value / App.goal_value) * 255);
            var red = ~~(((App.goal_value - value) / App.goal_value) * 255);
            return RGB2HTML(red, grn, 0);
        },
        valueChanged: function (value) {
            $("#value").text("$" + value.toFixed(2));
        }
    });
}