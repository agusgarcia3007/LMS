import { describe, it, expect } from "bun:test";
import { generateVerificationCode } from "../../src/lib/certificate";

describe("generateVerificationCode", () => {
  it("generates 8 character code", () => {
    const code = generateVerificationCode();
    expect(code.length).toBe(8);
  });

  it("contains only alphanumeric uppercase characters", () => {
    const code = generateVerificationCode();
    expect(code).toMatch(/^[A-Z0-9]{8}$/);
  });

  it("generates different codes on each call", () => {
    const codes = new Set<string>();
    for (let i = 0; i < 100; i++) {
      codes.add(generateVerificationCode());
    }
    expect(codes.size).toBeGreaterThan(95);
  });

  it("does not contain lowercase letters", () => {
    for (let i = 0; i < 50; i++) {
      const code = generateVerificationCode();
      expect(code).toBe(code.toUpperCase());
    }
  });

  it("does not contain special characters", () => {
    for (let i = 0; i < 50; i++) {
      const code = generateVerificationCode();
      expect(code).not.toMatch(/[^A-Z0-9]/);
    }
  });
});
