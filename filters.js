function filterUsers(users, filters) {
  const normalizedSearch = (filters.search || "").toLowerCase();

  return users.filter((user) => {
    const firstName = (user.firstName || "").toString().toLowerCase();
    const lastName = (user.lastName || "").toString().toLowerCase();
    const username = (user.username || "").toString().toLowerCase();
    const email = (user.email || "").toString().toLowerCase();
    const phone = (user.phone || "").toString().toLowerCase();
    const combined = `${firstName} ${lastName} ${username} ${email} ${phone}`;

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
