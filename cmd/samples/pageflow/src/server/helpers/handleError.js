const handleError = ({ error, response }) => {
  return response.code(error.code || '500').send(JSON.stringify(error));
};

export default handleError;
