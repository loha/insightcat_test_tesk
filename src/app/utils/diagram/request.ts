import { PositionItem } from '@/types/diagram';

type Options = {
  value: Array<number | string> | number;
  numberOfItems: number;
  from: number;
  margin: number;
  dimension: string;
};

class RequestDiagramUtil {
  public static calculatePositions(options: Options): Array<PositionItem> {
    const result: Array<PositionItem> = [];
    const value: Array<number | string> | number = options.value;
    const dimension: string = options.dimension;
    const numberOfItems: number = options.numberOfItems;
    const isArray: boolean = 'object' === typeof value;
    const from: number = options.from;
    const margin: number = options.margin;
    let currentPosition: number = from;

    for (let i = 0; i < numberOfItems; i++) {
      isArray
        ? //@ts-ignore
          result.push({ position: this.positionToString(currentPosition, dimension), value: value[i] })
        : result.push({ position: this.positionToString(currentPosition, dimension) });
      currentPosition += margin;
    }

    return result;
  }

  protected static positionToString(value: number, dimension: string) {
    return `${value}${dimension}`;
  }

  public static calculateY(value: number | string, max: number | string): number {
    return (this.toNumber(value) / this.toNumber(max)) * 100;
  }

  public static calculateXDate(value: number | string, min: number | string, max: number | string): number {
    if (min === value) {
      return 100;
    }

    if (max === value) {
      return 0;
    }
    value = this.toNumber(value);
    min = this.toNumber(min);
    max = this.toNumber(max);

    const maximum: number = max - min;
    const current: number = max - value;

    return (current / maximum) * 100;
  }

  protected static toNumber(value: any): number {
    return value * 1;
  }
}

export default RequestDiagramUtil;
