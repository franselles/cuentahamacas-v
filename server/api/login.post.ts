// server/api/auth/login.post.ts

import prisma from "../lib/prisma";

export default defineEventHandler(async (event) => {
  const { code } = await readBody(event);

  // Usando el utility de Nitro (asumiendo que tienes usePrisma() en server/utils)

  const user = await prisma.users.findFirst({
    where: {
      code: String(code), // Forzamos string por seguridad
      active: true,
    },
  });

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Código de operario no válido",
    });
  }

  // Cookie para que el FRONTEND muestre el nombre (NO httpOnly para poder leerla con useCookie)
  setCookie(event, "user_name", user.name || "Operario", {
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
  });

  // Cookie de SEGURIDAD para el Middleware (httpOnly: true para que JS no la toque)
  setCookie(event, "auth_session", "true", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production", // Solo true en producción (HTTPS)
  });

  return { success: true };
});
