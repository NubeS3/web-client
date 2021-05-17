import validator from "validator";

const preValidateLoginData = (data = { username: "", password: "" }) => {
  if (data.username === "" && data.password === "") {
    return "Please enter username and password";
  }

  // if (!/^(\d+|\w+)$/.test(data.username)) {
  //   return "Invalid username or password";
  // }
  
  // if (data.password.length <= 8 ) {
  //   return "Invalid username or password";
  // }
};

export default preValidateLoginData;
