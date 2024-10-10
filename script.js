'use strict'

let catchInpt = document.getElementById('inpt');
let catchBtnOne = document.getElementById('btnOne');
let catchOutput = document.getElementById('output');
let catchTafsir = document.getElementById('tafsir');
let catchRadioBtn = document.getElementById('radioBtn');
let catchRadioPlay = document.getElementById('radioPlay');
let catchBtnTwo = document.getElementById('btnTwo');
let catchTvPlay = document.getElementById('tvPlay');

function validateInputBox() {
    let inputValue = catchInpt.value;
    if (inputValue === '') {
        alert(`Input box can't be blank!`);
    } else if (isNaN(inputValue)) {
        alert('Please enter a valid number!');
    } else if (inputValue <= 114) {
        resApi(inputValue);
    } else {
        alert('Please enter surah between 1 to 114.');
    }
    
}

function resApi(recInputValue) {
    let getInputValue = recInputValue;
    let apiOne = fetch(`https://api.alquran.cloud/v1/surah/${getInputValue}/bn.bengali`)
    let apiTwo = fetch(`https://api.alquran.cloud/v1/surah/${getInputValue}/ar.alafasy`)
    Promise.all([apiOne, apiTwo])
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(data => showApiData(data[0], data[1]))
}

function showApiData(recDataOne, recDataTwo) {
    let apiDataOne = recDataOne;
    let apiDataTwo = recDataTwo;
    let currentAudioLength = apiDataTwo.data.ayahs.length;
    let currentTafsirLength = apiDataOne.data.ayahs.length;
    let audioCountFlag = 0;

    function audioPlay() {
        if (audioCountFlag < currentAudioLength && audioCountFlag < currentTafsirLength) {
            // Surah audio play section
            catchOutput.innerHTML = `<audio id="surahPlay" src="${apiDataTwo.data.ayahs[audioCountFlag].audio}" controls autoplay></audio>`;

            catchTafsir.innerHTML = `<p>${apiDataOne.data.ayahs[audioCountFlag].text}</p>`

            let catchSurahPlay = document.getElementById('surahPlay');
            catchSurahPlay.onended = () => {
                audioCountFlag++
                audioPlay();
            }
        } else {
            alert('The surah has been ended.')
        }
    }
    audioPlay();
    
}
catchBtnOne.addEventListener('click', function () {
    validateInputBox();
})

function resRadioApi() {
    fetch(`https://mp3quran.net/api/v3/radios`)
        .then(res => res.json())
        .then(data => setRadio(data))
        .catch(err => {
            if (err) {
                alert('Some error happend!')
            }
        })
}
//radio
function setRadio(recRadioData) {
    let radioData = recRadioData;
    console.log(radioData);
    catchRadioPlay.innerHTML = `<audio src="${radioData.radios[11].url}" controls autoplay></audio>`;
}
catchRadioBtn.addEventListener('click', function () {
    resRadioApi();
})

//tv
let videoUrl = `https://raw.githubusercontent.com/KMABIDHASAN63/project/refs/heads/main/discovery.m3u8`;
function tvFunc() {
    if (Hls.isSupported) {
        let hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(catchTvPlay);
        hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoUrl;
        video.addEventListener('loadmetadata', () => video.play());
    } else {
        alert(`Your browser doesn't support hls!`)
    }
}
catchBtnTwo.addEventListener('click', function () {
    tvFunc();
})