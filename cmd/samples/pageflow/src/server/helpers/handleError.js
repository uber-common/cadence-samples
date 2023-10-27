const handleError = ({ ctx, error }) => {
  ctx.status = error.statusCode || error.status || 500;
  ctx.body = {
    message: error.message,
  };
};

export default handleError;
