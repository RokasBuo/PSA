const micBttn = document.querySelector(".start-recording-button");
const recordCntrlBttnContainer = document.querySelector(".recording-contorl-buttons-container");
const stopRecordingBttn = document.querySelector(".stop-recording-button");
const cancelRecordingBttn = document.querySelector(".cancel-recording-button");
const elapsedTimeTag = document.querySelector(".elapsed-time");
const closeBrowserCompatBttn = document.querySelector(".close-browser-not-supported-box");
const overlay = document.querySelector(".overlay");
const audioEl = document.querySelector(".audio-element");
let audioElSrc = document.querySelector(".audio-element > source");
const playingIndicator = document.querySelector(".text-indication-of-audio-playing");
const memoContainer = document.getElementById("memoContainer");

let recordStartTime;
const MAX_RECORDING_LENGTH_SECONDS = 5;
let elapsedTimeInterval;

micBttn.addEventListener("click", startAudioRecording);


function stopRecording() {
    console.log("Stopping");

    audioRecorder.stop()
        .then(audio => {
            saveAudio(audio);
            hideRecordBttns();
        })
        .catch(error => {
            switch (error.name) {
                case 'InvalidStateError': //error from the MediaRecorder.stop
                    console.log("InvalidState error", error);
                    break;
                default:
                    console.log("Unknown error", error);
            }
        });
}

async function saveAudio(audio) {
    console.log("saving", audio);
    const length = (new Date().getTime() - recordStartTime.getTime());
    const form = new FormData();
    form.append('file', audio);
    form.append('length', length);
    form.append('filetype', audio.type.split(";")[0]);
    const res = await fetch('/audio', {
        method: "POST",
        body: form,
    }).then(res => res.json());
    console.log(res);
    if (res.error) {
        return alert(res.message);
    }
    addMemoToContainer(res);
    data.push(res);
    create(data, true);
}

stopRecordingBttn.addEventListener("click", e => {
    stopRecording();
});

cancelRecordingBttn.addEventListener("click", e => {
    console.log("Canceling");
    audioRecorder.cancel();
    hideRecordBttns();
});

closeBrowserCompatBttn.addEventListener("click", e => {
    overlay.classList.add("hide");
});

audioEl.addEventListener("ended", e => {
    playingIndicator.classList.add("hide");
});

function hideRecordBttns() {
    micBttn.style.display = "block";
    recordCntrlBttnContainer.classList.add("hide");
    clearInterval(elapsedTimeInterval);
}

function createAudioEl() {
    let sourceElement = document.createElement("source");
    audioEl.appendChild(sourceElement);

    audioElSrc = sourceElement;
}

function startAudioRecording() {

    console.log("Recording");

    let audioPlaying = !audioEl.paused;
    console.log("paused?", !audioPlaying);
    if (audioPlaying) {
        audioEl.pause();
        playingIndicator.classList.add("hide");
    }

    audioRecorder.start()
        .then(() => { //on success
            recordStartTime = new Date();
            micBttn.style.display = "none";
            recordCntrlBttnContainer.classList.remove("hide");
            handleElapsedRecordingTime();
        })
        .catch(error => {
            // no browser support
            if (error.message.includes("mediaDevices API or getUserMedia method is not supported in this browser.")) {
                console.log("To record audio, use browsers like Chrome and Firefox.");
                overlay.classList.remove("hide");
            }

            switch (error.name) {
                case 'AbortError': //error from navigator.mediaDevices.getUserMedia
                    console.log("An AbortError has occured.");
                    break;
                case 'NotAllowedError': //error from navigator.mediaDevices.getUserMedia
                    console.log("A NotAllowedError has occured. User might have denied permission.");
                    break;
                case 'NotFoundError': //error from navigator.mediaDevices.getUserMedia
                    console.log("A NotFoundError has occured.");
                    break;
                case 'NotReadableError': //error from navigator.mediaDevices.getUserMedia
                    console.log("A NotReadableError has occured.");
                    break;
                case 'SecurityError': //error from navigator.mediaDevices.getUserMedia or from the MediaRecorder.start
                    console.log("A SecurityError has occured.");
                    break;
                case 'TypeError': //error from navigator.mediaDevices.getUserMedia
                    console.log("A TypeError has occured.");
                    break;
                case 'InvalidStateError': //error from the MediaRecorder.start
                    console.log("An InvalidStateError has occured.");
                    break;
                case 'UnknownError': //error from the MediaRecorder.start
                    console.log("An UnknownError has occured.");
                    break;
                default:
                    console.log("An error occured with the error name " + error.name);
            }
        });
}

/** 
 * calculates the elapsed recording time since the moment the function is called in the format mm:ss
 */
function handleElapsedRecordingTime() {
    displayTimeElapsed("00:00");

    elapsedTimeInterval = setInterval(() => {
        const elapsedTime = computeTimeElapsed(recordStartTime); //pass the actual record start time
        displayTimeElapsed(elapsedTime);
    }, 1000);
}

/**
 * Display elapsed time during audio recording
 * @param {String} elapsedTime - elapsed time in the format mm:ss
 */
function displayTimeElapsed(elapsedTime) {
    elapsedTimeTag.innerHTML = elapsedTime;

    if (isRecordingTooLong(elapsedTime)) {
        stopRecording();
    }
}

/**
 * @param {String} elapsedTime - elapsed time in the format mm:ss
 * @returns {Boolean} whether the elapsed time reached the maximum number of hours or not
 */
