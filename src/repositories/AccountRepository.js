import HTTP from "@/common/http";

export default {
  async authenticate(credentials) {
    return (await HTTP.post(`iniciar_sesion`, credentials)).data;
  },

  async getAccount() {
    return (await HTTP.get(`cuenta`)).data;
  },

  async createAccount(user) {
    return (await HTTP.post(`crear_usuario`, user)).data;
  },
};
