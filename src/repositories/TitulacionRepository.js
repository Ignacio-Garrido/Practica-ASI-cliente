import HTTP from "@/common/http";

const resource = "titulaciones";

export default {
  async findAll() {
    const response = await HTTP.get(resource);
    return response.data;
  },

  async findByTitulacionId(id) {
    const response = await HTTP.get(`${resource}/${id}/usuarios`);
    return response.data;
  },

  async findOne(id) {
    return (await HTTP.get(`${resource}/${id}`)).data;
  },

  async findByNombre(nombre) {
    return (await HTTP.get(`${resource}/${nombre}/nombre`)).data;
  },

  async save(titulacion) {
    if (titulacion.id) {
      return (await HTTP.put(`${resource}/${titulacion.id}`, titulacion)).data;
    } else {
      return (await HTTP.post(`${resource}`, titulacion)).data;
    }
  },

  async delete(id) {
    return await HTTP.delete(`${resource}/${id}`);
  },
};
