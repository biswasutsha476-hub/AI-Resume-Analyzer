import bcrypt from 'bcryptjs';

export const inMemoryUsers = new Map();

// Helper to find user by email in memory
export const findInMemoryUserByEmail = (email) => {
  const target = email.toLowerCase().trim();
  for (const user of inMemoryUsers.values()) {
    if (user.email === target) return user;
  }
  return null;
};

// Helper to find user by ID in memory
export const findInMemoryUserById = (id) => {
  return inMemoryUsers.get(id) || null;
};

// Helper to create user in memory
export const createInMemoryUser = async ({ name, email, password, role = 'candidate' }) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const id = 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

  const user = {
    _id: id,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role,
    createdAt: new Date().toISOString(),
    matchPassword: async function (entered) {
      return await bcrypt.compare(entered, this.password);
    }
  };

  inMemoryUsers.set(id, user);
  return user;
};
