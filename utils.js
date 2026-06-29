function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^\d{10,}$/.test(phone.replace(/\D/g, ""));
}

function validateUserForm(formData) {
  const errors = {};

  if (!formData.firstName?.trim()) {
    errors.firstName = "First name is required.";
  }
  if (!formData.lastName?.trim()) {
    errors.lastName = "Last name is required.";
  }
  if (!formData.username?.trim()) {
    errors.username = "Username is required.";
  }
  if (!formData.email?.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(formData.email)) {
    errors.email = "Email must be a valid format.";
  }
  if (!formData.phone?.trim()) {
    errors.phone = "Phone is required.";
  } else if (!isValidPhone(formData.phone)) {
    errors.phone = "Phone must contain at least 10 digits.";
  }
  if (!formData.dob?.trim()) {
    errors.dob = "Date of birth is required.";
  }
  if (!formData.gender?.trim()) {
    errors.gender = "Gender is required.";
  }
  if (!formData.password) {
    errors.password = "Password is required.";
  }
  if (!formData.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

function normalizeUserPayload(formData) {
  return {
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    username: formData.username.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    dob: formData.dob,
    gender: formData.gender,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
  };
}

function filterUsers(users, filters) {
  const normalizedSearch = (filters.search || "").toLowerCase();

  return users.filter((user) => {
    const firstName = (user.firstName || "").toString().toLowerCase();
    const lastName = (user.lastName || "").toString().toLowerCase();
    const username = (user.username || "").toString().toLowerCase();
    const email = (user.email || "").toString().toLowerCase();
    const phone = (user.phone || "").toString().toLowerCase();
    const combined =
      `${firstName} ${lastName} ${username} ${email} ${phone}`.toLowerCase();

    const matchesSearch =
      !normalizedSearch || combined.includes(normalizedSearch);
    const matchesFirstName =
      !filters.firstName || firstName.includes(filters.firstName.toLowerCase());
    const matchesLastName =
      !filters.lastName || lastName.includes(filters.lastName.toLowerCase());
    const matchesUsername =
      !filters.username || username.includes(filters.username.toLowerCase());
    const matchesEmail =
      !filters.email || email.includes(filters.email.toLowerCase());

    return (
      matchesSearch &&
      matchesFirstName &&
      matchesLastName &&
      matchesUsername &&
      matchesEmail
    );
  });
}
