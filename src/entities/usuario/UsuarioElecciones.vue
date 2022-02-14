<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center">
        <h1>Tú historial de {{ pagina }}:</h1>
      </v-col>
      <v-col cols="12" sm="6" lg="3" v-for="eleccion in elecciones" :key="eleccion.id">
        <EleccionCard :eleccion="eleccion"></EleccionCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EleccionCard from "@/entities/eleccion/EleccionCard.vue";
import UsuarioRepository from "@/repositories/UsuarioRepository";

export default {
  data() {
    return {
      elecciones: [],
      candidaturas: [],
      usuario: [],
      pagina: "",
    };
  },
  components: { EleccionCard },
  async mounted() {
    this.usuario = await UsuarioRepository.findOne(this.$route.params.id);
    if (this.$route.name == "UsuarioElecCandidato") {
      this.pagina = "candidaturas";
      this.elecciones = await UsuarioRepository.getHistCandidato(this.$route.params.id);
    } else {
      this.pagina = "votaciones";
      this.elecciones = await UsuarioRepository.getHistVotante(this.$route.params.id);
    }
  },
};
</script>
