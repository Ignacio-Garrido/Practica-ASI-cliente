<template>
  <v-container class="text-center">
    <v-form ref="form" @submit.prevent="save">
      <v-card>
        <v-card-title v-if="crear">
          <v-col cols="6">
            <v-text-field maxlength="50" v-model="eleccion.nombre" label="Nombre"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field maxlength="50" v-model="eleccion.centro" label="Centro"></v-text-field>
          </v-col>
        </v-card-title>
        <v-card-title v-if="!crear">
          <v-col cols="12">
            <h1>
              <b>{{ eleccion.nombre }}</b>
            </h1>
          </v-col>
        </v-card-title>
        <v-card-subtitle v-if="!crear">
          <v-col cols="12">
            <h1>
              <b><u>Centro:</u></b> {{ eleccion.centro }}
            </h1>
          </v-col>
        </v-card-subtitle>
        <v-card-text v-if="crear">
          <v-col cols="12">
            <v-row>
              <v-col cols="3">
                <v-select v-model="eleccion.grupoCandidatos" :items="grupos" item-text="Grupos" label="Grupo candidatos"></v-select>
              </v-col>
              <v-col cols="1"></v-col>
              <v-col cols="3">
                <v-select v-model="eleccion.grupoVotantes" :items="grupos" item-text="Grupos" label="Grupo votantes"></v-select>
              </v-col>
              <v-col cols="1"></v-col>
              <v-col cols="4">
                <v-select v-model="eleccion.titulaciones" :items="titulaciones" item-text="nombre" label="Titulaciones" return-object multiple></v-select>
              </v-col>
            </v-row>
          </v-col>
        </v-card-text>
        <v-card-text>
          <v-col cols="12">
            <v-row>
              <v-col cols="2"></v-col>
              <v-col cols="3">
                <h3>Fecha límite presentación</h3>
              </v-col>
              <v-col cols="2"></v-col>
              <v-col cols="3">
                <h3>Fecha límite votación</h3>
              </v-col>
              <v-col cols="2"></v-col>
            </v-row>
            <v-row>
              <v-col cols="2"></v-col>
              <v-col cols="3">
                <v-date-picker v-model="eleccion.fechaLimitePresentacion"></v-date-picker>
              </v-col>
              <v-col cols="2"></v-col>
              <v-col cols="3">
                <v-date-picker v-model="eleccion.fechaLimiteVotacion"></v-date-picker>
              </v-col>
              <v-col cols="2"></v-col>
            </v-row>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" type="submit">Submit</v-btn>
          <v-btn @click="back()">Back</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script>
import EleccionRepository from "@/repositories/EleccionRepository";
import TitulacionRepository from "@/repositories/TitulacionRepository";

export default {
  data() {
    return {
      eleccion: {},
      titulaciones: [],
      grupos: ["Todos", "Profesorado", "Alumnado"],
      requiredField: [(v) => !!v || "Field is required"],
      crear: true,
    };
  },
  async created() {
    this.titulaciones = await TitulacionRepository.findAll();
    if (this.$route.params.id) {
      this.eleccion = await EleccionRepository.findOne(this.$route.params.id);
      this.crear = false;
    }
  },
  methods: {
    async save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      try {
        const savedEleccion = await EleccionRepository.save(this.eleccion);
        this.$router.replace({
          name: "EleccionDetail",
          params: { id: savedEleccion.id },
        });
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
  },
};
</script>
