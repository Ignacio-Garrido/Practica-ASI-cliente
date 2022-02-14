import Vue from "vue";
import VueRouter from "vue-router";
import auth from "@/common/auth";
import store from "@/common/store";
import { NotFound, Login, Home } from "@/components";
import eleccionRouter from "@/entities/eleccion/eleccion.router.js";
import titulacionRouter from "@/entities/titulacion/titulacion.router.js";
import usuarioRouter from "@/entities/usuario/usuario.router.js";

const user = store.state.user;

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { public: true, isLoginPage: true },
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { public: true },
  },
  { path: "*", component: NotFound, meta: { public: true } },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routes.concat(eleccionRouter, titulacionRouter, usuarioRouter),
});

router.beforeEach((to, from, next) => {
  // Lo primero que hacemos antes de cargar ninguna ruta es comprobar si
  // el usuario está autenticado (revisando el token)
  auth.isAuthenticationChecked.finally(() => {
    // por defecto, el usuario debe estar autenticado para acceder a las rutas
    const requiresAuth = !to.meta.public;

    const requiredAuthority = to.meta.authority;
    const userIsLogged = user.logged;
    const loggedUserAuthority = user.authority;

    if (requiresAuth) {
      // página privada
      if (userIsLogged) {
        if (requiredAuthority && requiredAuthority != loggedUserAuthority) {
          // usuario logueado pero sin permisos suficientes, le redirigimos a la página de login
          Vue.notify({
            text: "Access is not allowed for the current user. Try to log again.",
            type: "error",
          });
          auth.logout();
          next("/login");
        } else {
          // usuario logueado y con permisos adecuados
          next();
        }
      } else {
        // usuario no está logueado, no puede acceder a la página
        Vue.notify({
          text: "This page requires authentication.",
          type: "error",
        });
        next("/login");
      }
    } else {
      // página pública
      if (userIsLogged && to.meta.isLoginPage) {
        // si estamos logueados no hace falta volver a mostrar el login
        next({ name: "Home", replace: true });
      } else {
        next();
      }
    }
  });
});

export default router;
