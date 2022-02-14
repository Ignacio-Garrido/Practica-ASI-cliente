<template>
  <v-container class="text-center">
    <v-form ref="form" @submit.prevent="save">
      <v-card>
        <v-card-title>
          <v-text-field v-model="titulacion.nombre" label="Nombre" :rules="requiredField"></v-text-field>
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" type="submit">Confirmar</v-btn>
          <v-btn @click="back()">Atrás</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script>
import TitulacionRepository from "@/repositories/TitulacionRepository";

export default {
  data() {
    return {
      titulacion: {},
      requiredField: [(v) => !!v || "Field is required"],
    };
  },
  async created() {
    if (this.$route.params.id) {
      this.titulacion = await TitulacionRepository.findOne(this.$route.params.id);
    }
  },
  methods: {
    async save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      try {
        await TitulacionRepository.save(this.titulacion);
        this.$router.replace({
          name: "Titulaciones",
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
