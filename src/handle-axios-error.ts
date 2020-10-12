import { AxiosError } from 'axios';

type ResponseStatusType = number | 'NO_RESPONSE' | '*';

export function handleAxiosError(
  e: any,
  callbacks: {
    [key in ResponseStatusType]?: (status: ResponseStatusType) => Error;
  },
): Error {
  if (e.isAxiosError) {
    const catchAllHandler = callbacks['*'];

    const axiosError = e as AxiosError;
    if (axiosError.response) {
      const status = axiosError.response.status;
      const errorCallback = callbacks[status];
      if (errorCallback) {
        return errorCallback(status);
      } else if (catchAllHandler) {
        return catchAllHandler(status);
      } else {
        return e;
      }
    } else {
      if (callbacks.NO_RESPONSE) {
        return callbacks.NO_RESPONSE('NO_RESPONSE');
      } else if (catchAllHandler) {
        return catchAllHandler('NO_RESPONSE');
      } else {
        return e;
      }
    }
  } else {
    return e;
  }
}
