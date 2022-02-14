<template>
  <v-card>
    <v-card-title>
      <router-link :to="{ name: 'UsuarioDetail', params: { id: usuario.id } }" v-slot="{ navigate }" custom>
        <span @click="navigate" class="pointer">{{ usuario.correo }}</span>
      </router-link>
      <v-spacer />
      <v-btn title="Editar" active-class="hide-active" :to="{ name: 'UsuarioEdit', params: { id: usuario.id } }" icon v-if="!self">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn title="Eliminar" @click="remove()" active-class="hide-active" icon color="red" v-if="!self">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-subtitle>
      <span>({{ usuario.categoria }})</span>
    </v-card-subtitle>
  </v-card>
</template>

<script>
import UsuarioRepository from "@/repositories/UsuarioRepository";
import store from "@/common/store";

export default {
  name: "UsuarioCard",
  props: {
    usuario: {
      type: Object,
      required: true,
    },
  },
  computed: {
    self() {
      return this.usuario.correo == store.state.user.correo;
    },
  },
  methods: {
    async remove() {
      try {
        await UsuarioRepository.delete(this.usuario.id);
        this.$emit("usuario-updated");
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
