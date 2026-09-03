import { describe, it, expect } from "vitest";
import { checkIsActive } from "./utils";
import { subscriptions } from "@/db/schema";

describe("Subscription Utilities", () => {
  describe("checkIsActive", () => {
    it("should return false when subscription is null or undefined", () => {
      expect(checkIsActive(null as any)).toBe(false);
      expect(checkIsActive(undefined as any)).toBe(false);
    });

    it("should return false when currentPeriodEnd or priceId is missing", () => {
      const subWithoutPeriod = {
        id: "sub_123",
        userId: "user_123",
        subscriptionId: "sub_stripe_123",
        customerId: "cus_123",
        priceId: "price_pro",
        currentPeriodEnd: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(checkIsActive(subWithoutPeriod as any)).toBe(false);

      const subWithoutPrice = {
        id: "sub_123",
        userId: "user_123",
        subscriptionId: "sub_stripe_123",
        customerId: "cus_123",
        priceId: null,
        currentPeriodEnd: new Date(Date.now() + 86400000),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(checkIsActive(subWithoutPrice as any)).toBe(false);
    });

    it("should return true when subscription period is active", () => {
      const activeSub = {
        id: "sub_123",
        userId: "user_123",
        subscriptionId: "sub_stripe_123",
        customerId: "cus_123",
        priceId: "price_pro",
        currentPeriodEnd: new Date(Date.now() + 86400000), // 1 day in the future
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(checkIsActive(activeSub as any)).toBe(true);
    });

    it("should return false when subscription period expired in the past", () => {
      const expiredSub = {
        id: "sub_123",
        userId: "user_123",
        subscriptionId: "sub_stripe_123",
        customerId: "cus_123",
        priceId: "price_pro",
        currentPeriodEnd: new Date(Date.now() - 2 * 86400000), // 2 days ago
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(checkIsActive(expiredSub as any)).toBe(false);
    });
  });
});
