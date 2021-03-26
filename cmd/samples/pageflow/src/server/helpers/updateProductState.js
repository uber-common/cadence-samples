const updateProductState = ({ action, id }) => {
  // TODO - communicate with cadence-server to fetch product information from workflow.

  const product = getProduct(id);

  if (!ALLOWED_ACTION_ON_STATUS_MAP[action].includes(product.status)) {
    throw new UnexpectedStatusError(product.status);
  }

  product.status = ACTION_TO_STATUS_MAP[action];
  return product;
};

export default updateProductState;
