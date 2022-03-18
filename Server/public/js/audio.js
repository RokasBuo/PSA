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


let recordStartTime;
const MAX_RECORDING_LENGTH_SECONDS = 5;
let elapsedTimeInterval;

micBttn.addEventListener("click", startAudioRecording);


async function stopRecording() {
    console.log("Stopping");

    const audio = await audioRecorder.stop()
        .then(audio => {
            saveAudio(audio);
            playAudio(audio);
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
    console.log("saving");
    const form = new FormData();
    form.append('file', audio);
    const resp = await fetch('/audio', {
        method: "POST",
        body: form,
      }).then(res => res.json());
    console.log(resp);
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
 * Plays recorded audio using the audio element in the HTML document
 * @param {Blob} audio - recorded audio as a Blob 
*/
function playAudio(audio) {
    let reader = new FileReader();

    reader.onload = (e) => {
        let base64URL = e.target.result;

        // pre-populating the html with a source of empty src throws an error
        if (!audioElSrc) {
            createAudioEl();
        }

        audioElSrc.src = base64URL;

        let BlobType = audio.type.includes(";") ?
            audio.type.slice(0, audio.type.indexOf(';')) : audio.type;
        audioElSrc.type = BlobType;

        // call the load method that updates the audio element
        audioEl.load();

        console.log("Playing");
        audioEl.play();

        playingIndicator.classList.remove("hide");
    };

    //read content and convert it to a URL (base64)
    reader.readAsDataURL(audio);
}

/** 
 * calculates the elapsed recording time since the moment the function is called in the format hh:mm:ss
 * */
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

    //2. Stop the recording when the max number of hours is reached
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