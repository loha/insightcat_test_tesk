<template>
  <div class="lagend">
    <div class="rectangle" :style="{ 'background-color': color }"></div>
    <span>{{ text }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Legend extends Vue {
  @Prop({ type: String, required: true })
  public readonly color!: string;

  @Prop({ type: String, required: true })
  public readonly text!: string;
}
</script>

<style lang="scss">
@import '@/assets/scss/utils/variables/index';

.lagend {
  display: inline-flex;
  align-items: center;
  width: 100%;

  .rectangle {
    width: 16px;
    height: 4px;
    margin-right: 9px;
    border-radius: 5px;
  }
}
</style>
