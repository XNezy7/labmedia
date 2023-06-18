"use strict";

class Api {
  constructor(token) {
    this.token = token;
  }

  async fetchUsers() {
    const url = "https://5ebbb8e5f2cfeb001697d05c.mockapi.io/users";
    const headers = {
      Authorization: `Bearer ${this.token}`,
    };

    try {
      const response = await fetch(url, { headers });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      throw error;
    }
  }
}

module.exports = Api;
