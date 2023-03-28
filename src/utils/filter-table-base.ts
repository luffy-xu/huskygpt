import { autoResetPageNum, Pagination } from './pagination';

export enum EFilterTableLoading {
  getList = 'getList',
  getDetail = 'getDetail',
}

type IPageData = any;
type IObject = any;

export class FilterTableBase<
  T extends IObject,
  P extends IObject,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ID = any,
  DETAIL extends IObject = IObject
> {
  filter: Partial<T> = {};
  tableFilter: Partial<T> = {};
  list: P[] = [];

  // used for displaying details function
  itemId: ID;
  itemDetail: DETAIL;

  pagination: Pagination = new Pagination(() => this.getList());

  initItem() {
    this.setItemId(null);
    this.setItemDetail(null);
  }

  setItemId(id: ID) {
    this.itemId = id;
  }

  setItemDetail(itemDetail: DETAIL) {
    this.itemDetail = itemDetail;
  }

  getItemDetail() {
    return this.getItemDetailData();
  }

  getItemDetailData(): Promise<DETAIL> {
    return Promise.resolve(null);
  }

  reset() {
    this.setFilter({});
  }

  @autoResetPageNum()
  addFilter(filter: Partial<T>) {
    this.filter = { ...this.filter, ...filter };
  }

  @autoResetPageNum()
  addFilterDebounce(filter: Partial<T>) {
    this.filter = { ...this.filter, ...filter };
  }

  addTableFilter(filter: Partial<T>) {
    this.tableFilter = { ...this.tableFilter, ...filter };
  }

  @autoResetPageNum()
  setTableFilter(filter: Partial<T>) {
    this.tableFilter = filter;
  }

  @autoResetPageNum()
  setFilter(filter: Partial<T>) {
    this.filter = filter;
  }

  setList(data: IPageData) {
    if (!data) return;
    this.list = data.entities;
    this.pagination.setPagination({ total: data.total });
  }

  getData(_filter: Partial<T>): Promise<IPageData> {
    return Promise.resolve(null);
  }

  async getList(config: Partial<any> = this.pagination.config) {
    const result = await this.getData({
      ...this.filter,
      ...this.tableFilter,
      pageSize: config.pageSize,
      pageNum: config.current,
    });

    this.setList(result);
    return result;
  }
}
