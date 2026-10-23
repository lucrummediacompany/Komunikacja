import "dotenv/config";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  assertProduct,
  createCdpPaidFetch,
  DEFAULT_DAILY_CAP_ATOMIC,
  TradingZonesClient,
} from "../src/index.js";

const product = (process.argv[2] ?? process.env.TZ_PRODUCT ?? "TZ-SELECT").toUpperCase();
assertProduct(product);

const outputDir = process.env.TZ_OUTPUT_DIR ?? "./data";
const statePath = join(outputDir, `${product.toLowerCase()}-state.json`);
const latestPath = join(outputDir, `${product.toLowerCase()}-latest.json`);
const dailyCapAtomic = BigInt(process.env.TZ_DAILY_CAP_ATOMIC ?? DEFAULT_DAILY_CAP_ATOMIC);

const { paidFetch } = createCdpPaidFetch({
  dailyCapAtomic,
  onApproachingLimit: (spent, limit) => console.error(`Spend: ${spent}/${limit} atomic USDC`),
});
const client = new TradingZonesClient({ fetch: paidFetch });

await mkdir(outputDir, { recursive: true });
const previous = await readJson(statePath);

if (previous?.valid_until && Date.parse(previous.valid_until) > Date.now()) {
  console.error(`Cached package ${previous.package_id} remains valid until ${previous.valid_until}; no purchase made.`);
  process.exit(0);
}

const setup = await client.getSetup(product);
await writeFile(latestPath, `${JSON.stringify(setup, null, 2)}\n`, { mode: 0o600 });
await writeFile(
  statePath,
  `${JSON.stringify({ package_id: setup.package_id, valid_until: setup.valid_until }, null, 2)}\n`,
  { mode: 0o600 },
);
console.log(JSON.stringify(setup));

async function readJson(path: string): Promise<Record<string, string> | null> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as Record<string, string>;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
