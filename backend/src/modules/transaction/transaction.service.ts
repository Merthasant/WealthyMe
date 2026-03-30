import { prisma } from "@/lib/prisma";
import { TransactionOptionParam } from "@/lib/types/params.type";
import validationUtils from "@/lib/utils/validation.utils";

const transactionService = {
  // find by id
  async findById(id: string) {
    validationUtils.requiredValue(id, "id");

    return await prisma.transaction.findUnique({
      where: { id },
    });
  },

  // find all
  async findAll(option: TransactionOptionParam) {},
};

export default transactionService;
