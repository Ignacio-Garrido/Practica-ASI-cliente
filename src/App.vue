<template>
  <v-app>
    <!-- Notificaciones usando vue-notification -->
    <notifications :max="3" :width="400" position="top center" />

    <v-app-bar app color="primary" dark>
      <v-toolbar-title>
        <router-link to="/" v-slot="{ navigate }" custom>
          <span @click="navigate" class="pointer">Inicio aplicación</span>
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn to="/elecciones/activas" exact text>Elecciones activas</v-btn>
        <v-btn to="/elecciones/proximas" exact text>Próximas elecciones</v-btn>
        <v-btn to="/elecciones/finalizadas" exact text>Elecciones finalizadas</v-btn>
        <v-btn to="/usuarios" v-if="isAdmin" exact text>usuarios</v-btn>
        <v-btn to="/titulaciones" v-if="isAdmin" exact text>titulaciones</v-btn>
        <v-btn active-class="hide-active" icon :to="{ name: 'UsuarioDetail', params: { id: usuario.id } }" v-if="isLogged && !isAdmin">
          <v-icon>mdi-account</v-icon>
        </v-btn>
        <v-btn active-class="hide-active" icon to="/login" v-if="!isLogged">
          <v-icon>mdi-login</v-icon>
        </v-btn>
        <v-btn icon @click="logout()" v-if="isLogged">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import store from "@/common/store";
import auth from "@/common/auth";

export default {
  name: "App",
  data() {
    return {
      usuario: store.state.user,
      tags: ["Elecciones activas", "Próximas elecciones", "Elecciones finalizadas"],
    };
  },
  computed: {
    isLogged() {
      return this.usuario.logged;
    },
    isAdmin() {
      return this.usuario.categoria == "Admin";
    },
  },
  methods: {
    logout() {
      auth.logout();
      // Después de hacer logout nos vamos a home
      if (this.$router.currentRoute.name != "Home") {
        this.$router.push({ name: "Home" });
      }
    },
  },
};
</script>

<style lang="scss" src="./App.scss"></style>
