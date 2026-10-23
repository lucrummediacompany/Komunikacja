import { CdpX402Client } from "@coinbase/cdp-sdk/x402";
import { wrapFetchWithPayment } from "@x402/fetch";
import {
  BASE_MAINNET,
  BASE_USDC,
  DEFAULT_DAILY_CAP_ATOMIC,
  PRICE_ATOMIC,
  TRADING_ZONES_PAYEE,
} from "./constants.js";

export interface CdpPaidFetchOptions {
  dailyCapAtomic?: bigint;
  onApproachingLimit?: (spentAtomic: bigint, limitAtomic: bigint) => void;
}

export function createCdpPaidFetch(options: CdpPaidFetchOptions = {}) {
  const dailyCapAtomic = options.dailyCapAtomic ?? DEFAULT_DAILY_CAP_ATOMIC;
  if (dailyCapAtomic < PRICE_ATOMIC) {
    throw new RangeError(`dailyCapAtomic must be at least ${PRICE_ATOMIC}.`);
  }

  const paymentClient = new CdpX402Client({
    environment: "production",
    builderCode: "trading_zones_sdk",
    spendControls: {
      maxAmountPerPayment: { atomic: PRICE_ATOMIC, asset: BASE_USDC },
      maxCumulativeSpend: { atomic: dailyCapAtomic, asset: BASE_USDC },
      maxCumulativeSpendWindow: "24h",
      allowedNetworks: [BASE_MAINNET],
      allowedAssets: [BASE_USDC],
      allowedPayees: [TRADING_ZONES_PAYEE],
      onApproachingLimit: (spent, limit) => {
        options.onApproachingLimit?.(BigInt(spent.atomic), BigInt(limit.atomic));
      },
    },
  });

  return {
    paymentClient,
    // The published CDP class extends the runtime x402 client. This narrow cast
    // avoids a duplicate private-field identity emitted by current declarations.
    paidFetch: wrapFetchWithPayment(
      globalThis.fetch,
      paymentClient as unknown as Parameters<typeof wrapFetchWithPayment>[1],
    ),
  };
}
