import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector("button[data-start]");
const values = {
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]')
};

let userSelectedDate = null;
let timerInterval = null;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        userSelectedDate = selectedDates[0];

        if (userSelectedDate < new Date()) {
            iziToast.error({
                message: 'Please choose a date in the future',
                position: 'topRight'
            });
            startButton.disabled = true;

        } else {
            startButton.disabled = false;
        }
    }
};

flatpickr(datetimePicker, options);

function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    
    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function updateTimer() {
    const currentTime = new Date();
    const timeLeft = userSelectedDate - currentTime;

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        values.days.textContent = '00';
        values.hours.textContent = '00';
        values.minutes.textContent = '00';
        values.seconds.textContent = '00';
        startButton.disabled = false;
        datetimePicker.disabled = false;
        return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeLeft);
    values.days.textContent = addLeadingZero(days);
    values.hours.textContent = addLeadingZero(hours);
    values.minutes.textContent = addLeadingZero(minutes);
    values.seconds.textContent = addLeadingZero(seconds);
};

startButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    startButton.disabled = true;
    datetimePicker.disabled = true;
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
})