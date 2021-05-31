var executed = false;
var roundedTime2;


var mins = 0;
var hours = 0;
var days = 0;
var months = 0;
var years = 0;

var shotStart = document.getElementById('shotstart');
var timer = document.getElementById('timecounter');
var timerOffset = timer.offsetLeft - shotStart.offsetLeft;


var moneyBase = document.getElementById('moneybase');
var moneyIncreased = document.getElementById('moneycounter');

// offsets of each div

var shotInfo = document.getElementById("shotinfo");
var ER = document.getElementById("ER");
//var emt = document.getElementById('emt');
//var emtOffset = emt.offsetLeft;

moneyBase.innerHTML = "$0.50";

//current targeted values of counter and timer

var targetPrice = 0;
var currentPrice = 0;
var lastEvent;
var currentEvent = -1;
var currentTime; 

//testing arrays

var eventID = ["emt", "ER", "hospital", "prison", "therapy", "wages", "lifequality"];
var eventOffsets = [];
var prevOffsets = [];
var eventCosts = [0, 450, 5254, 95987, 33274, 3000, 34103, 1780000];
var totalCosts = [];
var eventTimes = [0, 10, 180, 14400, 86400, 172800, 519000, 519000];

function setup() {

    update_offsets(eventOffsets, eventID);
    update_offsets(prevOffsets, eventID);
    var index = 0;
    var tempSum = 0;
    for (i = 0; i < eventCosts.length; i++) {
        for (j = i; j >= 0; j--) {
            tempSum += eventCosts[j];
        }
        totalCosts.push(tempSum);
        tempSum = 0;
    }
    console.log(totalCosts);
    console.log(eventOffsets);
    console.log(prevOffsets);

}

function map(value, x1, x2, y1, y2) {
    return (value - x1) / (x2 - x1) * (y2 - y1) + y1;
}

function animateValue(id, start, end, duration) {
    var current;
    var range = end - start;
    if (isNaN(parseInt(document.getElementById(id).textContent, 10))) {
        current = start;
    } else {
        current = parseInt(document.getElementById(id).textContent, 10);
    }
    var increment = (end - start) / 500;
    var stepTime = Math.abs(Math.floor(duration / range));
    var obj = document.getElementById(id);
    var timer = setInterval(function () {
        if (current != end) {
            if (Math.abs(end - current) < Math.abs(increment)) {
                current += end - current;
                //console.log("triggered");
            } else {
                current += increment;
                //console.log(String("increment: " + current));

            }
            obj.innerHTML = String(Math.floor(current));
            if (current == end) {
                //console.log("ended");
                clearInterval(timer);
            }
        }
    }, stepTime);
}

function update_cost(idNum, prevID) { //updates the money counter (bottom)

    currentPrice = totalCosts[prevID+1];
    targetPrice = totalCosts[idNum+1];
    moneyBase.innerHTML = "$0.50 + $";
    console.log("passed parameters: " + currentPrice + ", " + targetPrice);
    animateValue("moneycounter", currentPrice, targetPrice, 100);
}

function update_timer(idNum) { //updates the timer (top)

    console.log("update_timer idNum = " + idNum);
    var scrollRef = eventOffsets[idNum];
    var prevTime = eventTimes[idNum];
    var newTime = eventTimes[idNum + 1];

    console.log(String("update_timer event string and offset: " + eventID[idNum] + " " + scrollRef));

    if (scrollRef >= 0 && scrollRef <= 8000) {
        var mappedTime2 = map(scrollRef, 0, 6000, prevTime, newTime);
        roundedTime2 = (scrollRef <= 6000) ? Math.round(mappedTime2) : newTime;
        display_time(roundedTime2);
    }

}

function update_bullettime() { //REVISION NEEDED, can the bullet ms timer be condensed?

    var timerOffsetCurrent = timer.offsetLeft - shotStart.offsetLeft;
    var timerScrollRef = timerOffsetCurrent - timerOffset;

    if (timerOffsetCurrent >= timerOffset && timerScrollRef < 6000) {
        console.log("bullet timer");
        let mappedTime = map(timerScrollRef, 0, 1400, 0, 7);
        let roundedTime = Math.round(mappedTime);
        if (roundedTime >= 7 || currentEvent > 0) {
            $('.bullet').fadeOut(100);
        } else {
            $('.bullet').fadeIn(100);
            
        }

        timer.innerHTML = (roundedTime <= 7 && roundedTime >= 0) ? String(roundedTime / 1000 + " sec") : "0.007 sec";
    }
}

function display_time(minutes) { //converts minutes into larger units

    years = Math.floor(minutes / 518400);
    months = Math.floor((minutes - (years * 518400)) / 43200);
    days = Math.floor((minutes - (years * 518400) - (months * 43200)) / 1440);
    hours = Math.floor((minutes - (years * 518400) - (months * 43200) - (days * 1440)) / 60);
    mins = minutes % 60;

    if (years > 0) {
        timer.innerHTML = String(years + " years ");
    } else if (months > 0) {
        timer.innerHTML = String(months + " months " + days + " days");
    } else if (days > 0) {
        timer.innerHTML = String(days + " days " + hours + " hr");
    } else {
        timer.innerHTML = String(hours + " hr " + mins + " min");
    }

}

function update_offsets(array, idList) { //pushes current offset values of infoboxes to an array
    array.length = 0;
    for (i = 0; i < idList.length; i++) {
        //console.log("update_offset looped");
        var obj = document.getElementById(idList[i]);
        var offset = window.scrollX - obj.offsetLeft + 7500;
        array.push(offset);
    }
}

function checkPos(array) {
    for (i = 0; i < array.length; i++) {
        if (Math.sign(array[i]) == -1) {
            //console.log(String("checkPos result: " + (i - 1)));
            return i - 1;
        }
    }
    return array.length - 1;
}

function updateCheck(newOffsets) {
    if (checkPos(newOffsets) == -1) {
        update_bullettime();
    } else {
        if (checkPos(newOffsets) != currentEvent) {
            //console.log(String("last positive offset: " + checkPos(newOffsets)));

            lastEvent = currentEvent;
            currentEvent = checkPos(newOffsets);
            update_cost(currentEvent, lastEvent);
        }
        update_timer(currentEvent);
    }
}

function update_oldoffsets(array1, array2) { //for updating prevOffsets at the end of a scroll function
    array2 = [];
    for (i = 0; i < array1.length; i++) {
        array2.push(array1[i]); 
    }
}

// Body calling functions

setup();


window.addEventListener('scroll', function () {
    /*console.log("current event: " + currentEvent);
    console.log("last event: " + lastEvent);
    console.log(String("current: " + currentPrice));
    console.log(String("target: " + targetPrice))*/

    console.log(String("scroll pos: " + window.scrollX));
    console.log(eventOffsets);

    //console.log(eventOffsets);
    update_offsets(eventOffsets, eventID);
    updateCheck(eventOffsets);
    update_oldoffsets(eventOffsets, prevOffsets);


});