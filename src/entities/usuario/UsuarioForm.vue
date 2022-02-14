<template>
  <v-container class="text-center">
    <v-form ref="form" @submit.prevent="submit">
      <v-card>
        <v-card-title>
          <v-text-field v-if="crear" maxlength="50" v-model="usuario.correo" label="Correo" :rules="requiredField && emailRules"></v-text-field>
          <span v-if="!crear">{{ usuario.nombre + " " + usuario.apellido1 + " " + usuario.apellido2 }}</span>
          <v-spacer v-if="!crear" />
          <span v-if="!crear">{{ usuario.correo }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-if="crear" maxlength="50" v-model="usuario.nombre" label="Nombre" :rules="requiredField"></v-text-field>
          <v-text-field v-if="crear" maxlength="50" v-model="usuario.apellido1" label="Primer apellido" :rules="requiredField"></v-text-field>
          <v-text-field v-if="crear" maxlength="50" v-model="usuario.apellido2" label="Segundo apellido" :rules="requiredField"></v-text-field>
          <v-select v-model="usuario.categoria" :items="categorias" item-text="Categoria" label="Categoría" :rules="requiredField"></v-select>
          <v-select v-model="usuario.titulaciones" :items="titulaciones" item-text="nombre" label="Titulaciones" return-object multiple></v-select>
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
import AccountRepository from "@/repositories/AccountRepository";
import UsuarioRepository from "@/repositories/UsuarioRepository";
import TitulacionRepository from "@/repositories/TitulacionRepository";

export default {
  data() {
    return {
      usuario: {},
      titulaciones: [],
      requiredField: [(v) => !!v || "Campo obligatorio"],
      emailRules: [(v) => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "Correo no válido"],
      categorias: ["Alumnado", "Profesorado", "Admin"],
      crear: true,
    };
  },
  async mounted() {
    this.titulaciones = await TitulacionRepository.findAll();
    if (this.$route.params.id) {
      this.usuario = await UsuarioRepository.findOne(this.$route.params.id);
      this.crear = false;
    }
  },
  methods: {
    async submit() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.usuario.contrasena = this.usuario.correo.split("@")[0];
      try {
        if (this.crear) {
          await this.crearUsuario(this.usuario);
        } else {
          await this.editarUsuario(this.usuario);
        }
        this.$router.replace({
          name: "Usuarios",
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
    crearUsuario(usuario) {
      try {
        return AccountRepository.createAccount(usuario);
      } catch (err) {
        this.$notify({
          text: err.response.data.message,
          type: "error",
        });
      }
    },
    editarUsuario(usuario) {
      try {
        return UsuarioRepository.editar(usuario);
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
