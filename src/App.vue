<template>
  <div id="app">
    <main>
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  metaInfo() {
    return { title: 'Insightcat Test task!' };
  },
})
export default class App extends Vue {}
</script>
