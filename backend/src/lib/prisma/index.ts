import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const now = Math.floor(Date.now() / 1000); // convert date ke unix

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter }).$extends({
  query: {
    $allModels: {
      async create({ args, query }) {
        args.data.createdAt = now;
        args.data.updatedAt = now;
        return query(args);
      },
      async createMany({ args, query }) {
        const data = Array.isArray(args.data) ? args.data : [args.data];
        args.data = data.map((item) => ({
          ...item,
          createdAt: now,
          updatedAt: now,
        })) as typeof args.data;
        return query(args);
      },
      async update({ args, query }) {
        args.data.updatedAt = now;
        return query(args);
      },
      async updateMany({ args, query }) {
        args.data.updatedAt = now;
        return query(args);
      },
      async upsert({ args, query }) {
        args.create.createdAt = now;
        args.create.updatedAt = now;
        args.update.updatedAt = now;
        return query(args);
      },
    },
  },
});

export { prisma };
