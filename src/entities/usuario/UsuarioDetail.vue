<template>
  <v-container>
    <v-row>
      <v-col cols="12" v-if="loading" class="loading">Loading...</v-col>
      <v-col cols="4" class="text-center">
        <v-img :src="imageSrc" width="200" height="200" class="test"></v-img>
        <input type="file" ref="hiddenUploader" class="d-none" @change="nuevaFoto()" />
        <v-btn @click="uploadImage()" v-if="isUser"> Cambiar foto </v-btn>
      </v-col>
      <v-col cols="4" class="center">
        <v-spacer />
        <h1>
          <b>{{ usuario.nombre + " " + usuario.apellido1 + " " + usuario.apellido2 }}</b>
        </h1>
        <h2>{{ usuario.correo }}</h2>
        <h3>{{ usuario.categoria }}</h3>
      </v-col>
      <v-col cols="4"></v-col>
      <v-col cols="6" v-if="!isAdmin">
        <h3><b>Titulaciones activas:</b></h3>
        <ul v-for="titulacion in usuario.titulaciones" :key="titulacion.id">
          <li>{{ titulacion.nombre }}</li>
        </ul>
      </v-col>
      <v-col cols="6" class="text-center">
        <v-btn :to="{ name: 'UsuarioContrasena' }" color="primary" v-if="isUser"> Cambiar contraseña </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center" v-if="!isAdmin && isCandidato">
        <h2><b>Candidaturas activas</b></h2>
      </v-col>
      <v-col cols="12" sm="6" lg="3" v-for="eleccion in elecciones" :key="eleccion.id">
        <EleccionCard :eleccion="eleccion"></EleccionCard>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-center">
        <v-btn :to="{ name: 'UsuarioElecCandidato' }" color="primary" v-if="isUser"> Historial candidato </v-btn>
        <v-btn :to="{ name: 'UsuarioElecVotante' }" color="primary" v-if="isUser"> Historial votante </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EleccionCard from "@/entities/eleccion/EleccionCard.vue";
import UsuarioRepository from "@/repositories/UsuarioRepository";
import store from "@/common/store";
import _ from "lodash";

export default {
  data() {
    return {
      loading: false,
      usuario: {},
      user: store.state.user,
      elecciones: [],
      eleVot: [],
      eleCand: [],
    };
  },
  components: { EleccionCard },
  async mounted() {
    this.loading = true;
    try {
      this.usuario = await UsuarioRepository.findOne(this.$route.params.id);
      this.elecciones = await UsuarioRepository.getHistCandidato(this.usuario.id);
      var fechaActual = new Date();
      this.elecciones = _.remove(this.elecciones, function (x) {
        return new Date(Date.parse(x.fechaLimiteVotacion)) >= fechaActual;
      });
    } catch (e) {
      this.$notify({
        text: e.response.data.message,
        type: "error",
      });
      setTimeout(() => this.back(), 2000);
    } finally {
      this.loading = false;
    }
  },
  computed: {
    imageSrc() {
      if (this.usuario.imagen) {
        var rand = Date.now();
        return `http://localhost:8080/api/usuarios/${this.usuario.id}/imagen` + "?rand=" + rand;
      }
      return "/foto-perfil.png";
    },
    isAdmin() {
      return this.usuario.categoria == "Admin";
    },
    isUser() {
      if (!this.isAdmin) {
        return this.user.correo == this.usuario.correo;
      }
      return false;
    },
    isCandidato() {
      return this.elecciones.length != 0;
    },
  },
  methods: {
    uploadImage() {
      this.$refs.hiddenUploader.click();
    },
    async nuevaFoto() {
      if (this.$refs.hiddenUploader.files[0]) {
        try {
          await this.subirFoto();
          this.usuario = await this.actualizarUsuario();
        } catch (err) {
          this.$notify({
            text: err.response.data.message,
            type: "error",
          });
        }
      }
    },
    subirFoto() {
      try {
        return UsuarioRepository.saveImagen(this.usuario.id, this.$refs.hiddenUploader.files[0]);
      } catch (err) {
        this.$notify({
          text: err.response.data.message,
          type: "error",
        });
      }
    },
    actualizarUsuario() {
      try {
        return UsuarioRepository.findOne(this.$route.params.id);
      } catch (err) {
        this.$notify({
          text: err.response.data.message,
          type: "error",
        });
      }
    },
  },
};
</script>

<style scoped>
.test {
  margin: auto;
}

.center {
  margin: auto;
  text-align: center;
}
</style>
