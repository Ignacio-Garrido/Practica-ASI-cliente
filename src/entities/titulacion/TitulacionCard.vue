<template>
  <v-card>
    <v-card-title>
      <router-link :to="{ name: 'TitulacionUsuarios', params: { id: titulacion.id } }" v-slot="{ navigate }" custom>
        <span @click="navigate" class="pointer">{{ titulacion.nombre }}</span>
      </router-link>
      <v-spacer />
      <v-btn title="Editar" active-class="hide-active" :to="{ name: 'TitulacionUpdate', params: { id: titulacion.id } }" icon v-if="isAdmin">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn title="Eliminar" @click="remove()" active-class="hide-active" icon color="red">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-card-title>
  </v-card>
</template>

<script>
import TitulacionRepository from "@/repositories/TitulacionRepository";
import store from "@/common/store";

export default {
  name: "TitulacionCard",
  data() {
    return {
      isAdmin: store.state.user.categoria == "Admin",
    };
  },
  props: {
    titulacion: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async remove() {
      try {
        await TitulacionRepository.delete(this.titulacion.id);
        this.$emit("titulacion-updated");
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
