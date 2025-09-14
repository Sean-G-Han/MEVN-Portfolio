<script setup lang="ts">
import './style.css';
import 'vue3-carousel/dist/carousel.css';
import ProficiencyPage from './components/proficiencies/ProficiencyPage.vue';
import ProjectsPage from './components/projects/ProjectsPage.vue';
import { ref, computed } from 'vue';
import ExperiencePage from './components/experieces/ExperiencePage.vue';

const message = ref('Waking up Render.com server. This will take ~15 seconds...');

const currentPage = ref<'projects' | 'experience'>('projects');

const proficienciesLoaded = ref(false);
const projectsLoaded = ref(false);
const experienceLoaded = ref(false);

const loading = computed(() => !(proficienciesLoaded.value && projectsLoaded.value && experienceLoaded.value));

const handleProficienciesLoaded = () => {
  message.value = 'Proficiencies loaded successfully.';
  proficienciesLoaded.value = true;
};

const handleProficienciesError = () => {
  proficienciesLoaded.value = true;
};

const handleExperienceLoaded = () => {
  message.value = 'Experience loaded successfully.';
  experienceLoaded.value = true;
};

const handleExperienceError = () => {
  experienceLoaded.value = true;
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

    <div class="fixed top-0 left-0 w-full flex justify-center bg-blue-200 p-3 z-100">
      <nav>
        <button 
          class="bg-blue-200 hover:bg-blue-400 text-black font-bold p-2 rounded-lg"
          @click="currentPage = 'experience'"
        >
          Intern/Work Experience
        </button>
        <button 
          class="bg-blue-200 hover:bg-blue-400 text-black font-bold p-2 rounded-lg"
          @click="currentPage = 'projects'"
        >
          Projects
        </button>
      </nav>
    </div>

    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-200">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      <p class="ml-4 text-lg">{{ message }}</p>
    </div>

    <div class="flex flex-col md:flex-row min-h-screen gap-6">
      <div class="md:w-2/5 h-full flex flex-col min-h-screen justify-center">
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

      <div class="md:w-3/5">
        <ExperiencePage 
          :visible="currentPage === 'experience'"
          v-show="currentPage === 'experience'"
          @loaded="handleExperienceLoaded"
          @error="handleExperienceError"
        />
        <ProjectsPage
          :visible="currentPage === 'projects'"
          v-show="currentPage === 'projects'"
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