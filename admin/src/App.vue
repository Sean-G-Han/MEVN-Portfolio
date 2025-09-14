<script setup lang="ts">
import EditProjForm from './EditProjForm.vue';
import EditProfForm from './EditProfForm.vue';
import EditExpForm from './EditExpForm.vue';

</script>

<template>
  <div id="app">
    <EditProjForm
      projTitle=""
      projType=""
      projDescription=""
      :projTechStack=[]
    />
    <EditProfForm
      profTitle="Sample Proficiency"
      profLevel="5"
      profDescription="This is a sample proficiency description."
      :profTypes="[]"
    />
    <EditExpForm
      expCompany="Sample Company"
      expRole="Sample Role"
      expFrom="2020-01-01"
      expTo="2020-12-31"
      expDescription="This is a sample experience description."
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