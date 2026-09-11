import { describe, it, expect } from "vitest";
import { parseAxiosError } from "../axiosError";
import {
  axiosRequestError,
  axiosResponseError,
  axiosSetupError,
} from "../../test/fixtures";

describe("parseAxiosError", () => {
  describe("when the server responded", () => {
    it("prefers the server-supplied message", () => {
      expect(parseAxiosError(axiosResponseError(400, "County not found"))).toBe(
        "County not found",
      );
    });

    it("falls back to the status code when the body has no message", () => {
      expect(parseAxiosError(axiosResponseError(500))).toBe("Server Error: 500");
    });

    it("falls back to the status code when the body is null", () => {
      const error = { response: { status: 503, data: null } };
      expect(parseAxiosError(error)).toBe("Server Error: 503");
    });

    it("falls back when the message is an empty string", () => {
      expect(parseAxiosError(axiosResponseError(404, ""))).toBe(
        "Server Error: 404",
      );
    });
  });

  describe("when the request was sent but nothing came back", () => {
    it("returns the retry guidance", () => {
      expect(parseAxiosError(axiosRequestError())).toBe(
        "No response from server. Please refresh or try again later.",
      );
    });

    it("prefers the response branch when both keys are present", () => {
      const error = { ...axiosRequestError(), ...axiosResponseError(418, "teapot") };
      expect(parseAxiosError(error)).toBe("teapot");
    });
  });

  describe("when the request was never sent", () => {
    it("returns the raw error message", () => {
      expect(parseAxiosError(axiosSetupError("Network Error"))).toBe(
        "Network Error",
      );
    });

    it("returns undefined for an error with no message", () => {
      expect(parseAxiosError({})).toBeUndefined();
    });
  });
});
