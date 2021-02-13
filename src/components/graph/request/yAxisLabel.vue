<template>
  <li class="y-axis-labels__item" :style="{ bottom: bottomPosition }">
    <span>{{ text }}</span>
  </li>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class YAxisLabel extends Vue {
  @Prop({ type: [String, Number], required: true })
  public readonly text!: string;

  @Prop({ type: String, required: true })
  public readonly bottomPosition!: string;
}
</script>

<style lang="scss">
@import '@/assets/scss/utils/variables/index';

.y-axis-labels__item {
  list-style: none;
  position: absolute;
  top: auto;
  right: -20px;

  span {
    position: relative;
    display: block;
    color: $diagram-label-color;
    text-align: right;
    font-size: 12px;
    line-height: 1;
  }
}
</style>
