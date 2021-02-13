<template>
  <div class="graphs">
    <div class="graphs__item" v-for="(initialData, index) in initialDatas" :key="index">
      <Graph :settings="settings" :initialData="initialData" />
    </div>
  </div>
</template>

<script lang="ts">
import InitialData from '@/app/utils/diagram/initialData';
import { Component, Vue } from 'vue-property-decorator';
import { Settings as GraphSettings, InitialDataItem } from '@/types/diagram';

@Component({
  components: {
    Graph: () => import('@/components/graph/request'),
  },
})
export default class Home extends Vue {
  public initialDatas: Array<Array<InitialDataItem>> = [];

  async created(): Promise<void> {
    const initialData: Array<InitialDataItem> = InitialData.init();
    const numberofGraphs: number = 8;

    for (let i = 0; i < numberofGraphs; i++) {
      this.initialDatas.push(initialData);
    }

    setInterval(() => {
      const initialDatas: Array<Array<InitialDataItem>> = [];

      for (let i = 0; i < numberofGraphs; i++) {
        initialDatas.push(InitialData.generate(0, 4, 3));
      }

      this.initialDatas = initialDatas;
    }, 10000);
  }

  public get settings(): GraphSettings {
    return {
      title: 'LogIns',
      yAxis: {
        values: [0, 1, 2, 3, 4],
      },
      xAxis: {
        distanceBetweenPoints: 2,
        labels: [1, 2, 3, 4],
        labelPosition: -4,
      },
      lagendsColors: ['#687ef0', '#b26de9', '#64c542'],
    };
  }
}
</script>

<style lang="scss" scoped>
.graphs {
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  justify-content: space-around;

  .graphs__item {
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
</style>
