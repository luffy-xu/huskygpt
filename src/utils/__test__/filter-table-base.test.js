
      // Test for autoResetPageNum
      import { autoResetPageNum, Pagination } from './pagination';
      import { FilterTableBase } from './filter-table-base';
      
      describe('autoResetPageNum', () => {
        let pagination: Pagination;
        let filterTableBase: FilterTableBase;
        let setCurrentSpy: jest.SpyInstance;
      
        beforeEach(() => {
          pagination = new Pagination(() => {});
          filterTableBase = new FilterTableBase();
          filterTableBase.pagination = pagination;
          setCurrentSpy = jest.spyOn(pagination, 'setCurrent');
        });
      
        afterEach(() => {
          setCurrentSpy.mockRestore();
        });
      
        it('should reset page number when autoResetPageNum is called', async () => {
          await filterTableBase.addFilter({});
          expect(setCurrentSpy).toHaveBeenCalledWith(1);
        });
      });
      
      // Test for Pagination
      import { Pagination } from './pagination';
      
      describe('Pagination', () => {
        let pagination: Pagination;
        let changeHandlerSpy: jest.SpyInstance;
      
        beforeEach(() => {
          changeHandlerSpy = jest.fn();
          pagination = new Pagination(changeHandlerSpy);
        });
      
        afterEach(() => {
          changeHandlerSpy.mockRestore();
        });
      
        it('should call changeHandler when changePage is called', async () => {
          await pagination.changePage({});
          expect(changeHandlerSpy).toHaveBeenCalled();
        });
      
        it('should set pagination when setPagination is called', () => {
          const config = {
            pageSize: 10,
            current: 1,
            total: 0,
            showSizeChanger: true,
          };
          pagination.setPagination(config);
          expect(pagination.config).toEqual(config);
        });
      
        it('should set current when setCurrent is called', () => {
          pagination.setCurrent(2);
          expect(pagination.config.current).toEqual(2);
        });
      
        it('should set config when setConfig is called', () => {
          const config = {
            pageSize: 10,
            current: 1,
            total: 0,
            showSizeChanger: true,
          };
          pagination.setConfig(config);
          expect(pagination.config).toEqual(config);
        });
      });
      
      // Test for towSum
      import towSum from './tow-sum';
      
      describe('towSum', () => {
        it('should return the correct indices when the target is found', () => {
          const nums = [1, 3];
          const target = 4;
          const result = towSum(nums, target);
          expect(result).toEqual([0, 1]);
        });
      
        it('should return an empty array when the target is not found', () => {
          const nums = [1, 3];
          const target = 5;
          const result = towSum(nums, target);
          expect(result).toEqual([]);
        });
      });
      
      // Test for FilterTableBase
      import { FilterTableBase } from './filter-table-base';
      
      describe('FilterTableBase', () => {
        let filterTableBase: FilterTableBase;
        let getDataSpy: jest.SpyInstance;
        let setListSpy: jest.SpyInstance;
        let setItemIdSpy: jest.SpyInstance;
        let setItemDetailSpy: jest.SpyInstance;
        let getItemDetailDataSpy: jest.SpyInstance;
      
        beforeEach(() => {
          filterTableBase = new FilterTableBase();
          getDataSpy = jest.spyOn(filterTableBase, 'getData');
          setListSpy = jest.spyOn(filterTableBase, 'setList');
          setItemIdSpy = jest.spyOn(filterTableBase, 'setItemId');
          setItemDetailSpy = jest.spyOn(filterTableBase, 'setItemDetail');
          getItemDetailDataSpy = jest.spyOn(filterTableBase, 'getItemDetailData');
        });
      
        afterEach(() => {
          getDataSpy.mockRestore();
          setListSpy.mockRestore();
          setItemIdSpy.mockRestore();
          setItemDetailSpy.mockRestore();
          getItemDetailDataSpy.mockRestore();
        });
      
        it('should call getData when getList is called', async () => {
          await filterTableBase.getList();
          expect(getDataSpy).toHaveBeenCalled();
        });
      
        it('should call setList when getList is called', async () => {
          await filterTableBase.getList();
          expect(setListSpy).toHaveBeenCalled();
        });
      
        it('should call setItemId when initItem is called', () => {
          filterTableBase.initItem();
          expect(setItemIdSpy).toHaveBeenCalledWith(null);
        });
      
        it('should call setItemDetail when initItem is called', () => {
          filterTableBase.initItem();
          expect(setItemDetailSpy).toHaveBeenCalledWith(null);
        });
      
        it('should call getItemDetailData when getItemDetail is called', async () => {
          await filterTableBase.getItemDetail();
          expect(getItemDetailDataSpy).toHaveBeenCalled();
        });
      });
      
      // Run test
      To run the test suite, run the following command in the terminal:
      `npm test`