function isRecordingTooLong(elapsedTime) {
    const elapsedTimeSplitted = elapsedTime.split(":");
    const paddedLimit = MAX_RECORDING_LENGTH_SECONDS < 10 ? "0" + MAX_RECORDING_LENGTH_SECONDS : MAX_RECORDING_LENGTH_SECONDS.toString();
    return (elapsedTimeSplitted[elapsedTimeSplitted.length - 1] === paddedLimit);
}

/** 
 * Calculates the elapsedTime since the moment the function is called in the format mm:ss or hh:mm:ss
 * @param {String} startTime - start time to compute the elapsed time since
 * @returns {String} elapsed time in mm:ss format or hh:mm:ss format, if elapsed hours are 0.
 */
function computeTimeElapsed(startTime) {
    let endTime = new Date();

    let timeDiff = endTime - startTime;

    timeDiff = timeDiff / 1000;

    let seconds = Math.floor(timeDiff % 60);
    // pad seconds with a zero if neccessary
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timeDiff = Math.floor(timeDiff / 60);
    let minutes = timeDiff % 60;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    // convert time difference from minutes to hours
    timeDiff = Math.floor(timeDiff / 60);
    let hours = timeDiff % 24;

    timeDiff = Math.floor(timeDiff / 24);
    let days = timeDiff;

    let totalHours = hours + (days * 24);
    totalHours = totalHours < 10 ? "0" + totalHours : totalHours;

    if (totalHours === "00") {
        return minutes + ":" + seconds;
    } else {
        return totalHours + ":" + minutes + ":" + seconds;
    }
}

const audioRecorder = {
    audioBlobs: [],
    mediaRecorder: null,
    streamBeingCaptured: null,
    /** 
     * Start recording the audio 
     * @returns {Promise} - returns a promise that resolves if audio recording successfully started
     */
    start: function () {
        //Feature Detection
        if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            //Feature is not supported in browser
            return Promise.reject(new Error('mediaDevices API or getUserMedia method is not supported in this browser.'));
        }

        //create an audio stream
        return navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {

                //save the reference of the stream to be able to stop it when necessary
                audioRecorder.streamBeingCaptured = stream;

                // browser media recording api
                audioRecorder.mediaRecorder = new MediaRecorder(stream);

                audioRecorder.audioBlobs = [];

                audioRecorder.mediaRecorder.addEventListener("dataavailable", event => {
                    audioRecorder.audioBlobs.push(event.data);
                });

                audioRecorder.mediaRecorder.start();
            });
    },
    /**
     * Stop the started audio recording
     * @returns {Promise} - returns a promise that resolves to the audio as a blob file
     */
    stop: function () {
        return new Promise(resolve => {
            const mimeType = audioRecorder.mediaRecorder.mimeType;

            audioRecorder.mediaRecorder.addEventListener("stop", () => {
                let audioBlob = new Blob(audioRecorder.audioBlobs, { type: mimeType });

                resolve(audioBlob);
            });
            audioRecorder.cancel();
        });
    },
    /** 
     * Cancel audio recording
     */
    cancel: function () {
        audioRecorder.mediaRecorder.stop();

        audioRecorder.stopStream();

        //reset API properties for next recording
        audioRecorder.resetRecordingProperties();
    },
    /** 
     * Stop all the tracks on the active stream in order to stop the stream
     * additionally, remove the red flashing dot showing in the tab
     */
    stopStream: function () {
        audioRecorder.streamBeingCaptured.getTracks()
            .forEach(track => track.stop());
    },
    /** 
     * Reset all the recording properties including the media recorder and stream being captured
     */
    resetRecordingProperties: function () {
        audioRecorder.mediaRecorder = null;
        audioRecorder.streamBeingCaptured = null;
    }
};

async function deleteMemo(filename, el) {
    const confirmation = confirm("Are you sure you want to delete? This action is permanent.");
    if(!confirmation) return;
    const res = await fetch("/audio-memos", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename })
    }).then(res => res.json());
    console.log(el);
    if (res.success) {
        el.parentElement.parentElement.remove();
        data = data.filter(d => d.filename != filename);
        create(data, true);
    }
}

const formatDate = (date) => {
    const str = date.toISOString().split("T");
    return `${str[0]} ${str[1].split(".")[0]}`;
};

async function addMemoToContainer(memo) {
    memoContainer.innerHTML += `
        <div class="card audio-memo" id="${memo.id}">
            <!-- ${memo.filename}<br/> -->
            
            <audio controls>
                <source src="uploads/audio/${memo.user}/${memo.filename}" type="${memo.filetype}">
            </audio>
            <div>
                <div style="margin-top: 10px; display: inline-block;">${formatDate(new Date(memo.date))}</div>
                <button class="btn float-right" id="btn-delete" onclick="deleteMemo('${memo.filename}', this)"><i class="fa fa-trash text-muted"></i></button>
            </div>
        </div>
    `;
    return;
}

async function getMemos() {
    return new Promise(async (resolve, reject) => {
        const res = await fetch("/audio-memos").then(res => res.json()).catch(err => reject);
        resolve(res.list);
    });
}

function renderer(memos) {
    memoContainer.innerHTML = "";
    console.log(memos);
    memos.forEach(memo => addMemoToContainer(memo));
}

function create(data, destroy = false) {
    console.log("creating", data);
    data = [...data].reverse();
    if (destroy) {
        $('.pagination').jqpaginator('destroy');
    }
    $('.pagination').jqpaginator({
        showButtons: true,
        showInput: false,
        showNumbers: true,
        numberMargin: 1,
        itemsPerPage: 5,
        data: data,
        //data: dataFunc,
        render: renderer,
    });
}

let data;

(async function init() {
    data = await getMemos();
    create(data, false);
})();