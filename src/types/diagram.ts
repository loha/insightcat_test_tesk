export type Settings = {
  title: string;
  lagendsColors?: Array<string>;
  xAxis: XAxisSettings;
  yAxis: YAxisSettings;
};

export type LegendSettings = {
  text: string;
  color: string;
};

export type XAxisSettings = {
  labels: Array<string | number>;
  distanceBetweenPoints: number;

  /**
   * label position in pixels
   *
   * @default -16
   */
  labelPosition?: number;

  /**
   * Bar width
   *
   * @default 6.5
   */
  barWidth?: number;
};

export type YAxisSettings = {
  values: Array<string | number>;
};

export type PositionItem = {
  position: string;
  value?: string | number;
};

export type InitialDataItem = {
  metric: InitialDataItemMetric;
  values: Array<[number | string, number | string]>;
};

export type InitialDataItemMetric = {
  __name__: string;
  cpu: string;
  host: string;
};

export type Metric = {
  x: number;
  y: Array<number>;
};
