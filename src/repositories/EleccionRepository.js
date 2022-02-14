import HTTP from "@/common/http";

const resource = "elecciones";

export default {
  async findAll() {
    const response = await HTTP.get(resource);
    return response.data;
  },

  async findProximas() {
    const response = await HTTP.get(`${resource}/proximas`);
    return response.data;
  },

  async findActivas() {
    const response = await HTTP.get(`${resource}/activas`);
    return response.data;
  },

  async findFinalizadas() {
    const response = await HTTP.get(`${resource}/finalizadas`);
    return response.data;
  },

  async findOne(id) {
    return (await HTTP.get(`${resource}/${id}`)).data;
  },

  async findCandidaturas(id) {
    return (await HTTP.get(`${resource}/${id}/candidaturas`)).data;
  },

  async save(eleccion) {
    if (eleccion.id) {
      return (await HTTP.put(`${resource}/${eleccion.id}`, eleccion)).data;
    } else {
      return (await HTTP.post(`${resource}`, eleccion)).data;
    }
  },

  async delete(id) {
    return await HTTP.delete(`${resource}/${id}`);
  },
};
