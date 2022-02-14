import UsuarioList from "./UsuarioList";
import UsuarioForm from "./UsuarioForm";
import UsuarioDetail from "./UsuarioDetail";
import UsuarioElecciones from "./UsuarioElecciones";
import UsuarioContrasena from "./UsuarioContrasena";

const routes = [
  {
    name: "Usuarios",
    path: "/usuarios",
    component: UsuarioList,
    meta: { public: true },
  },
  {
    name: "UsuarioCreate",
    path: "/usuarios/new",
    component: UsuarioForm,
  },
  {
    name: "UsuarioDetail",
    path: "/usuarios/:id",
    component: UsuarioDetail,
    meta: { public: true },
  },
  {
    name: "UsuarioEdit",
    path: "/usuarios/:id/editar",
    component: UsuarioForm,
  },
  {
    name: "UsuarioContrasena",
    path: "/usuarios/:id/updateContrasena",
    component: UsuarioContrasena,
  },
  {
    name: "UsuarioElecCandidato",
    path: "/usuarios/:id/eleccandidato",
    component: UsuarioElecciones,
  },
  {
    name: "UsuarioElecVotante",
    path: "/usuarios/:id/elecvotante",
    component: UsuarioElecciones,
  },
];

export default routes;
