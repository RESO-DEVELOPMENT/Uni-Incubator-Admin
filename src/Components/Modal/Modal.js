const Modal = (props) => {
  return (
    <div className="fixed top-0 bottom-0 left-0 w-screen z-1000 bg-black/30 overflow-y-auto overflow-x-hidden">
      <div
        className={`flex items-center justify-center py-5 w-full ${
          props.overflow ? "h-fit" : "h-full"
        }`}
      >
        {props.children}
      </div>
    </div>
  );
};

export default Modal;
