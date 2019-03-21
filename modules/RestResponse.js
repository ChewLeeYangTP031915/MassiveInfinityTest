function RestResponse(status, data, message) {
  return {
    status,
    data,
    message
  };
}

module.exports = RestResponse;
