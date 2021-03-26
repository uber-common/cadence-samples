const handleError = ({ error, response }) => {
  console.log('handleError:', error.code, JSON.stringify(error));
  return response.code(error.code || '500').send(JSON.stringify(error));
};

export default handleError;
