<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center">
        <div class="left-buttons-bar">
          <v-text-field v-model="query" label="Búsqueda de usuarios" @input="fetchData()"></v-text-field>
        </div>
        <div class="left-middle-buttons-bar">
          <v-select v-model="cat" :items="categorias" item-text="Categoria" label="Categoria" @change="fetchData()"></v-select>
        </div>
        <div class="right-buttons-bar">
          <v-btn title="Exportar" @click="exportar()" color="primary">
            <v-icon>upload</v-icon>
          </v-btn>
          <input type="file" ref="hiddenUploader" class="d-none" @change="subido()" />
          <v-btn title="Importar" @click="importar()" color="primary">
            <v-icon>download</v-icon>
          </v-btn>
          <v-btn title="Crear" :to="{ name: 'UsuarioCreate' }" color="primary">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
        <v-spacer />
        <h1>Usuarios registrados</h1>
      </v-col>
      <v-col cols="12" sm="6" lg="3" v-for="usuario in usuarios" :key="usuario.correo">
        <UsuarioCard :usuario="usuario" @usuario-updated="fetchData()"></UsuarioCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UsuarioRepository from "@/repositories/UsuarioRepository.js";
import AccountRepository from "@/repositories/AccountRepository.js";
import TitulacionRepository from "@/repositories/TitulacionRepository.js";
import UsuarioCard from "./UsuarioCard.vue";
import Vue from "vue";
import VuePapaParse from "vue-papa-parse";
Vue.use(VuePapaParse);

export default {
  name: "UsuarioList",
  data() {
    return {
      usuarios: [],
      query: null,
      cat: "Todos",
      categorias: ["Todos", "Profesorado", "Alumnado", "Admin"],
    };
  },
  components: { UsuarioCard },
  async mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      if (this.cat == "Todos") {
        this.usuarios = await UsuarioRepository.findAll(this.query, "");
      } else {
        this.usuarios = await UsuarioRepository.findAll(this.query, this.cat);
      }
    },
    exportar() {
      let csv = "data:text/csv;charset=utf-8,";
      csv =
        csv +
        this.usuarios
          .map(function (usuario) {
            var json = "";
            for (var clave of Object.keys(usuario)) {
              if (clave != "id" && clave != "imagen") {
                if (clave != "titulaciones") {
                  json = json + JSON.stringify(usuario[clave]);
                  json = json + ";";
                } else {
                  var titulaciones = [];
                  for (var t of usuario[clave]) {
                    titulaciones.push(t.nombre);
                  }
                  json = json + JSON.stringify(titulaciones) + "]";
                }
              }
            }
            return json;
          })
          .join("\n")
          .replace(/(^\[)|(\]$)/gm, "");

      var encodedUri = encodeURI(csv);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "usuarios.csv");
      document.body.appendChild(link);
      link.click();
    },
    importar() {
      this.$refs.hiddenUploader.click();
    },
    async procesarUsuarios(usuarios) {
      for (var u of usuarios.data) {
        var usuario = {};
        usuario.correo = u[0];
        usuario.nombre = u[1];
        usuario.apellido1 = u[2];
        usuario.apellido2 = u[3];
        usuario.categoria = u[4];
        usuario.contrasena = usuario.correo.split("@")[0];
        usuario.titulaciones = [];
        if (u[4] != "Admin") {
          u[5] = u[5].replace("[", "").replace("]", "");
          var titulaciones = u[5].split(",");
          if (titulaciones != "") {
            for (var t of titulaciones) {
              try {
                var aux = await this.getTitulacion(t.replace('"', "").replace('"', ""));
                usuario.titulaciones.push(aux);
              } catch (err) {
                this.$notify({
                  text: err.response.data.message,
                  type: "error",
                });
              }
            }
          }
        }
        try {
          usuario = await this.crearUsuario(usuario);
          this.fetchData();
        } catch (err) {
          this.$notify({
            text: err.response.data.message,
            type: "error",
          });
        }
      }
    },
    subido() {
      if (this.$refs.hiddenUploader.files[0]) {
        var file = this.$refs.hiddenUploader.files[0];
        this.$papa.parse(file, {
          header: false,
          complete: this.procesarUsuarios,
        });
      }
    },
    async crearUsuario(usuario) {
      var editar = await this.usuarioExistente(usuario.correo);
      try {
        if (editar != "") {
          usuario.id = editar.id;
          return await UsuarioRepository.editar(usuario);
        } else {
          return await AccountRepository.createAccount(usuario);
        }
      } catch (err) {
        this.$notify({
          text: err.response.data.message,
          type: "error",
        });
      }
    },
    async getTitulacion(t) {
      try {
        return await TitulacionRepository.findByNombre(t);
      } catch (err) {
        this.$notify({
          text: err.response.data.message,
          type: "error",
        });
      }
    },
    async usuarioExistente(correo) {
      return await UsuarioRepository.findByCorreo(correo);
    },
  },
};
</script>
