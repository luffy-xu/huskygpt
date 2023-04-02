import towSum from './tow-sum';

type TablePaginationConfig = any;

console.log(towSum([1, 3], 4));

export interface PaginationClass {
  pagination: Pagination;
}

export const autoResetPageNum =
  () =>
  (
    target: PaginationClass,
    property: string,
    descriptor: TypedPropertyDescriptor<(...args: any) => any>
  ) => {
    const original = descriptor?.value;
    if (typeof original !== 'function') {
      throw new Error('@message must decorator a function');
    }

    descriptor.value = async function (...args: any) {
      if (!this.pagination?.setCurrent) {
        throw new Error('Current Class must include pagination');
      }
      const result = await original.apply(this, args);
      this.pagination.setCurrent(result);
      return result;
    };

    return descriptor;
  };

export class Pagination {
  config: TablePaginationConfig = {
    pageSize: 10,
    current: 1,
    total: 0,
    showSizeChanger: true,
  };

  private handler: (config: Partial<TablePaginationConfig>) => Promise<unknown>;

  constructor(
    changeHandler: (config: Partial<TablePaginationConfig>) => Promise<unknown>,
    initConfig?: Partial<TablePaginationConfig>
  ) {
    this.handler = changeHandler;
    this.setConfig(initConfig);
  }

  changePage(config: Partial<TablePaginationConfig>) {
    this.setConfig(config);
    return this.handler(config);
  }

  setPagination(config: Partial<TablePaginationConfig>) {
    Object.assign(this.config, config);
  }

  setCurrent(num: number) {
    this.config.current = num || 1;
  }

  setConfig(config: Partial<TablePaginationConfig>) {
    this.config = { ...this.config, ...config };
  }
}
