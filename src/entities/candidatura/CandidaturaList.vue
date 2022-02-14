<template>
  <v-container>
    <v-form ref="form" @submit.prevent="votar">
      <v-row>
        <v-col cols="12" v-if="loading" class="loading">Loading...</v-col>
        <v-col cols="8" offset="2" v-if="eleccion">
          <v-card>
            <v-card-title>
              <span>{{ eleccion.nombre }}</span>
            </v-card-title>
            <v-card-subtitle>
              <span>Centro: {{ eleccion.centro }}</span>
              <v-spacer />
              <span>Fecha límite votación: {{ fechaVotacion }}</span>
            </v-card-subtitle>
            <v-spacer></v-spacer>
            <v-card-title>
              <span> Candidatos: </span>
            </v-card-title>
            <v-col cols="1" lg="12" v-for="candidatura in candidaturasEle" :key="candidatura.id">
              <input type="radio" :id="candidatura.id" :value="candidatura.id" v-model="idVotado" />
              <label :for="candidatura.id"> {{ candidatura.candidato.nombre }} {{ candidatura.candidato.apellido1 }} {{ candidatura.candidato.apellido2 }} </label>
              <v-spacer />
            </v-col>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" type="submit" v-if="plazoVotar && permisoVotar && enTitulacion"> Votar </v-btn>
              <v-btn @click="back()"> Atrás </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import EleccionRepository from "@/repositories/EleccionRepository";
import CandidaturaRepository from "@/repositories/CandidaturaRepository";
import UsuarioRepository from "@/repositories/UsuarioRepository";
import store from "@/common/store";

export default {
  data() {
    return {
      loading: false,
      fechaVotacion: {},
      eleccion: {},
      candidaturas: [],
      candidaturasEle: [],
      usuario: store.state.user,
      user: null,
      enTitulacion: false,
      idVotado: false,
    };
  },
  async mounted() {
    this.loading = true;
    this.candidaturas = await CandidaturaRepository.findAll();
    try {
      this.eleccion = await EleccionRepository.findOne(this.$route.params.id);
      this.proximas = await EleccionRepository.findProximas();
      this.fechaPresentacion = this.eleccion.fechaLimitePresentacion.split("-").reverse().join("/");
      this.fechaVotacion = this.eleccion.fechaLimiteVotacion.split("-").reverse().join("/");
    } catch (e) {
      this.$notify({
        text: e.response.data.message,
        type: "error",
      });
      setTimeout(() => this.back(), 2000);
    } finally {
      this.loading = false;
      for (var x of this.candidaturas) {
        if (x.eleccion.id == this.eleccion.id) {
          this.candidaturasEle = this.candidaturasEle.concat(x);
        }
      }
    }
    if (this.usuario.logged) {
      this.user = await UsuarioRepository.findOne(store.state.user.id);
      this.enTitulacion = this.comprobarTitulacion(this.user);
    }
  },
  computed: {
    plazoVotar() {
      var fechaActual = new Date();
      var fechaPresentar = new Date(Date.parse(this.eleccion.fechaLimitePresentacion));
      var fechaVotar = new Date(Date.parse(this.eleccion.fechaLimiteVotacion));
      if (fechaVotar >= fechaActual && fechaPresentar < fechaActual) {
        return true;
      }
      return false;
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
    isProxima() {
      for (var x of this.proximas) {
        if (x.nombre == this.eleccion.nombre) {
          return true;
        }
      }
      return false;
    },
    selected: {
      get() {
        return this.d_selected;
      },
      set(v) {
        if (v === this.idVotado) {
          this.idVotado = false;
        } else {
          this.idVotado = v;
        }
      },
    },
  },
  methods: {
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
    async votar() {
      if (!this.idVotado) {
        alert("No has elegido a quién votar");
      } else {
        try {
          await CandidaturaRepository.votar(this.idVotado, this.user);
        } catch (err) {
          this.$notify({
            text: err.response.data.message,
            type: "error",
          });
        }
        this.$router.replace({
          name: "ActivasEleccionList",
        });
      }
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
