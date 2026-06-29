window.AppState = {
  users: [],
  filteredUsers: [],
  filters: {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    search: "",
  },
  isLoading: false,
  error: "",
  hasLoaded: false,

  setUsers(users) {
    this.users = Array.isArray(users) ? users : [];
    this.filteredUsers = [...this.users];
    this.hasLoaded = true;
  },

  setFilters(nextFilters) {
    this.filters = { ...this.filters, ...nextFilters };
  },

  setLoading(isLoading) {
    this.isLoading = isLoading;
  },

  setError(message) {
    this.error = message || "";
  },

  clearError() {
    this.error = "";
  },
};
