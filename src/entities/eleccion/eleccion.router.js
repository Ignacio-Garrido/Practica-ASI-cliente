import EleccionList from "./EleccionList";
import EleccionForm from "./EleccionForm";
import EleccionDetail from "./EleccionDetail";
import CandidaturaForm from "@/entities/candidatura/CandidaturaForm.vue";
import CandidaturaList from "@/entities/candidatura/CandidaturaList.vue";

const routes = [
  {
    name: "ProximasEleccionList",
    path: "/elecciones/proximas",
    component: EleccionList,
    meta: { public: true },
  },
  {
    name: "ActivasEleccionList",
    path: "/elecciones/activas",
    component: EleccionList,
    meta: { public: true },
  },
  {
    name: "FinalizadasEleccionList",
    path: "/elecciones/finalizadas",
    component: EleccionList,
    meta: { public: true },
  },
  {
    name: "EleccionCreate",
    path: "/elecciones/new",
    component: EleccionForm,
  },
  {
    name: "EleccionDetail",
    path: "/elecciones/:id",
    component: EleccionDetail,
    meta: { public: true },
  },
  {
    name: "EleccionUpdate",
    path: "/elecciones/:id/update",
    component: EleccionForm,
  },
  {
    name: "EleccionVotar",
    path: "/elecciones/:id/votar",
    component: CandidaturaList,
  },
  {
    name: "EleccionPresentarse",
    path: "/elecciones/:idElec/candidatura/:idCand",
    component: CandidaturaForm,
  },
];

export default routes;
