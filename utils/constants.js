const PORT = 8080;

const CLIENT = {
  MESSAGE: {
    NEW_USER: "NEW_USER",
    NEW_MESSAGE: "NEW_MESSAGE",
  },
};

const SERVER = {
  BROADCAST: {
    NEW_USER_WITH_TIME: "NEW_USER_WITH_TIME",
  },
  MESSAGE: {},
};

// This check allows the module to be used in the client and the server
if (typeof module !== "undefined" && module.exports) {
  module.exports = exports = {
    PORT,
    CLIENT,
    SERVER,
  };
}
