class UnexpectedStatusError extends Error {
  constructor(status) {
    super();
    this.code = '400';
    this.message = `Unexpected status '${status}'.`
    this.name = 'UnexpectedStatusError';
  }
}

export default UnexpectedStatusError;
