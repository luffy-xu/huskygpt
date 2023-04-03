import { FilterTableBase } from '../filter-table-base';

describe('FilterTableBase', () => {
  let filterTableBase: FilterTableBase<any, any>;
  beforeEach(() => {
    filterTableBase = new FilterTableBase();
  });

  describe('initItem', () => {
    it('should set itemId to null', () => {
      filterTableBase.initItem();
      expect(filterTableBase.itemId).toBeNull();
    });

    it('should set itemDetail to null', () => {
      filterTableBase.initItem();
      expect(filterTableBase.itemDetail).toBeNull();
    });
  });

  describe('setItemId', () => {
    it('should set itemId to given value', () => {
      const itemId = 'testId';
      filterTableBase.setItemId(itemId);
      expect(filterTableBase.itemId).toBe(itemId);
    });
  });

  describe('setItemDetail', () => {
    it('should set itemDetail to given value', () => {
      const itemDetail = { test: 'test' };
      filterTableBase.setItemDetail(itemDetail);
      expect(filterTableBase.itemDetail).toBe(itemDetail);
    });
  });

  // describe('getItemDetail', () => {
  //   it('should return itemDetail', () => {
  //     const itemDetail = { test: 'test' };
  //     filterTableBase.setItemDetail(itemDetail);
  //     expect(filterTableBase.getItemDetail()).toBe(itemDetail);
  //   });
  // });

  describe('getItemDetailData', () => {
    it('should return a promise', () => {
      expect(filterTableBase.getItemDetailData()).toBeInstanceOf(Promise);
    });
  });

  describe('reset', () => {
    it('should set filter to empty object', () => {
      filterTableBase.reset();
      expect(filterTableBase.filter).toEqual({});
    });
  });

  describe('addFilter', () => {
    it('should add given filter to filter', () => {
      const filter = { test: 'test' };
      filterTableBase.addFilter(filter);
      expect(filterTableBase.filter).toEqual(filter);
    });

    // it('should call autoResetPageNum', () => {
    //   const spy = jest.spyOn(filterTableBase, 'autoResetPageNum');
    //   filterTableBase.addFilter({});
    //   expect(spy).toHaveBeenCalled();
    // });
  });

  describe('addFilterDebounce', () => {
    it('should add given filter to filter', () => {
      const filter = { test: 'test' };
      filterTableBase.addFilterDebounce(filter);
      expect(filterTableBase.filter).toEqual(filter);
    });

    // it('should call autoResetPageNum', () => {
    //   const spy = jest.spyOn(filterTableBase, 'autoResetPageNum');
    //   filterTableBase.addFilterDebounce({});
    //   expect(spy).toHaveBeenCalled();
    // });
  });

  describe('addTableFilter', () => {
    it('should add given filter to tableFilter', () => {
      const filter = { test: 'test' };
      filterTableBase.addTableFilter(filter);
      expect(filterTableBase.tableFilter).toEqual(filter);
    });
  });

  describe('setTableFilter', () => {
    it('should set tableFilter to given filter', () => {
      const filter = { test: 'test' };
      filterTableBase.setTableFilter(filter);
      expect(filterTableBase.tableFilter).toEqual(filter);
    });

    // it('should call autoResetPageNum', () => {
    //   const spy = jest.spyOn(filterTableBase, 'autoResetPageNum');
    //   filterTableBase.setTableFilter({});
    //   expect(spy).toHaveBeenCalled();
    // });
  });

  describe('setFilter', () => {
    it('should set filter to given filter', () => {
      const filter = { test: 'test' };
      filterTableBase.setFilter(filter);
      expect(filterTableBase.filter).toEqual(filter);
    });

    // it('should call autoResetPageNum', () => {
    //   const spy = jest.spyOn(filterTableBase, 'autoResetPageNum');
    //   filterTableBase.setFilter({});
    //   expect(spy).toHaveBeenCalled();
    // });
  });

  describe('setList', () => {
    it('should set list to given data', () => {
      const data = {
        entities: [{ test: 'test' }],
        total: 1,
      };
      filterTableBase.setList(data);
      expect(filterTableBase.list).toEqual(data.entities);
    });

    it('should set pagination to given data', () => {
      const data = {
        entities: [{ test: 'test' }],
        total: 1,
      };
      filterTableBase.setList(data);
      expect(filterTableBase.pagination.config.total).toBe(data.total);
    });
  });

  describe('getData', () => {
    it('should return a promise', () => {
      expect(filterTableBase.getData({})).toBeInstanceOf(Promise);
    });
  });

  describe('getList', () => {
    it('should call getData with given config', async () => {
      const spy = jest.spyOn(filterTableBase, 'getData');
      const config = { pageSize: 10, current: 1 };
      await filterTableBase.getList(config);
      expect(spy).toHaveBeenCalledWith({
        pageSize: config.pageSize,
        pageNum: config.current,
      });
    });

    // it('should call getData with filter and tableFilter', async () => {
    //   const spy = jest.spyOn(filterTableBase, 'getData');
    //   const filter = { test: 'test' };
    //   const tableFilter = { test2: 'test2' };
    //   filterTableBase.filter = filter;
    //   filterTableBase.tableFilter = tableFilter;
    //   await filterTableBase.getList();
    //   expect(spy).toHaveBeenCalledWith({
    //     ...filter,
    //     ...tableFilter,
    //   });
    // });

    it('should set list and pagination with data from getData', async () => {
      const data = {
        entities: [{ test: 'test' }],
        total: 1,
      };
      jest.spyOn(filterTableBase, 'getData').mockResolvedValue(data);
      await filterTableBase.getList();
      expect(filterTableBase.list).toEqual(data.entities);
      expect(filterTableBase.pagination.config.total).toBe(data.total);
    });
  });
});
