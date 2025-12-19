import { describe, it, expect } from "bun:test";
import {
  parseListParams,
  getPaginationParams,
  calculatePagination,
} from "../../src/lib/filters";

describe("parseListParams", () => {
  it("returns defaults for empty query", () => {
    const result = parseListParams({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.sort).toBeUndefined();
    expect(result.search).toBeUndefined();
    expect(result.filters).toEqual({});
  });

  it("parses page and limit", () => {
    const result = parseListParams({ page: "3", limit: "25" });
    expect(result.page).toBe(3);
    expect(result.limit).toBe(25);
  });

  it("enforces minimum page of 1", () => {
    const result = parseListParams({ page: "0" });
    expect(result.page).toBe(1);

    const result2 = parseListParams({ page: "-5" });
    expect(result2.page).toBe(1);
  });

  it("enforces minimum limit of 1", () => {
    const result = parseListParams({ limit: "0" });
    expect(result.limit).toBe(1);

    const result2 = parseListParams({ limit: "-10" });
    expect(result2.limit).toBe(1);
  });

  it("caps limit at 100", () => {
    const result = parseListParams({ limit: "500" });
    expect(result.limit).toBe(100);
  });

  it("parses sort with asc order", () => {
    const result = parseListParams({ sort: "name:asc" });
    expect(result.sort).toEqual({ field: "name", order: "asc" });
  });

  it("parses sort with desc order", () => {
    const result = parseListParams({ sort: "createdAt:desc" });
    expect(result.sort).toEqual({ field: "createdAt", order: "desc" });
  });

  it("ignores invalid sort format", () => {
    const result = parseListParams({ sort: "invalid" });
    expect(result.sort).toBeUndefined();

    const result2 = parseListParams({ sort: "name:invalid" });
    expect(result2.sort).toBeUndefined();
  });

  it("parses search parameter", () => {
    const result = parseListParams({ search: "test query" });
    expect(result.search).toBe("test query");
  });

  it("extracts filters excluding reserved keys", () => {
    const result = parseListParams({
      page: "1",
      limit: "10",
      sort: "name:asc",
      search: "query",
      status: "active",
      role: "admin",
    });

    expect(result.filters).toEqual({
      status: "active",
      role: "admin",
    });
  });

  it("ignores empty filter values", () => {
    const result = parseListParams({
      status: "",
      role: "admin",
    });

    expect(result.filters).toEqual({
      role: "admin",
    });
  });

  it("handles undefined filter values", () => {
    const result = parseListParams({
      status: undefined,
      role: "admin",
    });

    expect(result.filters).toEqual({
      role: "admin",
    });
  });
});

describe("getPaginationParams", () => {
  it("returns correct offset for page 1", () => {
    const result = getPaginationParams(1, 20);
    expect(result.limit).toBe(20);
    expect(result.offset).toBe(0);
  });

  it("returns correct offset for page 2", () => {
    const result = getPaginationParams(2, 20);
    expect(result.limit).toBe(20);
    expect(result.offset).toBe(20);
  });

  it("returns correct offset for page 5 with limit 10", () => {
    const result = getPaginationParams(5, 10);
    expect(result.limit).toBe(10);
    expect(result.offset).toBe(40);
  });
});

describe("calculatePagination", () => {
  it("calculates totalPages correctly for exact division", () => {
    const result = calculatePagination(100, 1, 20);
    expect(result.total).toBe(100);
    expect(result.totalPages).toBe(5);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  it("calculates totalPages correctly with remainder", () => {
    const result = calculatePagination(95, 1, 20);
    expect(result.totalPages).toBe(5);
  });

  it("returns 1 page for empty results", () => {
    const result = calculatePagination(0, 1, 20);
    expect(result.totalPages).toBe(0);
  });

  it("returns 1 page when total is less than limit", () => {
    const result = calculatePagination(5, 1, 20);
    expect(result.totalPages).toBe(1);
  });

  it("preserves page and limit in response", () => {
    const result = calculatePagination(50, 3, 15);
    expect(result.page).toBe(3);
    expect(result.limit).toBe(15);
  });
});
