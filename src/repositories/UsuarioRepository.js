import HTTP from "@/common/http";

const resource = "usuarios";

export default {
  async findAll(query, cat) {
    let url = resource;
    if (query && cat) {
      url += `?query=${query}&cat=${cat}`;
    } else if (query) {
      url += `?query=${query}`;
    } else if (cat) {
      url += `?cat=${cat}`;
    }
    const response = await HTTP.get(url);
    return response.data;
  },

  async findOne(id) {
    return (await HTTP.get(`${resource}/${id}`)).data;
  },

  async findByCorreo(correo) {
    return (await HTTP.get(`${resource}/${correo}/correo`)).data;
  },

  async delete(id) {
    await HTTP.delete(`${resource}/${id}`);
  },

  async saveImagen(id, file) {
    const formData = new FormData();
    formData.append("file", file);
    return (
      await HTTP.post(`${resource}/${id}/imagen`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  },

  async editar(usuario) {
    return (await HTTP.put(`${resource}/${usuario.id}`, usuario)).data;
  },

  async updateContrasena(id, user) {
    await HTTP.put(`${resource}/${id}/cambiar_contrasena`, user);
  },

  async getHistCandidato(id) {
    return (await HTTP.get(`${resource}/${id}/historial_candidato`)).data;
  },

  async getHistVotante(id) {
    return (await HTTP.get(`${resource}/${id}/historial_votante`)).data;
  },
};
