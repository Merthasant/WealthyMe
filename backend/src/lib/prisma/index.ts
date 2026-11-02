import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const now = Math.floor(Date.now()); // convert date ke unix tanpa bagi lebih detail

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter }).$extends({
  query: {
    $allModels: {
      async create({ args, query }) {
        args.data = {
          ...args.data,
          createdAt: now,
          updatedAt: now,
        };
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
        args.data = {
          ...args.data,
          updatedAt: now,
        };
        return query(args);
      },
      async updateMany({ args, query }) {
        args.data = {
          ...args.data,
          updatedAt: now,
        };
        return query(args);
      },
      async upsert({ args, query }) {
        args.create = {
          ...args.create,
          createdAt: now,
          updatedAt: now,
        };
        args.update = {
          ...args.update,
          updatedAt: now,
        };
        return query(args);
      },
    },
  },
});

export { prisma };
