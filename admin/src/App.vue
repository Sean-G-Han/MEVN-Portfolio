<script setup lang="ts">
import EditProjForm from './EditProjForm.vue';
import EditProfForm from './EditProfForm.vue';

</script>

<template>
  <div id="app">
    <EditProjForm
      title=""
      type=""
      description=""
      :techStack=[]
    />
    <EditProfForm
      title="Sample Proficiency"
      level="5"
      description="This is a sample proficiency description."
      :types="['Speaking', 'Writing']"
    />
  </div>
</template>

<style>
#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>