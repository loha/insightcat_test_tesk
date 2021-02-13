<template>
  <div class="metric" :style="{ right: `${left}%`, height: `${height}%`, width: `${width}px` }">
    <div
      v-for="(value, index) in yAxisValuesHeight"
      :key="index"
      :style="{ height: `${value}%`, 'background-color': colors[index] }"
    ></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Metric extends Vue {
  @Prop({ type: Object, required: true })
  public readonly value!: any;

  @Prop({ type: Array, required: true })
  public readonly colors!: Array<string>;

  @Prop({ type: Number, required: false, default: 6.5 })
  public readonly w!: number;

  protected width: number = 0;
  protected height: number = 0;

  async created(): Promise<void> {
    this.width = this.w;
  }

  public get yAxisValuesHeight(): Array<number> {
    const result: Array<number> = [];
    this.height = this.value.y.reduce((a: number, b: number) => {
      return a + b;
    });

    for (let i = 0; i < this.value.y.length; i++) {
      const value: number = (this.value.y[i] / this.height) * 100;
      result.push(value);
    }

    return result;
  }

  public get left(): number {
    return this.value.x;
  }
}
</script>

<style lang="scss">
.metric {
  position: absolute;
  bottom: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
