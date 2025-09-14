<script setup lang="ts">
import './style.css';
import 'vue3-carousel/dist/carousel.css';
import ProficiencyPage from './components/proficiencies/ProficiencyPage.vue';
import ProjectsPage from './components/projects/ProjectsPage.vue';
import { ref, computed } from 'vue';

const message = ref('Loading...');

const proficienciesLoaded = ref(false);
const projectsLoaded = ref(false);

const loading = computed(() => !(proficienciesLoaded.value && projectsLoaded.value));

const handleProficienciesLoaded = () => {
  message.value = 'Proficiencies loaded successfully.';
  proficienciesLoaded.value = true;
};

const handleProficienciesError = () => {
  proficienciesLoaded.value = true;
};

const handleProjectsLoaded = () => {
  message.value = 'Projects loaded successfully.';
  projectsLoaded.value = true;
};

const handleProjectsError = () => {
  projectsLoaded.value = true;
};

</script>

<template>
<div id="app">
  <div id="content" class="relative">

    <div class="fixed top-0 left-0 w-full flex justify-end bg-gray-200 p-3 z-100">
      <nav>
        <button class="bg-gray-200 hover:bg-gray-400 text-black font-bold p-2 rounded-lg">
          View My GitHub
        </button>
      </nav>
    </div>

    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-200">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      <p class="ml-4 text-lg">{{ message }}</p>
    </div>

    <div class="flex flex-col md:flex-row min-h-screen gap-6">
      <div class="md:w-2/5 md:overflow-y-auto">
        <div class="h-full flex flex-col justify-center items-center">
          <div class="mb-6">
            <img 
              src="../logo.png" 
              alt="Portrait" 
              class="logo"
            />
          </div>

          <div class="w-full max-w-lg">
            <ProficiencyPage 
              @loaded="handleProficienciesLoaded"
              @error="handleProficienciesError"
            />
          </div>
        </div>
      </div>

      <div class="md:w-3/5">
        <ProjectsPage 
          @loaded="handleProjectsLoaded"
          @error="handleProjectsError"
        /> 
      </div>
    </div>
  </div>
</div>
</template>


<style scoped>
#app {
  background-color: aliceblue;
  max-width: 100vw;
  margin: 0 auto;
}

#content {
  max-width: 80vw;
  margin: 0 auto;
}

.logo {
  width: 90vw;
  object-fit: cover;
  object-position: center;
}
</style>