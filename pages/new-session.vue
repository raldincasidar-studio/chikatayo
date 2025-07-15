<template>
    <div class="analyzing-rant d-flex flex-column align-center" v-if="loading">
      <h1 class="text-center mt-15">Pinapakinggan ko ang iyong rant ...</h1>
      <div class="preloader my-12">
        <v-progress-circular
          indeterminate
          color="primary"
          size="100"
        ></v-progress-circular>
      </div>
    </div>
  <div class="steps" v-else>
      <div class="step-1" v-if="step == 1">
        <h1 class="text-center mt-12">Anong nararamdaman mo ngayon?</h1>
        <v-row>
          <v-col cols="12" class="text-center py-10 pb-0">
            <v-icon size="100" :color="emotionLevel > 5 ? 'green' : 'blue'">{{ emotionLevel > 5 ? "mdi-emoticon-happy" : "mdi-emoticon-sad" }}</v-icon>
            <h4>{{ emotionLevel }}: {{ emotions[emotionLevel - 1] }}</h4>
          </v-col>
          <v-col cols="12">
            <v-slider
              v-model="emotionLevel"
              :min="1"
              :max="10"
              step="1"
              ticks="always"
              tick-size="4"
              label
              hint="1: Sad, 10: Happy"
              class="mt-4"
            >
            </v-slider>
          </v-col>
        </v-row>
        <v-btn color="primary" class="my-4" block size="x-large" @click="handleSimulanClick">Simulan</v-btn>
      </div>
      <div class="step-2" v-if="step == 2">
        <h1 class="text-center mt-12 mb-3">Nandito ako para makinig. Anong gusto mong ikwento?</h1>
        <!-- Display audio recording graph here -->
        <p class="text-center text-grey">Nakikinig ako ...</p>
        <canvas ref="canvasRef" class="w-100"></canvas>
        <v-btn
          color="primary"
          class="my-4"
          block
          size="x-large"
          @click="finishRecording"
          :loading="loading"
          >Tapusin/Done</v-btn
        >
      </div>
      <div class="step-3 text-center" v-if="step == 3">
        <div class="text-center my-12">
            <v-icon size="100" color="primary">mdi-emoticon-happy</v-icon>
        </div>
        <p class="mt-12" style="font-size: 1.5rem; line-height: 3rem;">{{ result.reply }}</p>
        <v-btn color="secondary" class="mt-10" block size="x-large" to="/dashboard">Bumalik sa Dashboard!</v-btn>
      </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, watch, nextTick } from "vue";

definePageMeta({
  layout: "dash",
});

const emotionLevel = ref(5);

const emotions = [
  "DEPRESSED",
  "SAD",
  "ANGRY",
  "FRUSTRATED",
  "NEUTRAL",
  "HOPEFUL",
  "PEACEFUL",
  "JOYFUL",
  "HAPPY",
  "ECSTATIC",
];

const step = ref(1);
const { myFetch, error, loading } = useMyFetch();

// Audio visualization and recording state
const canvasRef = ref(null);
const recordedAudioBase64 = ref(null);
let audioContext;
let analyser;
let dataArray;
let bufferLength;
let stream;
let animationFrameId;
let mediaRecorder;
let recordedChunks = [];
let shouldUpload = false;


const result = ref({
    reply: '',
});

async function handleSimulanClick() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    step.value = 2;
  } catch (err) {
    console.error("Error accessing microphone:", err);
    alert("Could not access microphone. Please check permissions and try again.");
  }
}

function startRecordingAndVisualization() {
  try {
    if (!stream) {
      console.error("Microphone stream not available.");
      alert("Could not access microphone. Please ensure permissions are granted.");
      step.value = 1; // Go back to previous step
      return;
    }

    mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      if (!shouldUpload) {
        recordedChunks = [];
        return;
      }
      shouldUpload = false; // Reset flag

      const blob = new Blob(recordedChunks, { type: "audio/webm" });
      recordedChunks = [];

      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        recordedAudioBase64.value = reader.result;
        console.log("Uploading audio...");

        const result2 = await myFetch("/diary", {
          method: "POST",
          body: JSON.stringify({
            emotion: emotions[emotionLevel.value - 1],
            audio: recordedAudioBase64.value,
          }),
        });

        if (error.value) {
          alert(`Upload Error: ${error.value.data?.message || error.value}`);
        } else {
          console.log("Upload successful:", result2);

          result.value.reply = result2.analysis?.psychology_feedback;
          step.value = 3;
        }
      };
    };

    mediaRecorder.start();

    // Visualization setup
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    draw();
  } catch (err) {
    console.error("Error setting up audio recording:", err);
    alert("An error occurred during audio setup. Please try again.");
  }
}

function finishRecording() {
  shouldUpload = true;
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
  cleanup();
}

function cleanup() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  if (audioContext && audioContext.state !== "closed") {
    audioContext.close();
  }
}

function draw() {
  animationFrameId = requestAnimationFrame(draw);
  if (!analyser || !canvasRef.value) return;

  analyser.getByteTimeDomainData(dataArray);
  const canvas = canvasRef.value;
  const canvasCtx = canvas.getContext("2d");
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  canvasCtx.fillStyle = "rgb(255, 255, 255)";
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = "#1E88E5";
  canvasCtx.beginPath();

  const sliceWidth = (WIDTH * 1.0) / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * HEIGHT) / 2;
    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }
    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
}

watch(step, (newStep, oldStep) => {
  if (newStep === 2) {
    nextTick(() => {
      startRecordingAndVisualization();
    });
  } else if (oldStep === 2) {
    // Clean up when navigating away from step 2 without finishing
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop(); // onstop will check `shouldUpload` flag
    }
    cleanup();
  }
});

onUnmounted(() => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
  cleanup();
});
</script>

<style scoped>
.w-100 {
  width: 100%;
}
</style>