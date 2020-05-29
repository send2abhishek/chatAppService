const users = [];
const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    (data) => data.name === name && data.room === room
  );

  if (existingUser) {
    return { error: "username already taken" };
  }

  const user = { id, name, room };
  users.push(user);
  return { user: user };
};

const removeUser = (id) => {
  const index = users.findIndex((d) => d.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  return users.find((d) => d.id === id);
};

const getUserInRoom = (room) => {
  return users.filter((data) => data.room === room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUserInRoom,
};
