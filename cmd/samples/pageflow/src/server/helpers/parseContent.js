const parseContent = (str) => {
  const parsedString = str
    .match(/^"(.*)"$/)[1]
    .replace(/\\/g, '');

  return JSON.parse(parsedString);
};

export default parseContent;
