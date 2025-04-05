import { NextApiRequest, NextApiResponse } from "next";

const rateLimitMap: Record<string, Map<string, number[]>> = {};
export function rateLimit(
  req: NextApiRequest,
  res: NextApiResponse,
  {
    key = "default",
    limit = 5,
    duration = 60000,
  }: {
    key?: string;
    limit?: number;
    duration?: number;
  } = {}
) {
  if (!rateLimitMap[key]) {
    rateLimitMap[key] = new Map();
  }

  const ipOIps =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown";
  const now = Date.now();
  const ips = typeof ipOIps === "string" ? [ipOIps] : ipOIps;

  for (const ip in ips) {
    const requests = rateLimitMap[key].get(ip) || [];
    rateLimitMap[key].set(
      ip,
      [...requests, now].filter((time) => !(time - now > duration))
    );

    const numberOfRequests = rateLimitMap[key].get(ip)?.length || 0;
    if (numberOfRequests > limit) {
      res
        .status(429)
        .json({ message: "Too many requests. Please try again later." });
      return true;
    }
  }

  return false;
}
