<template>
  <VueDraggableResizable
    class="graph"
    :w="642"
    :h="443"
    :grid="[gridStepX, gridStepY]"
    :handles="['br']"
    @dragging="onDrag"
    @resizing="onResize"
  >
    <label class="title">{{ title }}</label>
    <div class="schedule">
      <div class="chart">
        <div class="y-axis"></div>
        <div class="x-axis"></div>
        <ul class="y-axis-labels">
          <YAxisLabel
            v-for="(label, index) in yAxisLabels"
            :key="index"
            :text="label.value"
            :bottomPosition="label.position"
          />
        </ul>
        <ul class="y-axis-line-list">
          <YAxisLine v-for="(line, index) in yAxisLines" :key="index" :bottomPosition="line.position" />
        </ul>
        <ul class="x-axis-line-list">
          <XAxisLine
            v-for="(line, index) in xAxisLines"
            :key="index"
            :text="line.value"
            :rightPosition="line.position"
            :labelPosition="index === 0 ? 0 : settings.xAxis.labelPosition"
          />
        </ul>
        <ul class="x-axis-bar-list">
          <Metric
            v-for="(value, index) in metrics"
            :key="index"
            :value="value"
            :colors="metricColors"
            :w="settings.xAxis.barWidth ? settings.xAxis.barWidth : 6.5"
          />
        </ul>
      </div>
      <div class="lagends">
        <Legend v-for="(legend, index) in legends" :key="index" :text="legend.text" :color="legend.color" />
      </div>
    </div>
  </VueDraggableResizable>
</template>

<script lang="ts">
// @ts-ignore
import VueDraggableResizable from 'vue-draggable-resizable';
import RequestDiagramUtil from '@/app/utils/diagram/request';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Settings, LegendSettings, PositionItem, InitialDataItem, Metric } from '@/types/diagram';

const dimension: string = '%';

@Component({
  components: {
    VueDraggableResizable,
    Legend: () => import('./lagend.vue'),
    YAxisLabel: () => import('./yAxisLabel.vue'),
    YAxisLine: () => import('./yAxisLine.vue'),
    XAxisLine: () => import('./xAxisLine.vue'),
    Metric: () => import('./metric.vue'),
  },
})
export default class Graph extends Vue {
  @Prop({ type: Number, required: false, default: 642 })
  public readonly w!: number;

  @Prop({ type: Number, required: false, default: 443 })
  public readonly h!: number;

  @Prop({ type: Object, required: true })
  public readonly settings!: Settings;

  @Prop({ type: Array, required: true, default: [] })
  public readonly initialData!: Array<InitialDataItem>;

  protected metricColors: Array<string> = [];
  protected width: number = 0;
  protected height: number = 0;
  protected x: number = 0;
  protected y: number = 0;
  protected gridStepX: number = 60;
  protected gridStepY: number = 60;

  async created(): Promise<void> {
    this.width = this.w;
    this.height = this.h;
    const colors: Array<string> = this.settings.lagendsColors || [];
    this.metricColors = colors.slice().reverse();
  }

  public get title(): string {
    return this.settings.title;
  }

  public get legends(): Array<LegendSettings> {
    const result: Array<LegendSettings> = [];
    const colors: Array<string> = this.settings.lagendsColors || [];

    for (let i = this.initialData.length - 1; i >= 0; i--) {
      const legend: LegendSettings = {
        text: this.initialData[i].metric.__name__,
        color: colors[i],
      };
      result.push(legend);
    }

    return result;
  }

  public get yAxisLabels(): Array<PositionItem> {
    const from: number = -2;
    const to: number = 102;
    const labels: Array<string | number> = this.settings.yAxis.values;
    const numberOfItems: number = labels.length;
    const max = Math.abs(from) + Math.abs(to);
    const margin: number = max / (numberOfItems - 1);

    return RequestDiagramUtil.calculatePositions({
      value: labels,
      numberOfItems,
      from,
      margin,
      dimension,
    });
  }

