<template>
    <Transition name="new">
        <div v-show="modalActive" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div class="bg-white w-3/4 sm:w-3/4 h-4/5 rounded-xl
            flex flex-col justify-center items-center gap-4">
                <div class="flex flex-col gap-4 xs:flex-col sm:flex-row">
                    <div>
                        <p>Title:</p>
                        <input v-model="title" type="text" name="title"
                        class="border-2 p-2 rounded-lg focus:border-black focus:outline-none transition-colors ease-linear duration-150">
                    </div>
                    <div>
                        <p>Description:</p>
                        <input v-model="description" type="text" name="description" 
                        class="border-2 p-2 rounded-lg focus:border-black focus:outline-none transition-colors ease-linear duration-150">
                    </div>
                </div>
                <div class="flex flex-col gap-4 xs:flex-col sm:flex-row">
                    <div>
                        <p>Start:</p>
                        <input v-model="startDate" type="date" name="startDate" :min="currentDate" @input="updateEndDate"
                        class="border-2 p-2 rounded-lg focus:border-black focus:outline-none transition-colors ease-linear duration-150">
                    </div>
                    <div>
                        <p>End:</p>
                        <input v-model="endDate" type="date" name="endDate" :min="startDate"
                        class="border-2 p-2 rounded-lg focus:border-black focus:outline-none transition-colors ease-linear duration-150">
                    </div>
                </div>
                <div class="flex flex-col gap-4 xs:flex-col sm:flex-row">
                    <div>
                        <p>Start time:</p>
                        <input v-model="startTime" type="time" name="startTime"
                        class="border-2 p-2 rounded-lg focus:border-black focus:outline-none transition-colors ease-linear duration-150" >
                    </div>
                    <div>
                        <p>End time:</p>
                        <input v-model="endTime" type="time" name="endTime"
                        class="border-2 p-2 rounded-lg focus:border-black focus:outline-none transition-colors ease-linear duration-150" >
                    </div>
                </div>
                
                <div class="flex gap-4">
                    <button @click="newEvent"
                    class="border-2 p-2 rounded-lg hover:border-black transition-colors ease-linear duration-150">Add</button>
                    <button @click="$emit('close-modal')" 
                    class="border-2 p-2 rounded-lg hover:border-black transition-colors ease-linear duration-150">Close</button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref } from 'vue';

const title = ref('');
const description = ref('');
const startDate = ref(null);
const endDate = ref(null);
const startTime = ref(null);
const endTime = ref(null);

const { $locally } = useNuxtApp();
const storedmyEvents = $locally.getItem('myEvents');
const myEvents = reactive(storedmyEvents ? JSON.parse(storedmyEvents) : []);


const currentDate = computed(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
});

const updateEndDate = () => {
    if (new Date(endDate.value) < new Date(startDate.value)) {
        endDate.value = startDate.value;
    }
};

const emit = defineEmits(['close-modal']);

const props = defineProps({
    modalActive:{
        type: Boolean,
        default: false
    }
})

const newEvent = () => {
    if(title.value.trim() && description.value.trim() && startDate.value !== null && endDate.value !== null){
        console.log(title.value, description.value, startDate.value, endDate.value , startTime.value, endTime.value);
        const startDateTime = new Date(`${startDate.value}T${startTime.value}`);
        const endDateTime = new Date(`${endDate.value}T${endTime.value}`);
        const durationInSeconds = (endDateTime - startDateTime) / 1000;

        myEvents.push({
            title: title.value,
            description: description.value,
            startDate: startDate.value,
            endDate: endDate.value,
            startTime: startTime.value,
            endTime: endTime.value,
            duration: durationInSeconds 
        })
        $locally.setItem('myEvents', JSON.stringify(myEvents));


        title.value = '';
        description.value = '';
        startDate.value = null;
        endDate.value = null;
        startTime.value = null;
        endTime.value = null;

    }
}
</script>

<style>
.new-enter-active,
.new-leave-active {
  transition: all 0.5s cubic-bezier(0.52, 0.02, 0.19, 1.02)
  
}
.new-enter-from,
.new-leave-to {
  opacity: 0;
  transform: translateZ(-20px);
}
</style>