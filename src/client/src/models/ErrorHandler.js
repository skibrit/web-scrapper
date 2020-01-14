export const extractError = error => {
  if (error && error.response && error.response.data.errors) {
    return error.response.data.errors.map(err => `${err.msg}`).join("<br/>");
  } else if (error && error.response && error.response.data) {
    console.log(error.response.data);
    if (error.response.data.err && error.response.data.err.message) {
      return error.response.data.err.message;
    } else if (error.response.data.err) {
      return error.response.data.err.toString();
    } else {
      return error.response.data.toString();
    }
  } else if (error.message) {
    return error.message;
  } else if (error) {
    return error.toString();
  }
  return "An unknown error occurred";
};
