<template>
  <v-container>
    <v-row>
      <v-col cols="12" v-if="loading" class="loading">Loading...</v-col>
      <v-col cols="12" class="text-center">
        <div class="right-buttons-bar">
          <v-btn :to="{ name: 'UsuarioCreate' }" color="primary">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
        <h1>{{ titulacion.nombre }}</h1>
      </v-col>
      <v-col cols="12" sm="6" lg="3" v-for="usuario in usuarios" :key="usuario.id">
        <UsuarioCard :usuario="usuario"></UsuarioCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UsuarioCard from "@/entities/usuario/UsuarioCard.vue";
import TitulacionRepository from "@/repositories/TitulacionRepository";

export default {
  data() {
    return {
      loading: false,
      usuarios: [],
      usuariosTitu: [],
      titulacion: {},
    };
  },
  components: { UsuarioCard },
  async mounted() {
    this.loading = true;
    try {
      this.usuariosTitu = await TitulacionRepository.findByTitulacionId(this.$route.params.id);
    } catch (e) {
      this.$notify({
        text: e.response.data.message,
        type: "error",
      });
      setTimeout(() => this.back(), 2000);
    } finally {
      this.loading = false;
      this.titulacion = await TitulacionRepository.findOne(this.$route.params.id);
      for (var x of this.usuariosTitu) {
        for (var y of x.titulaciones) {
          if (y.nombre == this.titulacion.nombre) {
            this.usuarios = this.usuarios.concat(x);
            break;
          }
        }
      }
    }
  },
};
</script>
