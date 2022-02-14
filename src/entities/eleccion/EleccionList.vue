<template>
  <v-container v-if="pagina">
    <v-row>
      <v-col cols="12" class="text-center">
        <div class="right-buttons-bar">
          <v-btn v-if="isAdmin" :to="{ name: 'EleccionCreate' }" color="primary">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
        <h1>
          <b>{{ titulo }}</b>
        </h1>
      </v-col>
      <v-col cols="12" sm="6" lg="3" v-for="eleccion in elecciones" :key="eleccion.id">
        <EleccionCard :eleccion="eleccion"></EleccionCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EleccionCard from "./EleccionCard.vue";
import EleccionRepository from "@/repositories/EleccionRepository";
import store from "@/common/store";

export default {
  data() {
    return {
      elecciones: [],
      titulo: null,
      usuario: store.state.user,
    };
  },
  components: { EleccionCard },
  computed: {
    isAdmin() {
      return this.usuario.categoria == "Admin";
    },
    pagina() {
      if (this.$route.path == "/elecciones/proximas") {
        this.getProximas();
      } else if (this.$route.path == "/elecciones/activas") {
        this.getActivas();
      } else {
        this.getFinalizadas();
      }
      return true;
    },
  },
  methods: {
    async getProximas() {
      this.titulo = "Próximas elecciones";
      this.elecciones = await EleccionRepository.findProximas();
    },
    async getActivas() {
      this.titulo = "Elecciones activas";
      this.elecciones = await EleccionRepository.findActivas();
    },
    async getFinalizadas() {
      this.titulo = "Elecciones finalizadas";
      this.elecciones = await EleccionRepository.findFinalizadas();
    },
  },
};
</script>
