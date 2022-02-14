<template>
  <v-card>
    <v-card-title>
      <router-link :to="{ name: 'EleccionDetail', params: { id: eleccion.id } }" v-slot="{ navigate }" custom>
        <span @click="navigate" class="pointer"
          ><b>{{ eleccion.nombre }}</b></span
        >
      </router-link>
      <v-spacer />
    </v-card-title>
    <v-card-subtitle>
      <span>Centro: {{ eleccion.centro }}</span>
      <v-spacer></v-spacer>
      <span>Fecha límite presentación: {{ fechaPresentacion }}</span>
      <v-spacer></v-spacer>
      <span>Fecha límite votación: {{ fechaVotacion }}</span>
    </v-card-subtitle>
    <v-card-subtitle class="text-center">
      <v-btn
        :to="{ name: 'EleccionPresentarse', params: { idElec: eleccion.id, idCand: 'nueva' } }"
        color="primary"
        v-if="plazoCandidatura && permisoCandidatura && enTitulacion && !yaPresentado"
        >Presentarse</v-btn
      >
      <v-btn :to="{ name: 'EleccionVotar', params: { id: eleccion.id } }" color="primary" v-if="plazoVotar && permisoVotar && enTitulacion && !yaVotado"> Votar </v-btn>
    </v-card-subtitle>
  </v-card>
</template>

<script>
import UsuarioRepository from "@/repositories/UsuarioRepository";
import store from "@/common/store";

export default {
  name: "EleccionCard",
  props: {
    eleccion: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      fechaVotacion: null,
      fechaPresentacion: null,
      usuario: store.state.user,
      enTitulacion: false,
      eleVot: {},
      eleCand: {},
    };
  },
  computed: {
    yaVotado() {
      for (var e of this.eleVot) {
        if (e.id == this.eleccion.id) {
          return true;
        }
      }
      return false;
    },
    plazoCandidatura() {
      var fechaActual = new Date();
      var fechaPresentar = new Date(Date.parse(this.eleccion.fechaLimitePresentacion));
      if (fechaPresentar >= fechaActual) {
        return true;
      }
      return false;
    },
    plazoVotar() {
      var fechaActual = new Date();
      var fechaPresentar = new Date(Date.parse(this.eleccion.fechaLimitePresentacion));
      var fechaVotar = new Date(Date.parse(this.eleccion.fechaLimiteVotacion));
      if (fechaVotar >= fechaActual && fechaPresentar < fechaActual) {
        return true;
      }
      return false;
    },
    permisoCandidatura() {
      if (this.usuario.categoria == "Admin") {
        return false;
      }
      if (this.eleccion.grupoCandidatos == "Todos") {
        return true;
      }
      return this.eleccion.grupoCandidatos == this.usuario.categoria;
    },
    permisoVotar() {
      if (this.usuario.categoria == "Admin") {
        return false;
      }
      if (this.eleccion.grupoVotantes == "Todos") {
        return true;
      }
      return this.eleccion.grupoVotantes == this.usuario.categoria;
    },
    yaPresentado() {
      for (var e of this.eleCand) {
        if (e.id == this.eleccion.id) {
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    comprobarTitulacion(usu) {
      for (var x of usu.titulaciones) {
        for (var y of this.eleccion.titulaciones) {
          if (x.id == y.id) {
            return true;
          }
        }
      }
      return false;
    },
  },
  async mounted() {
    this.fechaVotacion = this.eleccion.fechaLimiteVotacion.split("-").reverse().join("/");
    this.fechaPresentacion = this.eleccion.fechaLimitePresentacion.split("-").reverse().join("/");
    if (store.state.user.id != "") {
      this.eleVot = await UsuarioRepository.getHistVotante(this.usuario.id);
      this.eleCand = await UsuarioRepository.getHistCandidato(this.usuario.id);
    }
    if (this.usuario.logged) {
      var usu = await UsuarioRepository.findOne(store.state.user.id);
      this.enTitulacion = this.comprobarTitulacion(usu);
    }
  },
};
</script>
