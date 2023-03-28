import { Pagination } from '../pagination';

describe('Pagination', () => {
  let pagination;
  beforeEach(() => {
    pagination = new Pagination(() => {});
  });

  it('should set the config correctly', () => {
    const config = {
      pageSize: 10,
      current: 1,
      total: 0,
      showSizeChanger: true,
    };
    pagination.setConfig(config);
    expect(pagination.config).toEqual(config);
  });

  it('should set the current page correctly', () => {
    pagination.setCurrent(2);
    expect(pagination.config.current).toEqual(2);
  });

  it('should call the change handler when changePage is called', () => {
    const spy = jest.spyOn(pagination, 'handler');
    const config = {
      pageSize: 10,
      current: 1,
      total: 0,
      showSizeChanger: true,
    };
    pagination.changePage(config);
    expect(spy).toHaveBeenCalledWith(config);
  });
});

// describe('autoResetPageNum', () => {
//   it('should throw an error if the target does not have a pagination property', () => {
//     const target = {};
//     expect(() => autoResetPageNum()(target, '', {})).toThrowError(
//       'Current Class must include pagination'
//     );
//   });

//   it('should call the setCurrent method of the pagination object', () => {
//     const target = {
//       pagination: {
//         setCurrent: jest.fn(),
//       },
//     };
//     const descriptor = {
//       value: jest.fn(() => Promise.resolve(2)),
//     };
//     autoResetPageNum()(target, '', descriptor);
//     expect(target.pagination.setCurrent).toHaveBeenCalledWith(2);
//   });
// });
