import arcjet, { shield, detectBot, tokenBucket } from '@arcjet/node';

const aj = arcjet({
  key: process.env.ARCJET_KEY || "ajkey_demo", // Falls back gracefully if testing locally without key
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({ mode: "LIVE", allow: [] }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: 10,
      capacity: 20,
    }),
  ],
});

export const securityCheck = async (req, res, next) => {
  if (!process.env.ARCJET_KEY) return next(); // Skip if key isn't provided yet
  
  try {
    const decision = await aj.protect(req, { requested: 1 });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ message: "Too many requests. Please slow down." });
      }
      if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Automated traffic blocked." });
      }
      return res.status(403).json({ message: "Access Denied by Arcjet." });
    }
    next();
  } catch (error) {
    console.error("Arcjet Middleware Error:", error);
    next();
  }
};