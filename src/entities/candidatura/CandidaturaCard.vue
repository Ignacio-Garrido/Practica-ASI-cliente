<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <router-link :to="{ name: 'UsuarioDetail', params: { id: candidatura.candidato.id } }" v-slot="{ navigate }" custom>
          <span @click="navigate" class="pointer"
            ><b>{{ nombre }}</b></span
          >
        </router-link>
        <v-spacer />
        <span v-if="(isAdmin && isActiva) || isFinalizada"> {{ candidatura.numVotos }} votos </span>
        <v-btn :to="{ name: 'EleccionPresentarse', params: { idElec: candidatura.eleccion.id, idCand: candidatura.id } }" color="warning" v-if="isCandidato && isProxima"
          >Editar</v-btn
        >
        <v-spacer />
        <v-btn color="error" @click="remove()" v-if="isCandidato && isProxima">Cancelar</v-btn>
        <v-spacer />
      </v-expansion-panel-header>
      <v-expansion-panel-content> {{ this.candidatura.motivo }} </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import store from "@/common/store";
import CandidaturaRepository from "@/repositories/CandidaturaRepository";
import EleccionRepository from "@/repositories/EleccionRepository";

export default {
  name: "CandidaturaCard",
  props: {
    candidatura: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      nombre: this.candidatura.candidato.nombre + " " + this.candidatura.candidato.apellido1 + " " + this.candidatura.candidato.apellido2,
      usuario: store.state.user,
      proximas: [],
      finalizadas: [],
    };
  },
  async mounted() {
    this.proximas = await EleccionRepository.findProximas();
    this.finalizadas = await EleccionRepository.findFinalizadas();
  },
  computed: {
    isAdmin() {
      return this.usuario.categoria == "Admin";
    },
    isCandidato() {
      return this.usuario.id == this.candidatura.candidato.id;
    },
    isProxima() {
      for (var x of this.proximas) {
        if (x.id == this.$route.params.id) {
          return true;
        }
      }
      return false;
    },
    isFinalizada() {
      for (var x of this.finalizadas) {
        if (x.id == this.$route.params.id) {
          return true;
        }
      }
      return false;
    },
    isActiva() {
      if (!this.isFinalizada && !this.isProxima) {
        return true;
      }
      return false;
    },
  },
  methods: {
    async remove() {
      await CandidaturaRepository.delete(this.candidatura.id);
      this.$router.replace({ name: "ProximasEleccionList" });
    },
  },
};
</script>
