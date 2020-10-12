import handleAxiosError from './index';

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('non axios error', () => {
  it('should throw original exception', () => {
    const dummyError = new Error('dummy error');

    const noResponseMockCallback = jest.fn();
    const catchAllMockCallback = jest.fn();

    const result = handleAxiosError(dummyError, {
      '*': catchAllMockCallback,
      NO_RESPONSE: noResponseMockCallback,
    });

    expect(result).toBe(dummyError);
  });
});

describe('axios error', () => {
  it('should throw original exception if no handler is added', () => {
    const dummyError = new Error('dummy error');

    expect(handleAxiosError(dummyError, {})).toBe(dummyError);
  });

  describe('no server response', () => {
    it('should call NO_RESPONSE handler', () => {
      const dummyError = {
        isAxiosError: true,
        response: null,
      };

      const noResponseMockCallback = jest.fn();

      handleAxiosError(dummyError, {
        NO_RESPONSE: noResponseMockCallback,
      });

      expect(noResponseMockCallback).toBeCalledWith('NO_RESPONSE');
    });

    it('should call catchAll handler', () => {
      const dummyError = {
        isAxiosError: true,
        response: null,
      };

      const catchAllMockCallback = jest.fn();

      handleAxiosError(dummyError, {
        '*': catchAllMockCallback,
      });

      expect(catchAllMockCallback).toBeCalledTimes(1);
      expect(catchAllMockCallback).toBeCalledWith('NO_RESPONSE');
    });

    it('should throw original error', () => {
      const dummyError = {
        isAxiosError: true,
        response: null,
      };

      expect(handleAxiosError(dummyError, {})).toBe(dummyError);
    });
  });

  describe('server response has status', () => {
    it('should call specified handler for 404 request', () => {
      const axios404Error = {
        isAxiosError: true,
        response: {
          status: 404,
        },
      };

      const mockReturn = new Error('own 404 error');

      const e404MockCallback = jest.fn().mockReturnValue(mockReturn);

      const result = handleAxiosError(axios404Error, {
        404: e404MockCallback,
      });

      expect(e404MockCallback).toBeCalledWith(404);
      expect(result).toBe(mockReturn);
    });

    it('should call catchAll callback for 404 request if no other handler is given', () => {
      const e404 = {
        isAxiosError: true,
        response: {
          status: 404,
        },
      };

      const mockReturn = new Error('I handled this');

      const catchAllMockCallback = jest.fn().mockReturnValue(mockReturn);

      const result = handleAxiosError(e404, {
        '*': catchAllMockCallback,
      });

      expect(catchAllMockCallback).toBeCalledWith(404);
      expect(result).toBe(mockReturn);
    });

    it('should throw original error for 404 request if handler is given', () => {
      const e404 = {
        isAxiosError: true,
        response: {
          status: 404,
        },
      };

      const e500MockCallback = jest.fn().mockReturnValue('extra 500 handling');

      const result = handleAxiosError(e404, { 500: () => e500MockCallback() });

      expect(result).toBe(e404);
      expect(e500MockCallback).toBeCalledTimes(0);
    });
  });
});
