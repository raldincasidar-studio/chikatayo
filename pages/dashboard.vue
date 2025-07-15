<template>
<v-row class="my-12">
    <v-col cols="12">
        <h2 class="text-h5 font-weight-bold">Ang progress mo ngayong Week</h2>
        <Line :data="chartData" :options="chartOptions" />
    </v-col>
</v-row>

    <div class="text-center my-12">
        <v-btn to="/new-session" size="x-large" class="circle-btn" color="primary">
            <v-icon size="80">mdi-plus</v-icon>
        </v-btn>
        <h4 class="my-4 text-subtitle-1">Simulan ang Bagong Session</h4>
    </div>

    <v-row class="my-12">
        <v-col cols="12">
            <h2 class="text-h5 font-weight-bold">Mga Diary</h2>
        </v-col>
        <v-col cols="12">
            <div class="preloader my-12 d-flex flex-column align-center justify-center" v-if="loading">
                <v-progress-circular
                    indeterminate
                    color="primary"
                    size="50"
                ></v-progress-circular>
                <p class="mt-4 text-grey">Kinukuha namin ang iyong diary</p>
            </div>
            <div v-else-if="!!diaries.length">
              <v-list lines="two">
                  <v-list-item v-for="diary in diaries" :key="diary._id" :to="`/diary/${diary._id}`" prepend-icon="mdi-notebook" :title="diary.analysis.title" :subtitle="diary.date ? dayjs(diary.date).fromNow() : 'No date' " class="mdi-notebook--blue"></v-list-item>
              </v-list>
              <div class="text-center" v-if="diaries.length < diariesTotal">
                <v-btn variant="text" color="primary" prepend-icon="mdi-refresh" @click="fetchDiaries">Load more diaries</v-btn>
              </div>
            </div>
            <div class="my-12 text-center" v-else>
              <v-icon color="grey" size="50">mdi-circle-outline</v-icon>
              <h3 class="my-2 text-grey">No diaries yet</h3>
            </div>
        </v-col>
    </v-row>
</template>

<style scoped>
.circle-btn {
  width: 150px !important;
  height: 150px !important;
  border-radius: 50%;
}
</style>

<script setup>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const { myFetch, error, loading } = useMyFetch();

definePageMeta({
  layout: "dash",
});

const chartData = {
  labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  datasets: [
    {
      label: 'Weekly Progress',
      backgroundColor: '#3F51B5',
      data: [1, 3, 5, 7, 2, 4, 6]
    }
  ]
}

const chartOptions = {
//   responsive: true,
//   maintainAspectRatio: false
}

const diaries = ref([]);
const diariesTotal = ref(0);



async function fetchDiaries() {
  const res = await myFetch("/diary?skip="+diaries.value.length, {});

  if (error.value) {
    alert(`Error fetching diary: ${error.value}`);
  }

  diaries.value.push(...res.diaries);
  diariesTotal.value = res.total;
}

async function postTest() {
  const res = await myFetch("/diary", {});

  if (error.value) {
    alert(`Error: ${error.value}`);
  }

  console.log(res);
}

onMounted(() => {
  fetchDiaries();
});



</script>
