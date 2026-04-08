import prisma from "../../lib/prisma";

export default defineEventHandler(async (event) => {
  // 1. Obtener el ID de los parámetros de la ruta
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID de sector no proporcionado",
    });
  }

  // 2. Consultar la base de datos
  const sector = await prisma.sectors.findUnique({
    where: {
      id: Number(id),
    },
    // Opcional: Podrías incluir los últimos movimientos de stock si quisieras
    // include: { stocks: { take: 5, orderBy: { date_stock: 'desc' } } }
  });

  // 3. Validar si existe
  if (!sector) {
    throw createError({
      statusCode: 404,
      statusMessage: "Sector no encontrado",
    });
  }

  return sector;
});
