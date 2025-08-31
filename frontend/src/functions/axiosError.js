export const parseAxiosError = (error) => {
  if (error.response) {
        return error.response.data?.message || `Server Error: ${error.response.status}`;
      } else if (error.request) {
        return "No response from server. Please refresh or try again later.";
      } else {
        return error.message
      }
}
