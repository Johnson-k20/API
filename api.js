(function () {
  const USERS_URL =
    "https://charity-minds-backend.onrender.com/api/v1/users";

  const REGISTER_URL =
    "https://charity-minds-backend.onrender.com/api/v1/auth/register";

  function buildRequestOptions(method = "GET", body = null) {
    const options = {
      method,
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
      const response = await fetch(
        USERS_URL,
        buildRequestOptions("GET")
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload.message ||
          `Unable to load users (${response.status})`
        );
      }

      const users = Array.isArray(payload)
        ? payload
        : payload.users ||
          payload.data ||
          payload.result ||
          [];

      AppState.setUsers(users);

      return users;
    } catch (error) {
      console.error("Fetch error:", error);

      // Prevent authentication messages from appearing
      if (
        error.message.includes("You are not authenticated")
      ) {
        AppState.clearError();
      } else {
        AppState.setError(error.message);
      }

      return [];
    } finally {
      AppState.setLoading(false);
    }
  }

  async function createUser(userPayload) {
    AppState.clearError();

    const response = await fetch(
      REGISTER_URL,
      buildRequestOptions("POST", userPayload)
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        payload?.message ||
        `Registration failed (${response.status})`
      );
    }

    return payload;
  }

  window.api = {
    fetchUsers,
    createUser,
  };
})();