
const getProduct = (id) => {
  // TODO - communicate with cadence-server to fetch product information from workflow.
  const product = products[id];

  if (!product) {
    throw new NotFoundError(id);
  }

  return product;
};

export default getProduct;
