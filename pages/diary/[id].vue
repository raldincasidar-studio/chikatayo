<template>
    <div v-if="diary?._id">
        <div class="my-12">
            <div class="text-center" v-if="!isPlaying">
                <v-icon size="100" color="primary">mdi-notebook</v-icon>
            </div>
            <div class="audiogram-container" v-else>
                <div class="bar" v-for="i in 30" :key="i" :style="{ animationDuration: `${Math.random() * (1.5 - 0.5) + 0.5}s` }"></div>
            </div>
        </div>
        <h2 class="text-center">{{ diary?.title }}</h2>
        <p class="text-center text-subtitle-1 text-grey mt-3">{{ diary?.date? dayjs(diary?.date).fromNow() : 'No date' }}</p>

        <div class="audio-player-container my-10">
            <div class="text-center">
                <v-btn class="mx-2" rounded size="large" color="primary" @click="toggleAudio" :prepend-icon="isPlaying ? 'mdi-pause' : 'mdi-play'">
                    {{ isPlaying ? 'Pause' : 'Play' }}
                </v-btn>
                <v-btn class="mx-2" rounded size="large" @click="stopAudio" prepend-icon="mdi-stop" v-if="isPlaying">
                    Stop
                </v-btn>
                <audio ref="audioPlayer" :src="audioUrl" @ended="onAudioEnded" @pause="onAudioPaused" style="display: none;"></audio>
            </div>
        </div>

        <div class="section my-10">
            <h3 class="my-5 mb-5">Ang iyong diary (transcribed)</h3>
            <p style="font-size: 1.2rem; line-height: 2.4rem;" class="text-grey-darken-3">{{ diary?.analysis?.audio_transcribe }}</p>
        </div>
        <div class="section my-10">
            <h3 class="my-5 mb-5">Psychology Feedback</h3>
            <p style="font-size: 1.2rem; line-height: 2.4rem;" class="text-grey-darken-3">{{ diary?.analysis?.psychology_feedback }}</p>
        </div>
    </div>
    <div v-else class="my-12 text-center">
        <div class="preloader my-12 d-flex flex-column align-center justify-center" v-if="loading">
            <v-progress-circular
                indeterminate
                color="primary"
                size="50"
            ></v-progress-circular>
            <p class="mt-4 text-grey">Niloload namin ang iyong diary</p>
        </div>

    </div>
</template>

<script setup>
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

definePageMeta({
  layout: "dash",
})

const audioUrl = ref('');
const audioPlayer = useTemplateRef('audioPlayer');
const isPlaying = ref(false);

function toggleAudio() {
    const audio = audioPlayer.value;
    if (audio) {
        if (isPlaying.value) {
            audio.pause();
        } else {
            audio.play();
        }
        isPlaying.value = !isPlaying.value;
    }
}

function stopAudio() {
    const audio = audioPlayer.value;
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        isPlaying.value = false;
    }
}

function onAudioEnded() {
    isPlaying.value = false;
}

function onAudioPaused() {
    // This is to handle the case where the audio is paused by other means
    // (e.g. from the browser's native controls if they were visible)
    if (isPlaying.value && audioPlayer.value?.paused) {
        isPlaying.value = false;
    }
}


const route = useRoute();
const { myFetch, error, loading } = useMyFetch();

const diary = ref({});
async function fetchDiaryId() {
  const res = await myFetch(`/diary/${route.params.id}`, {});

  if (error.value) {
    alert(`Error fetching diary: ${error.value}`);
  }

  diary.value = res.diary;
  audioUrl.value = res.diary?.audio
}

onMounted(() => {
  fetchDiaryId();
});
</script>

<style scoped>
.audio-player-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.audiogram-container {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 80px;
    gap: 2px;
}

.bar {
    width: 4px;
    background-color: #1976D2; /* Vuetify primary color */
    animation-name: bounce;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-direction: alternate;
}

@keyframes bounce {
    0% {
        height: 10%;
    }
    100% {
        height: 100%;
    }
}
</style>