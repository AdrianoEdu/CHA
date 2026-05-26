import { CustomerType } from "../../app/generated/prisma";
import { readExcel } from "../../app/web/utils/readFileXLS";
import { PrismaClient } from "@prisma/client";

export async function seedCustomers(prisma: PrismaClient) {
  const customers = readExcel<{
    name: string;
    code: string;
  }>({
    startRow: 4,
    totalRows: 234,
    columns: {
      name: "A",
      code: "C",
    },
  })
    .map((customer) => {
      const rawName = String(customer.name ?? "").trim();

      const match = rawName.match(/^0*(\d+)\s*-\s*(.*)$/);

      if (!match) {
        return null;
      }

      return {
        name: match[2].trim(),
        numberId: Number(match[1]),
        code: String(customer.code ?? "").trim(),
        customerType: CustomerType.CLIENT,
      };
    })
    .filter(Boolean);

  const count = await prisma.customer.count();

  if (count === 0) {
    await prisma.customer.createMany({
      data: customers,
      skipDuplicates: true,
    });

    console.log("👤 Clientes adicionados");
  }
}
