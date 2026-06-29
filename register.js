(function () {
  const form = document.getElementById("registerForm");
  const submitButton = document.getElementById("submitButton");
  const fields = Array.from(form.querySelectorAll("input, select"));

  function getFormData() {
    const values = {};
    fields.forEach((field) => {
      values[field.name] = field.value;
    });
    return values;
  }

  function setFieldError(name, message) {
    const errorElement = form.querySelector(`[data-error-for="${name}"]`);
    if (errorElement) {
      errorElement.textContent = message || "";
    }
  }

  function clearErrors() {
    fields.forEach((field) => setFieldError(field.name, ""));
  }

  function validateAndRender() {
    const values = getFormData();
    const errors = validateUserForm(values);
    clearErrors();

    Object.entries(errors).forEach(([name, message]) => {
      setFieldError(name, message);
    });

    submitButton.disabled = Object.keys(errors).length > 0;
  }

  function attachListeners() {
    fields.forEach((field) => {
      field.addEventListener("input", validateAndRender);
      field.addEventListener("change", validateAndRender);
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const values = getFormData();
      const errors = validateUserForm(values);

      clearErrors();
      Object.entries(errors).forEach(([name, message]) => {
        setFieldError(name, message);
      });

      if (Object.keys(errors).length) {
        submitButton.disabled = true;
        return;
      }
      if (values.password !== values.confirmPassword) {
        setFieldError("confirmPassword", "Passwords do not match");
        submitButton.disabled = false;
        submitButton.textContent = "Register";
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "Registering...";

      try {
        const payload = normalizeUserPayload(values);
        console.log("Payload being sent;", payload);

        await window.api.createUser(payload);
        sessionStorage.setItem(
          "registrationSuccess",
          "User registered successfully.",
        );
        window.location.href = "index.html";
      } catch (error) {
        console.error(error);
        setFieldError("general", error.message || "Registration failed.");
        submitButton.disabled = false;
        submitButton.textContent = "Register";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    attachListeners();
    validateAndRender();
  });
})();
