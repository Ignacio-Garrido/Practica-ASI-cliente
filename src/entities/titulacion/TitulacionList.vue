<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center">
        <div class="right-buttons-bar">
          <v-btn :to="{ name: 'TitulacionCreate' }" color="primary">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
        <h1><b>Titulaciones</b></h1>
      </v-col>
      <v-col cols="12" sm="6" lg="3" v-for="titulacion in titulaciones" :key="titulacion.name">
        <TitulacionCard :titulacion="titulacion" @titulacion-updated="fetchData()"></TitulacionCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TitulacionRepository from "@/repositories/TitulacionRepository.js";
import TitulacionCard from "./TitulacionCard.vue";

export default {
  name: "TitulacionList",
  data() {
    return {
      titulaciones: [],
    };
  },
  components: { TitulacionCard },
  async mounted() {
    this.titulaciones = await TitulacionRepository.findAll();
  },
  methods: {
    async fetchData() {
      this.titulaciones = await TitulacionRepository.findAll();
    },
  },
};
</script>
