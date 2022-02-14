<template>
  <v-container class="text-center">
    <v-form ref="form" @submit.prevent="save">
      <v-card>
        <v-card-title>
          <v-text-field v-model="candidatura.motivo" label="Motivos candidatura" :rules="requiredField"></v-text-field>
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" type="submit">Confirmar</v-btn>
          <v-btn @click="back()">Back</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script>
import CandidaturaRepository from "@/repositories/CandidaturaRepository";
import EleccionRepository from "@/repositories/EleccionRepository";
import store from "@/common/store";

export default {
  data() {
    return {
      candidatura: {},
      candidato: store.state.user,
      requiredField: [(v) => !!v || "Field is required"],
    };
  },
  async created() {
    if (this.$route.params.idCand != "nueva") {
      this.candidatura = await CandidaturaRepository.findOne(this.$route.params.idCand);
    }
  },
  methods: {
    async save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      try {
        this.candidatura.candidato = this.candidato;
        this.candidatura.eleccion = await EleccionRepository.findOne(this.$route.params.idElec);
        await CandidaturaRepository.save(this.candidatura);
        this.$router.replace({
          name: "EleccionDetail",
          params: { id: this.$route.params.idElec },
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
