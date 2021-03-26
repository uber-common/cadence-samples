const parseContent = (str) => {
  const parsedString = str.replace(/^"/, '').replace(/"$/, '').replace(/\\/g, '');
  return JSON.parse(parsedString);
};

export default parseContent;
