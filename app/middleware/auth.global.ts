// app/middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // Usamos 'user_name' porque SÍ es legible por JavaScript/Cliente
  const userName = useCookie("user_name");

  if (!userName.value && to.path !== "/") {
    return navigateTo("/");
  }

  if (userName.value && to.path === "/") {
    return navigateTo("/list");
  }
});
