const updateProductDescription = ({ description, id }) => {
  // TODO - communicate with cadence-server to fetch product information from workflow.

  const product = getProduct(id);
  product.description = description;
  return product;
};

export default updateProductDescription;
