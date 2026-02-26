import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    /*
     * Ejecuta el middleware en todas las rutas excepto:
     * - _next (assets)
     * - archivos estáticos
     */
    "/((?!_next|.*\\..*).*)",
  ],
};
