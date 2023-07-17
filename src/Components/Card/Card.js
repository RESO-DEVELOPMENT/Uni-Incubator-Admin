const Card = (props) => {
  return (
    <div className="bg-white rounded-lg shadow-md font-bold w-56 h-40 p-5 content-middle text-xl flex flex-col justify-center">
      <div>{props.title}</div>
      <div className="text-green">{props.description}</div>
    </div>
  );
};

export default Card;
