import { Pagination } from '../pagination';
import { FilterTableBase } from '../filter-table-base';

describe('FilterTableBase', () => {
  let filterTableBase: FilterTableBase<any, any>;
  let pagination: Pagination;
  let filter: Partial<any>;
  let tableFilter: Partial<any>;
  let itemId: any;
  let itemDetail: any;
  let pageData: any;
  let config: Partial<any>;

  beforeEach(() => {
    filterTableBase = new FilterTableBase();
    pagination = new Pagination(() => filterTableBase.getList());
    filter = {};
    tableFilter = {};
    itemId = null;
    itemDetail = null;
    pageData = {
      entities: [],
      total: 0,
    };
    config = {
      pageSize: 10,
      current: 1,
    };
  });

  it('should initItem correctly', () => {
    filterTableBase.initItem();
    expect(filterTableBase.itemId).toBe(null);
    expect(filterTableBase.itemDetail).toBe(null);
  });

  it('should setItemId correctly', () => {
    filterTableBase.setItemId(itemId);
    expect(filterTableBase.itemId).toBe(null);
  });

  it('should setItemDetail correctly', () => {
    filterTableBase.setItemDetail(itemDetail);
    expect(filterTableBase.itemDetail).toBe(null);
  });

  it('should getItemDetailData correctly', async () => {
    const result = await filterTableBase.getItemDetailData();
    expect(result).toBe(null);
  });

  it('should reset correctly', () => {
    filterTableBase.setFilter(filter);
    filterTableBase.reset();
    expect(filterTableBase.filter).toEqual({});
  });

  it('should addFilter correctly', () => {
    filterTableBase.addFilter(filter);
    expect(filterTableBase.filter).toEqual(filter);
  });

  it('should addFilterDebounce correctly', () => {
    filterTableBase.addFilterDebounce(filter);
    expect(filterTableBase.filter).toEqual(filter);
  });

  it('should addTableFilter correctly', () => {
    filterTableBase.addTableFilter(tableFilter);
    expect(filterTableBase.tableFilter).toEqual(tableFilter);
  });

  it('should setTableFilter correctly', () => {
    filterTableBase.setTableFilter(tableFilter);
    expect(filterTableBase.tableFilter).toEqual(tableFilter);
  });

  it('should setFilter correctly', () => {
    filterTableBase.setFilter(filter);
    expect(filterTableBase.filter).toEqual(filter);
  });

  it('should setList correctly', () => {
    filterTableBase.setList(pageData);
    expect(filterTableBase.list).toEqual(pageData.entities);
    expect(filterTableBase.pagination.config.total).toBe(pageData.total);
  });

  it('should getData correctly', async () => {
    const result = await filterTableBase.getData(filter);
    expect(result).toBe(null);
  });

  it('should getList correctly', async () => {
    filterTableBase.getList(config);
    expect(filterTableBase.list).toEqual(pageData.entities);
    expect(filterTableBase.pagination.config.total).toBe(pageData.total);
  });

  it('should autoResetPageNum correctly', async () => {
    const spy = jest.spyOn(filterTableBase.pagination, 'setCurrent');
    await filterTableBase.addFilter(filter);
    expect(spy).toHaveBeenCalled();
  });
});
