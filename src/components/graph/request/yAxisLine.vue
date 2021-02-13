<template>
  <li class="y-axis-line-list__item" :style="{ bottom: bottomPosition }"><span></span></li>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class YAxisLine extends Vue {
  @Prop({ type: String, required: true })
  public readonly bottomPosition!: string;
}
</script>

<style lang="scss">
@import '@/assets/scss/utils/variables/index';

.y-axis-line-list__item {
  list-style: none;
  position: absolute;
  top: auto;
  right: 0;
  bottom: 0;
  left: 0;

  &:first-child {
    display: none;
  }

  span {
    display: block;
    border: $diagram-grid-border;
  }
}
</style>
