export default (cssVar: string) => {
  const htmlStyle = document.documentElement.style;
  return htmlStyle.getPropertyValue(cssVar).trim();
};
