import dotenv from "dotenv";

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number.parseInt(process.env.PORT ?? "3000", 10),
  jwtSecret:
    process.env.JWT_SECRET ||
    (process.env.NODE_ENV === "production"
      ? (() => {
          throw new Error("JWT_SECRET must be set in production");
        })()
      : "dev_jwt_secret_change_me"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};

export { env };
