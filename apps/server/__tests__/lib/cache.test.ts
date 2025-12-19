import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { Cache } from "../../src/lib/cache";

describe("Cache", () => {
  let cache: Cache<string>;

  beforeEach(() => {
    cache = new Cache<string>(1000, 10, 60000);
  });

  afterEach(() => {
    cache.destroy();
  });

  describe("get/set", () => {
    it("stores and retrieves a value", () => {
      cache.set("key1", "value1");
      expect(cache.get("key1")).toBe("value1");
    });

    it("returns null for non-existent key", () => {
      expect(cache.get("nonexistent")).toBeNull();
    });

    it("stores objects correctly", () => {
      const objCache = new Cache<{ name: string }>(1000);
      objCache.set("user", { name: "John" });
      expect(objCache.get("user")).toEqual({ name: "John" });
      objCache.destroy();
    });

    it("overwrites existing value", () => {
      cache.set("key1", "value1");
      cache.set("key1", "value2");
      expect(cache.get("key1")).toBe("value2");
    });
  });

  describe("has", () => {
    it("returns true for existing key", () => {
      cache.set("key1", "value1");
      expect(cache.has("key1")).toBe(true);
    });

    it("returns false for non-existent key", () => {
      expect(cache.has("nonexistent")).toBe(false);
    });
  });

  describe("delete", () => {
    it("removes existing key", () => {
      cache.set("key1", "value1");
      cache.delete("key1");
      expect(cache.get("key1")).toBeNull();
    });

    it("handles deleting non-existent key gracefully", () => {
      expect(() => cache.delete("nonexistent")).not.toThrow();
    });
  });

  describe("clear", () => {
    it("removes all entries", () => {
      cache.set("key1", "value1");
      cache.set("key2", "value2");
      cache.clear();
      expect(cache.get("key1")).toBeNull();
      expect(cache.get("key2")).toBeNull();
      expect(cache.size()).toBe(0);
    });
  });

  describe("size", () => {
    it("returns correct count", () => {
      expect(cache.size()).toBe(0);
      cache.set("key1", "value1");
      expect(cache.size()).toBe(1);
      cache.set("key2", "value2");
      expect(cache.size()).toBe(2);
    });
  });

  describe("TTL expiration", () => {
    it("returns null for expired entry", async () => {
      const shortCache = new Cache<string>(50, 10, 60000);
      shortCache.set("key1", "value1");
      expect(shortCache.get("key1")).toBe("value1");

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(shortCache.get("key1")).toBeNull();
      shortCache.destroy();
    });

    it("has returns false for expired entry", async () => {
      const shortCache = new Cache<string>(50, 10, 60000);
      shortCache.set("key1", "value1");

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(shortCache.has("key1")).toBe(false);
      shortCache.destroy();
    });
  });

  describe("capacity management", () => {
    it("evicts oldest entry when capacity reached", () => {
      const smallCache = new Cache<string>(10000, 3, 60000);
      smallCache.set("key1", "value1");
      smallCache.set("key2", "value2");
      smallCache.set("key3", "value3");
      smallCache.set("key4", "value4");

      expect(smallCache.get("key1")).toBeNull();
      expect(smallCache.get("key2")).toBe("value2");
      expect(smallCache.get("key3")).toBe("value3");
      expect(smallCache.get("key4")).toBe("value4");
      smallCache.destroy();
    });

    it("respects maxSize limit", () => {
      const smallCache = new Cache<string>(10000, 2, 60000);
      smallCache.set("a", "1");
      smallCache.set("b", "2");
      smallCache.set("c", "3");

      expect(smallCache.size()).toBeLessThanOrEqual(2);
      smallCache.destroy();
    });
  });

  describe("destroy", () => {
    it("clears cache and stops interval", () => {
      cache.set("key1", "value1");
      cache.destroy();
      expect(cache.size()).toBe(0);
    });
  });
});
