(function () {
  const elements = {
    tableBody: document.getElementById("tableBody"),
    totalUsers: document.getElementById("totalUsers"),
    errorBanner: document.getElementById("errorBanner"),
    errorText: document.getElementById("errorText"),
    retryButton: document.getElementById("retryButton"),
    statusText: document.getElementById("statusText"),
    firstNameFilter: document.getElementById("firstNameFilter"),
    lastNameFilter: document.getElementById("lastNameFilter"),
    usernameFilter: document.getElementById("usernameFilter"),
    emailFilter: document.getElementById("emailFilter"),
    searchInput: document.getElementById("searchInput"),
  };

  function renderTable() {
    const users = AppState.filteredUsers;
    elements.tableBody.innerHTML = "";

    if (AppState.isLoading) {
      elements.tableBody.innerHTML =
        '<tr><td colspan="6" class="empty-state">Loading users...</td></tr>';
      return;
    }

    if (AppState.error) {
      elements.tableBody.innerHTML = `<tr><td colspan="6" class="empty-state">${AppState.error}</td></tr>`;
      return;
    }

    if (!users.length) {
      elements.tableBody.innerHTML =
        '<tr><td colspan="6" class="empty-state">No users found.</td></tr>';
      return;
    }

    users.forEach((user) => {
      const fullName =
        [user.firstName, user.lastName].filter(Boolean).join(" ") || "—";
      elements.tableBody.innerHTML += `
                <tr>
                    <td>${user.id || "—"}</td>
                    <td>${fullName}</td>
                    <td>${user.username || "—"}</td>
                    <td>${user.email || "—"}</td>
                    <td>${user.phone || "—"}</td>
                    <td>${user.gender || "—"}</td>
                </tr>
            `;
    });
  }

  function renderSummary() {
    elements.totalUsers.textContent = AppState.users.length;
  }

  function renderBanner() {
    if (!AppState.error) {
      elements.errorBanner.classList.add("hidden");
      elements.errorText.textContent = "";
      return;
    }

    elements.errorBanner.classList.remove("hidden");
    elements.errorText.textContent = AppState.error;
  }

  function applyFilters() {
    const filters = AppState.filters;
    const filtered = filterUsers(AppState.users, filters);
    AppState.filteredUsers = filtered;
    renderTable();
  }

  function syncFiltersFromInputs() {
    AppState.setFilters({
      firstName: elements.firstNameFilter.value.trim(),
      lastName: elements.lastNameFilter.value.trim(),
      username: elements.usernameFilter.value.trim(),
      email: elements.emailFilter.value.trim(),
      search: elements.searchInput.value.trim(),
    });
    applyFilters();
  }

  async function loadUsers(forceRefresh = false) {
    if (!forceRefresh && AppState.hasLoaded && AppState.users.length) {
      applyFilters();
      return;
    }

    await window.api.fetchUsers();
    renderSummary();
    renderBanner();
    applyFilters();
  }

  function bindEvents() {
    [
      elements.firstNameFilter,
      elements.lastNameFilter,
      elements.usernameFilter,
      elements.emailFilter,
      elements.searchInput,
    ].forEach((input) => {
      input.addEventListener("input", syncFiltersFromInputs);
    });

    elements.retryButton.addEventListener("click", () => loadUsers(true));
  }

  function showSuccessMessage() {
    const successMessage = sessionStorage.getItem("registrationSuccess");
    if (successMessage) {
      elements.statusText.textContent = successMessage;
      elements.statusText.classList.remove("hidden");
      sessionStorage.removeItem("registrationSuccess");
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    bindEvents();
    renderSummary();
    renderBanner();
    showSuccessMessage();
    await loadUsers(Boolean(sessionStorage.getItem("registrationSuccess")));
  });
})();
