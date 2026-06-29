(function () {
  const REGISTER_URL =
    "https://charity-minds-backend.onrender.com/api/v1/auth/register";

  function buildRequestOptions(method = "GET", body) {
    const options = {
      method,
      mode: "cors",
      credentials: "omit",
      headers: {
        Accept: "application/json",
      },
    };

    if (body) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }

    return options;
  }

  async function fetchUsers() {
    AppState.setLoading(true);
    AppState.clearError();

    try {
      const response = await fetch(REGISTER_URL, buildRequestOptions("GET"));

      if (!response.ok) {
        const message = await response.text().catch(() => "");
        throw new Error(message || `Unable to load users (${response.status})`);
      }

      const payload = await response.json().catch(() => null);
      const users = Array.isArray(payload)
        ? payload
        : payload?.users || payload?.data || payload?.result || [];

      AppState.setUsers(users);
      return users;
    } catch (error) {
      AppState.setError(
        error.message || "The public endpoint is unavailable right now.",
      );
      return [];
    } finally {
      AppState.setLoading(false);
    }
  }

  async function createUser(userPayload) {
    AppState.clearError();

    const response = await fetch(
      REGISTER_URL,
      buildRequestOptions("POST", userPayload),
    );
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        payload?.message || `Registration failed (${response.status})`;
      console.error("Backend error response:", payload);
      throw new Error(message);
    }

    return payload;
  }

  window.api = {
    fetchUsers,
    createUser,
  };
})();
