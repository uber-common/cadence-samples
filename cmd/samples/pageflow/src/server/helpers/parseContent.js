const parseContent = (str) => {
  console.log('str:', str);
  const parsedString = str.replace(/^"/, '').replace(/"$/, '').replace(/\\/g, '');
  console.log('parsing:', parsedString);
  return JSON.parse(parsedString);
};

export default parseContent;
