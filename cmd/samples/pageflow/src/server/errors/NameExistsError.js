class NameExistsError extends Error {
  constructor(name) {
    super();
    this.code = '400';
    this.message = `Product name '${name}' already exists.`
    this.name = 'NameExistsError';
  }
}

export default NameExistsError;
