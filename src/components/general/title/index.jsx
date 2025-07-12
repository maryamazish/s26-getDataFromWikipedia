const Title = ({ text , children}) => {
  console.log(children)
  return <h1>{children}{text}</h1>;
};

export default Title;
