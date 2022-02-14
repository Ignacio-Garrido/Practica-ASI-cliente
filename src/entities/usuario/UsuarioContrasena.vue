<template>
  <v-container class="text-center">
    <v-form ref="form" @submit.prevent="update">
      <v-card>
        <v-card-text>
          <v-text-field v-model="actual" label="Contraseña actual" :rules="requiredField"></v-text-field>
          <v-text-field v-model="nueva" label="Contraseña nueva" :rules="requiredField"></v-text-field>
        </v-card-text>
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
import UsuarioRepository from "@/repositories/UsuarioRepository";
import store from "@/common/store";

export default {
  data() {
    return {
      correo: store.state.user.correo,
      nueva: "",
      actual: "",
      requiredField: [(v) => !!v || "Field is required"],
    };
  },
  methods: {
    async update() {
      if (!this.$refs.form.validate()) {
        return;
      }
      try {
        var user = {};
        user.correo = this.correo;
        user.contrasena = this.actual;
        user.nuevaContrasena = this.nueva;
        await UsuarioRepository.updateContrasena(this.$route.params.id, user);
        this.$router.replace({
          name: "UsuarioDetail",
          params: { id: this.$route.params.id },
        });
      } catch (err) {
        this.$notify({
          text: err.response.data.message,
          type: "error",
        });
      }
    },
    actualizarContraseña(id, user) {
      try {
        UsuarioRepository.updateContrasena(id, user);
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
