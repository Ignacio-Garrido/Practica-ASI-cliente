<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-form @submit.prevent="userLogin">
        <v-card>
          <v-card-text>
            <v-text-field label="Correo" name="correo" prepend-icon="person" type="text" v-model="correo"></v-text-field>

            <v-text-field v-model="contrasena" label="Contrasena" name="contrasena" prepend-icon="lock" type="contrasena"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="submit" color="primary">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import auth from "../common/auth";

export default {
  data() {
    return {
      correo: "",
      contrasena: "",
    };
  },
  methods: {
    userLogin() {
      auth
        .login({
          correo: this.correo,
          contrasena: this.contrasena,
        })
        .then(() => {
          // vamos a la página anterior después de autenticarnos
          this.$router.go(-1);
        })
        .catch((err) => {
          this.$notify({
            text: err.response.data.message,
            type: "error",
          });
        });
    },
  },
};
</script>
