const parseContent = (str) => {
  const parsedString = str.match(/^"(.*)"$/)[1];
  return JSON.parse(parsedString);
};

export default parseContent;
