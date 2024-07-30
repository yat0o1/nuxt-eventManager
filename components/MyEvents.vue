<template>
    <div v-show="myEvents.length > 0" class="mt-8">
        <p class="text-2xl font-semibold my-4">My events:</p>
        <div v-for="(event, index) in myEvents" :key="index" class="flex justify-between
        border-2 p-4 rounded-lg">
            <div class="flex flex-col gap-2
            w-2/3">
                <p class="text-2xl font-semibold">{{ event.title }}</p>
                <p>{{ event.description }}</p>
                <div class="flex flex-row">
                    <p>{{(event.startDate)}}-</p>
                    <p>{{(event.endDate)}}</p>
                </div>
                <div v-show="event.duration !== 0" class="flex flex-row">
                    <p>{{(event.startTime)}}-</p>
                    <p>{{(event.endTime)}}</p>
                </div>
                <button class="border-2 p-2 rounded-lg hover:border-black transition-colors ease-linear duration-150"
                @click="removeEvent(index)">Delete</button>
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
</template>

<script setup>

const { $locally } = useNuxtApp();
const storedmyEvents = $locally.getItem('myEvents');
const myEvents = reactive(storedmyEvents ? JSON.parse(storedmyEvents) : []);

const removeEvent = (i) => {
    myEvents.splice(i, 1);
    $locally.setItem('myEvents', JSON.stringify(myEvents));
}
</script>