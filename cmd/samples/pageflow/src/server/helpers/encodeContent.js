const encodeContent = (content = '') => {
  if (!content) {
    return content;
  }

  return `"${JSON.stringify(content)}"`;
};

export default encodeContent;
