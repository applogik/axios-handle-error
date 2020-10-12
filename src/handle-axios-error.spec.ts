import handleAxiosErrorOrThrow from './index';

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('non axios error', () => {
  it('should throw original exception', () => {
    const dummyError = new Error('dummy error');

    const noResponseMockCallback = jest.fn();
    const catchAllMockCallback = jest.fn();

    expect(() =>
      handleAxiosErrorOrThrow(dummyError, {
        '*': catchAllMockCallback,
        NO_RESPONSE: noResponseMockCallback,
      }),
    ).toThrow(dummyError);
  });
});

describe('axios error', () => {
  it('should throw original exception if no handler is added', () => {
    const dummyError = new Error('dummy error');

    expect(() => handleAxiosErrorOrThrow(dummyError, {})).toThrow(dummyError);
  });

  describe('no server response', () => {
    it('should call NO_RESPONSE handler', () => {
      const dummyError = {
        isAxiosError: true,
        response: null,
      };

      const noResponseMockCallback = jest.fn();

      handleAxiosErrorOrThrow(dummyError, {
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
      const noResponseMockCallback = jest.fn();

      handleAxiosErrorOrThrow(dummyError, {
        '*': catchAllMockCallback,
        NO_RESPONSE: noResponseMockCallback,
      });

      expect(noResponseMockCallback).toBeCalledWith('NO_RESPONSE');
      expect(catchAllMockCallback).toBeCalledTimes(0);
    });

    it('should throw original error', () => {
      const dummyError = {
        isAxiosError: true,
        response: null,
      };

      expect(() => handleAxiosErrorOrThrow(dummyError, {})).toThrow();
    });
  });

  describe('server response has status', () => {
    it('should call specified handler for 404 request', () => {
      const e404 = {
        isAxiosError: true,
        response: {
          status: 404,
        },
      };

      const e404MockCallback = jest.fn();

      handleAxiosErrorOrThrow(e404, {
        404: e404MockCallback,
      });

      expect(e404MockCallback).toBeCalledWith(404);
    });

    it('should call catchAll callback for 404 request if no other handler is given', () => {
      const e404 = {
        isAxiosError: true,
        response: {
          status: 404,
        },
      };

      const catchAllMockCallback = jest.fn();

      handleAxiosErrorOrThrow(e404, {
        '*': catchAllMockCallback,
      });

      expect(catchAllMockCallback).toBeCalledWith(404);
    });

    it('should throw original error for 404 request if handler is given', () => {
      const e404 = {
        isAxiosError: true,
        response: {
          status: 404,
        },
      };

      const e500MockCallback = jest.fn();

      expect(() =>
        handleAxiosErrorOrThrow(e404, { 500: e500MockCallback }),
      ).toThrow();
      expect(e500MockCallback).toBeCalledTimes(0);
    });
  });
});
