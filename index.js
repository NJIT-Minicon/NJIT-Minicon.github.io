const END_DATE = new Date("2027-04-03T10:00-04:00");
const COUNTDOWN_DAYS = document.querySelector("#countdown-days");
const COUNTDOWN_HOURS = document.querySelector("#countdown-hours");
const COUNTDOWN_MINUTES = document.querySelector("#countdown-minutes");
const COUNTDOWN_SECONDS = document.querySelector("#countdown-seconds");

function animFrame() {
    const dateDiff = END_DATE - Date.now();
    COUNTDOWN_DAYS.innerText = ("00" + Math.floor(dateDiff / 86400000)).slice(-3);
    COUNTDOWN_HOURS.innerText = ("0" + Math.floor(dateDiff % 86400000 / 3600000)).slice(-2);
    COUNTDOWN_MINUTES.innerText = ("0" + Math.floor(dateDiff % 3600000 / 60000)).slice(-2);
    COUNTDOWN_SECONDS.innerText = ("0" + Math.floor(dateDiff % 60000 / 1000)).slice(-2);

    requestAnimationFrame(animFrame);
}

requestAnimationFrame(animFrame);