  public get yAxisLines(): Array<PositionItem> {
    const from: number = 0;
    const to: number = 100;
    const labels: Array<string | number> = this.settings.yAxis.values;
    const numberOfItems = labels.length;
    const max = Math.abs(from) + Math.abs(to);
    const margin: number = max / (numberOfItems - 1);

    return RequestDiagramUtil.calculatePositions({
      value: labels!,
      numberOfItems,
      from,
      margin,
      dimension,
    });
  }

  public get xAxisLines(): Array<PositionItem> {
    const from: number = 0;
    const to: number = 100;
    const labels: Array<string | number> = this.settings.xAxis.labels.slice().reverse();
    const distanceBetweenPoints: number = this.settings.xAxis.distanceBetweenPoints;
    const superfluousItems: number = distanceBetweenPoints % 2 ? 2 : 1;
    const numberOfItems = labels.length * distanceBetweenPoints - superfluousItems;
    const max = from + to;
    const margin: number = max / numberOfItems;
    const value: Array<string | number> = [];
    let currentLabelIndex: number = 0;

    for (let i = 0; i < numberOfItems; i++) {
      if (currentLabelIndex === i) {
        value.push(labels.shift()!);
        currentLabelIndex += distanceBetweenPoints;
      } else {
        value.push('');
      }
    }

    return RequestDiagramUtil.calculatePositions({
      value,
      numberOfItems,
      from,
      margin,
      dimension,
    });
  }

  public get metrics(): Array<Metric> {
    const result: Array<Metric> = [];
    const itemsInitem: number = this.initialData.length;
    const numberOfItems: number = this.initialData[0].values.length;
    const mixX: number | string = this.initialData[0].values[0][0];
    const maxX: number | string = this.initialData[0].values[numberOfItems - 1][0];
    const maxY: number | string = this.settings.yAxis.values[this.settings.yAxis.values.length - 1];

    for (let i = 0; i < numberOfItems; i++) {
      const x: number | string = this.initialData[0].values[i][0];
      const metric: Metric = {
        x: RequestDiagramUtil.calculateXDate(x, mixX, maxX),
        y: this.fillYMetric(itemsInitem, maxY, i),
      };

      result.push(metric);
    }

    return result;
  }

  protected fillYMetric(itemsInitem: number, maxY: number | string, index: number): Array<number> {
    const result: Array<number> = [];
    for (let j = itemsInitem - 1; j >= 0; j--) {
      const y = this.initialData[j].values[index][1];
      result.push(RequestDiagramUtil.calculateY(y, maxY));
    }

    return result;
  }

  public onDrag(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public onResize(x: number, y: number, width: number, height: number): void {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/utils/variables/index';

.graph {
  display: flex;
  flex-direction: column;
  background-color: #22242c;
  border-radius: 4px;

  .handle-br {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 0px;
    width: 10px;
    height: 10px;
    cursor: nwse-resize;
  }

  .title {
    color: #caced1;
    font-size: 15px;
    font-weight: 500;
    text-align: center;
    margin: 12px 0;
  }

  .schedule {
    display: flex;
    justify-content: space-around;
    height: 100%;
    margin-left: 33px;
    margin-bottom: 16px;

    .chart {
      position: relative;
      flex-basis: 75%;
      height: 100%;
      .y-axis,
      .x-axis {
        position: absolute;
        bottom: $diagram-bottom;
        left: $diagram-left;
      }

      .y-axis {
        top: 0;
        right: auto;
        width: 1px;
        background-color: $diagram-axis-color;
      }

      .x-axis {
        top: auto;
        right: 0;
        height: 1px;
        background-color: $diagram-axis-color;
      }

      .y-axis-labels {
        position: absolute;
        top: 10px;
        right: auto;
        bottom: $diagram-bottom;
        left: 0;
      }

      .y-axis-line-list {
        position: absolute;
        top: 0;
        right: 0;
        bottom: $diagram-bottom;
        left: $diagram-left;
      }

      .x-axis-line-list {
        position: absolute;
        top: 0;
        right: 0;
        bottom: $diagram-bottom;
        left: $diagram-left;
      }

      .x-axis-bar-list {
        position: absolute;
        top: 0;
        right: 1px;
        bottom: $diagram-bottom;
        left: 38px;
      }
    }

    .lagends {
      flex-basis: 25%;
      margin-left: 10px;
    }
  }
}
</style>
