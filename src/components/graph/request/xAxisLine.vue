<template>
  <li class="x-axis-line-list__item" :style="{ right: rightPosition }">
    <span></span><span :style="{ right: `${labelPosition}px` }">{{ text }}</span>
  </li>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class XAxisLine extends Vue {
  @Prop({ type: [String, Number], required: true })
  public readonly text!: string;

  @Prop({ type: String, required: true })
  public readonly rightPosition!: string;

  @Prop({ type: [String, Number], required: false })
  public readonly labelPosition!: string;
}
</script>

<style lang="scss">
@import '@/assets/scss/utils/variables/index';

.x-axis-line-list__item {
  list-style: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;

  span {
    color: $diagram-label-color;

    &:first-child {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: block;
      border-right: $diagram-grid-border;
    }

    &:last-child {
      position: absolute;
      bottom: -7%;
    }
  }
}
</style>
