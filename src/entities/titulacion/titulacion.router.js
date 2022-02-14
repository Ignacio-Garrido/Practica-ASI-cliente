import TitulacionList from "./TitulacionList";
import TitulacionForm from "./TitulacionForm";
import TitulacionUsuarios from "./TitulacionUsuarios";

const routes = [
  {
    path: "/titulaciones",
    name: "Titulaciones",
    component: TitulacionList,
    meta: { public: true },
  },
  {
    name: "TitulacionCreate",
    path: "/titulaciones/new",
    component: TitulacionForm,
  },
  {
    name: "TitulacionUpdate",
    path: "/titulaciones/:id/update",
    component: TitulacionForm,
  },
  {
    path: "/titulaciones/:id",
    name: "TitulacionUsuarios",
    component: TitulacionUsuarios,
    meta: { public: true },
  },
];

export default routes;
