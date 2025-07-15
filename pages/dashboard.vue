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
            <v-list lines="two">
                <v-list-item to="/" prepend-icon="mdi-pencil" title="Diary 1" subtitle="Date: 2023-05-06"></v-list-item>
                <v-list-item to="/" prepend-icon="mdi-pencil" title="Diary 2" subtitle="Date: 2023-05-07"></v-list-item>
                <v-list-item to="/" prepend-icon="mdi-pencil" title="Diary 3" subtitle="Date: 2023-05-08"></v-list-item>
            </v-list>
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

async function postTest() {
  const res = await myFetch("/diary", {});

  if (error.value) {
    alert(`Error: ${error.value}`);
  }

  console.log(res);
}



</script>
