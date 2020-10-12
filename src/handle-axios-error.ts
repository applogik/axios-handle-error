import { AxiosError } from 'axios';

type ResponseStatusType = number | 'NO_RESPONSE' | '*';

export function handleAxiosErrorOrThrow(
  e: any,
  callbacks: {
    [key in ResponseStatusType]?: (status: ResponseStatusType) => void;
  },
) {
  if (e.isAxiosError) {
    const catchAllHandler = callbacks['*'];

    const axiosError = e as AxiosError;
    if (axiosError.response) {
      const status = axiosError.response.status;
      const errorCallback = callbacks[status];
      if (errorCallback) {
        errorCallback(status);
      } else if (catchAllHandler) {
        catchAllHandler(status);
      } else {
        throw e;
      }
    } else {
      if (callbacks.NO_RESPONSE) {
        callbacks.NO_RESPONSE('NO_RESPONSE');
      } else if (catchAllHandler) {
        catchAllHandler('NO_RESPONSE');
      } else {
        throw e;
      }
    }
  } else {
    throw e;
  }
}
