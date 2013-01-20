//globals
window.clockIsRunning = 0;
window.clockIsStopped = 0;
window.stoptime = 0;
window.splitcounter = 0;
var currenttime;
window.splitdate = '';
var output;
var clock;
var starttime;
var totalDistance = 0.0;
var prevTime;


(function () {
    $("#increaseSpeed").on("click", function() {
        var currVal = $('#speed').text();
        var newVal = (Math.round(currVal * 10)+ 1)/10;
        $('#speed').text(newVal);
        updateRequiredSpeed();
    });

    $("#decreaseSpeed").on("click", function() {
        var currVal = $('#speed').text();
        if (parseInt(currVal*10) > 0) {
            var newVal = (Math.round(currVal * 10) - 1) / 10;
        } else {
            newVal = 0.0;
        }
        $('#speed').text(newVal.toFixed(1));
        updateRequiredSpeed();
    });

    $("#start").on("click", function () {
        startstop();
    });
}());

function updateRequiredSpeed() {
    if (starttime != null) {
        var timeLeft = getTimeLeft();
        console.log(timeLeft);
        var calcVal = $("#speed").text();
        $("#targetSpeed").text(calcVal);
    }
}

function getTimeLeft() {
    var targetTimeStrings = $("#targetTime").text().split(":");
    var elapsedTime = currenttime.getTime() - starttime; // is in ms

    var targetTime = new TimeSpan();
    targetTime.addHours(parseInt(targetTimeStrings[0]));
    targetTime.addMinutes(parseInt(targetTimeStrings[1]));
    targetTime.addSeconds(parseInt(targetTimeStrings[2]));

    return targetTime.totalMilliseconds() - elapsedTime;
}

function counter(starttime) {

    clock = $("#elapsedTime");
    currenttime = new Date();
    var timediff = currenttime.getTime() - starttime;
    if (clockIsStopped == 1) {
        timediff = timediff + stoptime;
    }
    if (clockIsRunning == 1) {
        clock.text(formattime(timediff, ''));
        updateDisplayDistance();
        refresh = setTimeout('counter(' + starttime + ');', 10);
    }
    else {
        window.clearTimeout(refresh);
        stoptime = timediff;
    }
}

function startstop() {
    var startstop = $("#start");
    var startdate = new Date();
    starttime = startdate.getTime();
    prevTime = starttime;
    if (window.clockIsRunning == 0) {
        startstop.text("STOP");
        window.clockIsRunning = 1;
        counter(starttime);
    } else {
        startstop.text("START");
        window.clockIsRunning = 0;
        window.clockIsStopped = 1;
    }
}

function updateDisplayDistance() {
    var currentSpeed = $("#speed").text();
    var now = currenttime.getTime();
    var timediff = now - window.prevTime;
    window.prevTime = now;
    var incrementalDistance = (timediff * parseFloat(currentSpeed) / 3600000);
    window.totalDistance += incrementalDistance;
    var displayDistance = (Math.round(window.totalDistance * 100) / 100).toFixed(2);
    $("#totalDistance").text(displayDistance);
}

function formattime(rawtime, roundtype) {
    var ds;
    if (roundtype == 'round') {
        ds = Math.round(rawtime / 100) + '';
    }
    else {
        ds = Math.floor(rawtime / 100) + '';
    }
    var sec = Math.floor(rawtime / 1000);
    var min = Math.floor(rawtime / 60000);
    ds = ds.charAt(ds.length - 1);
    if (min >= 60) {
        startstop();
    }
    sec = sec - 60 * min + '';
    if (sec.charAt(sec.length - 2) != '') {
        sec = sec.charAt(sec.length - 2) + sec.charAt(sec.length - 1);
    }
    else {
        sec = 0 + sec.charAt(sec.length - 1);
    }
    min = min + '';
    if (min.charAt(min.length - 2) != '') {
        min = min.charAt(min.length - 2) + min.charAt(min.length - 1);
    }
    else {
        min = 0 + min.charAt(min.length - 1);
    }
    return min + ':' + sec + ':' + ds;
}
