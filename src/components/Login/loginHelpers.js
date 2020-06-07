const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const validateEmail = emailString => {
  if (emailString !== "" && emailString.match(emailRegex) === null) {
    return false;
  }
  return true;
};

export const validatePassword = passwordString => {
  if (passwordString === "") {
    return false;
  }
  return true;
};

export const validateData = (source, data, setFn) => {
  let dataOK = true;
  switch (source) {
    case "email":
      dataOK = validateEmail(data);
      return setFn({
        error: dataOK ? false : true,
        placeholder: dataOK ? null : "Please enter a valid email",
        autoFocus: dataOK ? false : true
      });
    case "password":
      dataOK = validatePassword(data);
      return setFn({
        error: dataOK ? false : true,
        placeholder: dataOK ? null : "Please enter a valid password",
        autoFocus: dataOK ? false : true
      });
  }
};
