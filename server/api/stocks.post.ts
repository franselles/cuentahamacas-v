import prisma from "../lib/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const {
    sector_id,
    beds_replaced,
    beds_retired,
    beds_broken,
    umbrellas_replaced,
    umbrellas_retired,
    umbrellas_broken,
  } = body;

  // Usamos $transaction para asegurar que ambas operaciones ocurran o ninguna
  return await prisma.$transaction(async (tx) => {
    // 1. Crear el registro de Stock (Insert)
    const newStock = await tx.stocks.create({
      data: {
        date_stock: new Date(),
        sector_id: Number(sector_id),
        beds_replaced: Number(beds_replaced || 0),
        beds_retired: Number(beds_retired || 0),
        beds_broken: Number(beds_broken || 0),
        umbrellas_replaced: Number(umbrellas_replaced || 0),
        umbrellas_retired: Number(umbrellas_retired || 0),
        umbrellas_broken: Number(umbrellas_broken || 0),
      },
    });

    // 2. Actualizar el Sector (Update con tu fórmula)
    // beds = beds + replaced - retired - broken
    const updatedSector = await tx.sectors.update({
      where: { id: Number(sector_id) },
      data: {
        beds: {
          increment:
            Number(beds_replaced || 0) -
            Number(beds_retired || 0) -
            Number(beds_broken || 0),
        },
        umbrellas: {
          increment:
            Number(umbrellas_replaced || 0) -
            Number(umbrellas_retired || 0) -
            Number(umbrellas_broken || 0),
        },
      },
    });

    return { newStock, updatedSector };
  });
});
