<template>
  <v-container>
    <v-row>
      <v-col cols="12" v-if="loading" class="loading">Loading...</v-col>
      <v-col cols="8" offset="2" v-if="eleccion">
        <v-card>
          <v-card-title>
            <v-col class="text-center" cols="12">
              <h1>
                <b>{{ eleccion.nombre }}</b>
              </h1>
            </v-col>
          </v-card-title>
          <v-card-subtitle>
            <v-col class="text-center" cols="12">
              <h2>
                <b><u>Centro:</u></b> {{ eleccion.centro }}
              </h2>
            </v-col>
            <v-spacer />
            <h3>
              <b><u>Fecha límite presentarse:</u></b> {{ fechaPresentacion }}
            </h3>
            <v-spacer />
            <h3>
              <b><u>Fecha límite votación:</u></b> {{ fechaVotacion }}
            </h3>
            <v-spacer />
            <h3>
              <b><u>Candidatos:</u></b> {{ eleccion.grupoCandidatos }}
            </h3>
            <v-spacer />
            <h3>
              <b><u>Votantes:</u></b> {{ eleccion.grupoVotantes }}
            </h3>
            <v-spacer />
            <h3>
              <b><u>Titulaciones:</u></b> {{ titulaciones }}
            </h3>
          </v-card-subtitle>
          <v-card-subtitle class="text-right">
            <v-btn
              :to="{ name: 'EleccionPresentarse', params: { idElec: eleccion.id, idCand: 'nueva' } }"
              color="primary"
              v-if="plazoCandidatura && permisoCandidatura && enTitulacion && !yaPresentado"
            >
              Presentarse
            </v-btn>
            <v-btn :to="{ name: 'EleccionVotar', params: { id: eleccion.id } }" color="primary" v-if="plazoVotar && permisoVotar && enTitulacion && !yaVotado"> Votar </v-btn>
          </v-card-subtitle>
          <v-spacer></v-spacer>
          <v-col cols="1" lg="12" v-for="candidatura in candidaturasOrd" :key="candidatura.id">
            <CandidaturaCard :candidatura="candidatura"></CandidaturaCard>
          </v-col>
          <v-card-actions>
            <v-spacer />
            <v-btn :to="{ name: 'EleccionUpdate', params: { id: eleccion.id } }" color="primary" v-if="plazoCandidatura && isAdmin"> Editar </v-btn>
            <v-btn color="warning" @click="remove()" v-if="isAdmin">Eliminar</v-btn>
            <v-btn @click="back()"> Atrás </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CandidaturaCard from "@/entities/candidatura/CandidaturaCard.vue";
import EleccionRepository from "@/repositories/EleccionRepository";
import UsuarioRepository from "@/repositories/UsuarioRepository";
import store from "@/common/store";
import _ from "lodash";

export default {
  data() {
    return {
      loading: false,
      fechaPresentacion: {},
      fechaVotacion: {},
      eleccion: {},
      candidaturas: [],
      usuario: store.state.user,
      enTitulacion: false,
      titulaciones: "",
      eleVot: [],
    };
  },
  components: { CandidaturaCard },
  async mounted() {
    this.loading = true;
    try {
      this.eleccion = await EleccionRepository.findOne(this.$route.params.id);
      this.candidaturas = await EleccionRepository.findCandidaturas(this.$route.params.id);
      if (store.state.user.id != "") {
        this.eleVot = await UsuarioRepository.getHistVotante(this.usuario.id);
      }
      this.fechaPresentacion = this.eleccion.fechaLimitePresentacion.split("-").reverse().join("/");
      this.fechaVotacion = this.eleccion.fechaLimiteVotacion.split("-").reverse().join("/");
      var aux = this.eleccion.titulaciones.length;
      for (var i = 0; i < aux; i++) {
        this.titulaciones = this.titulaciones + this.eleccion.titulaciones[i].nombre;
        if (i + 1 != aux) {
          this.titulaciones += ", ";
        }
      }
    } catch (e) {
      this.$notify({
        text: e.response.data.message,
        type: "error",
      });
      setTimeout(() => this.back(), 2000);
    } finally {
      this.loading = false;
    }
    if (this.usuario.logged) {
      var usu = await UsuarioRepository.findOne(store.state.user.id);
      this.enTitulacion = this.comprobarTitulacion(usu);
    }
  },
  computed: {
    candidaturasOrd: function () {
      if (!this.plazoCandidatura && !this.plazoVotar) {
        return _.orderBy(this.candidaturas, "numVotos", "desc");
      } else {
        return this.candidaturas;
      }
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
    isAdmin() {
      return this.usuario.categoria == "Admin";
    },
    yaPresentado() {
      for (var c of this.candidaturas) {
        if (store.state.user.id == c.candidato.id) {
          return true;
        }
      }
      return false;
    },
    yaVotado() {
      for (var e of this.eleVot) {
        if (e.id == this.eleccion.id) {
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    async remove() {
      try {
        await EleccionRepository.delete(this.eleccion.id);
        this.$router.replace({ name: "ProximasEleccionList" });
      } catch (err) {
        this.$notify({
          text: err.response.data.message,
          type: "error",
        });
      }
    },
    back() {
      this.$router.go(-1);
    },
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
};
</script>

<style scoped>
.tags {
  font-style: italic;
}
.eleccion {
  padding: 30px 50px;
  color: rgba(0, 0, 0, 0.87);
  font-size: larger;
}

.error {
  margin-top: 40px;
}
</style>
