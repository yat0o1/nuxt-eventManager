<template>
  <div class="px-4 sm:px-4 lg:px-20">
    <div class="flex my-8 gap-4 flex-col lg:flex-row sm:flex-row xs:flex-col">
      <input v-model="query" placeholder="Search for events..." 
      class="border-2 p-2 rounded-lg focus:border-black focus:outline-none transition-colors ease-linear duration-150"/>
      <button @click="searchEvents"
      class="border-2 p-2 rounded-lg hover:border-black transition-colors ease-linear duration-150"
      >Search</button>
      <button @click="addNewEvent"
      class="border-2 p-2 rounded-lg hover:border-black transition-colors ease-linear duration-150"
      >New event</button>
    </div>
    <div v-if="loadingData">
      <p>Loading events...</p>
    </div>

    <div v-if="events.length && !loadingData">
      <div class="flex flex-col gap-4 mt-8">
        <div v-for="event in events" :key="event.id" class="flex justify-between
        border-2 p-4 rounded-lg">
          <div class="flex flex-col gap-2
          w-2/3">
            <p class="text-2xl font-semibold">{{ event.title }}</p>
            <p>{{ event.description }}</p>
            <div  class="flex flex-row flex-wrap gap-2 underline">
              <p v-for="(label, index) in event.labels" :key="index" class="cursor-pointer" @click="fetchEventsLabel(label)">{{label}}</p>
            </div>
            <div class="flex flex-row">
              <p>{{(event.start_local).split('T')[0]}}-</p>
              <p>{{(event.end_local).split('T')[0]}}</p>
            </div>
            <div v-show="event.duration !== 0" class="flex flex-row">
              <p>{{(event.start_local).split('T')[1]}}-</p>
              <p>{{(event.end_local).split('T')[1]}}</p>
            </div>
          </div>
          <div class="font-semibold">
            <div v-show="event.duration != 0">
              <p v-if="event.duration == 3600">Duration: {{ Math.round(event.duration / 3600)}} hour</p>
              <p v-else-if="event.duration < 86400">Duration: {{ Math.round(event.duration / 3600)}} hours</p>
              <p v-else-if="Math.round(event.duration / 86400) == 1">Duration: {{ Math.round(event.duration / 86400)}} day</p>
              <p v-else>Duration: {{ Math.round(event.duration / 86400)}} days</p>
            </div>
          </div>         
        </div>
      </div>
      <nav v-show="eventsCount > 10" class="flex mt-10">
        <div v-show="offset > 9" class="flex gap-2">
          <svg @click="pageChange(0)" class="cursor-pointer" enable-background="new 0 0 26 26" height="20px" id="Layer_1" version="1.1" viewBox="0 0 26 26" width="26px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g>
              <polygon fill="#231F20" points="23.885,0.58 25.969,2.664 15.133,13.5 25.969,24.336 23.885,26.42 10.965,13.5  "/>
              <polygon fill="#231F20" points="12.885,0.58 14.969,2.664 4.133,13.5 14.969,24.336 12.885,26.42 -0.035,13.5  "/>
            </g>
          </svg>
          <svg @click="pageChange(offset - 10)" class="cursor-pointer" enable-background="new 0 0 15 26" height="20px" id="Layer_1" version="1.1" viewBox="0 0 15 26" width="15px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <polygon fill="#231F20" points="12.885,0.58 14.969,2.664 4.133,13.5 14.969,24.336 12.885,26.42 2.049,15.584 -0.035,13.5 "/>
          </svg>
        </div>
        
        <div v-show="offset < eventsCount - 10" class="flex gap-2 ml-auto">
          <svg @click="pageChange(offset + 10)" class="cursor-pointer" enable-background="new 0 0 15 26" height="20px" id="Layer_1" version="1.1" viewBox="0 0 15 26" width="15px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <polygon fill="#231F20" points="2.019,0.58 -0.035,2.634 10.646,13.316 -0.035,23.997 2.019,26.052 14.755,13.316 "/>
          </svg>            
          <svg @click="pageChange(eventsCount - (eventsCount % 10))" class="cursor-pointer" enable-background="new 0 0 26 26" height="20px" id="Layer_1" version="1.1" viewBox="0 0 26 26" width="26px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g>
              <polygon fill="#231F20" points="2.049,0.58 -0.035,2.664 10.801,13.5 -0.035,24.336 2.049,26.42 14.969,13.5  "/>
              <polygon fill="#231F20" points="13.049,0.58 10.965,2.664 21.801,13.5 10.965,24.336 13.049,26.42 25.969,13.5  "/>
            </g>
          </svg>
        </div>
        <polygon fill="#231F20" points="23.885,0.58 25.969,2.664 15.133,13.5 25.969,24.336 23.885,26.42 10.965,13.5  "/>
      </nav>
    </div>
    <NewEvent :modalActive="modalActive" @close-modal="addNewEvent"></NewEvent>
    <MyEvents v-if="isClient" />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import NewEvent from './NewEvent.vue';

const isClient = ref(false);
const config = useRuntimeConfig();
const query = ref('');
const events = ref([]);
const loadingData = ref(false);
const offset = ref(0);
const eventsCount = ref(0);
const currentSearchType = ref('');
const currentLabel = ref('');
const modalActive = ref(null);

onMounted(() => {
  isClient.value = true;
});

const fetchEvents = async () => {
  loadingData.value=true;
  if(query.value.trim()){
    currentSearchType.value = 'query';
    try {
      const response = await axios.get('https://api.predicthq.com/v1/events/', {
        headers: {
          Authorization: `Bearer ${config.public.ApiKey}`,
          Accept: 'application/json'
        },
        params: {
          q: query.value,
          offset: offset.value,
          limit: 10
        },
      });
      events.value = response.data.results;
      eventsCount.value = response.data.count;
      console.log(events.value)
      console.log(response.data.count)
    } 
    catch (error) {
      console.error('Error fetching events:', error);
    }
  }
  loadingData.value=false;
};

const fetchEventsLabel = async (label) => {
  loadingData.value=true;
  query.value="";
  currentSearchType.value = 'label'
  if (currentLabel.value !== label) {
    offset.value = 0;
  }
  try {
    const response = await axios.get('https://api.predicthq.com/v1/events/', {
      headers: {
        Authorization: `Bearer ${config.public.ApiKey}`,
        Accept: 'application/json'
      },
      params: { 
        label: label,
        offset: offset.value
      },
    });
    events.value = response.data.results;
    eventsCount.value = response.data.count;
    console.log(events.value);
    console.log(eventsCount.value);
  } 
  catch (error) {
    console.error('Error fetching events:', error);
  }
  loadingData.value=false;
  currentLabel.value = label;
};

const searchEvents = () => {
  offset.value = 0; 
  fetchEvents();  
};

const pageChange = (newOffset) => {
  offset.value = newOffset;
  console.log(offset.value)
  if (currentSearchType.value === 'query') {
    fetchEvents();
  } else if (currentSearchType.value === 'label') {
    fetchEventsLabel(currentLabel.value); 
  }
}

const addNewEvent = () => {
  modalActive.value = !modalActive.value;
} 
</script>