import "@dotenvx/dotenvx/config";

const requiredEnvs = ["JWT_SECRET", "MONGO_URI"];
const missingEnvs = requiredEnvs.filter((envName) => !process.env[envName]);

if (missingEnvs.length) {
  throw new Error(`Missing required envs ${missingEnvs}`);
}

export const saltRounds = process.env.SALT_ROUNDS
  ? +process.env.SALT_ROUNDS
  : 7;
export const jwtSecret = process.env.JWT_SECRET!;
export const mongoURI = process.env.MONGO_URI!;
export const port = process.env.PORT || 3000;
