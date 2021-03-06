import validator from "validator";

const preValidateLoginData = (data = { username: "", password: "" }) => {
  if (!/^(\d+|\w+)$/.test(data.username)) {
    return "Invalid username";
  }

  if (/^(\d+|\w+)$/.test(data.username) && data.username.length > 16) {
    return "Invalid username";
  }

  if (
    data.password.length < 1 ||
    data.password.toLowerCase().includes("password")
  ) {
    return "Unable to login";
  }
};

export default preValidateLoginData;
