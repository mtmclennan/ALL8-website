import { randomUUID } from "node:crypto";

import { Redis } from "@upstash/redis";

const completeDelivery = `
  if redis.call("get", KEYS[1]) ~= ARGV[1] then return 0 end
  if ARGV[2] == "done" then
    redis.call("set", KEYS[1], "done", "EX", 604800)
  else
    redis.call("del", KEYS[1])
  end
  return 1
`;

export async function claimDelivery(digest: string) {
  const redis = Redis.fromEnv({
    retry: false,
    signal: () => AbortSignal.timeout(3000),
  });
  const key = `indexnow:sanity:${digest}`;
  const token = randomUUID();

  if (!(await redis.set(key, token, { nx: true, ex: 45 }))) {
    return (await redis.get(key)) === "done"
      ? { state: "duplicate" as const }
      : { state: "busy" as const };
  }

  return {
    state: "claimed" as const,
    async finish(done: boolean) {
      const updated = await redis.eval(
        completeDelivery,
        [key],
        [token, done ? "done" : "release"],
      );

      if (updated !== 1) throw new Error("IndexNow delivery lease expired");
    },
  };
}
