import HTTP from "@/common/http";

const resource = "candidaturas";

// función para hacer las llamadas lentas a propósito
//function sleep(ms) {
//  return new Promise((resolve) => setTimeout(resolve, ms));
//}

export default {
  async findAll() {
    const response = await HTTP.get(resource);
    return response.data;
  },

  async findOne(id) {
    return (await HTTP.get(`${resource}/${id}`)).data;
  },

  async save(candidatura) {
    if (candidatura.id) {
      return (await HTTP.put(`${resource}/${candidatura.id}`, candidatura)).data;
    } else {
      return (await HTTP.post(`${resource}`, candidatura)).data;
    }
  },

  async delete(id) {
    return await HTTP.delete(`${resource}/${id}`);
  },

  async votar(id, usuario) {
    return await HTTP.put(`${resource}/${id}/votar`, usuario);
  },
};
