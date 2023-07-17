const Paginate = (props) => {
  const page = [];
  const displayPages = [];

  const getPage = (e) => {
    props.getPage(e.target.dataset.value);
  };

  if (props.totalPages <= 5) {
    for (let i = 1; i <= props.totalPages; i++) {
      displayPages.push(i);
    }
  } else {
    const current = props.currentPage;
    const last = props.totalPages;
    if (current < 4) {
      for (let i = 1; i <= 4; i++) {
        displayPages.push(i);
      }
      displayPages.push("...");
      displayPages.push(last);
    } else if (current > last - 3) {
      displayPages.push(1);
      displayPages.push("...");
      for (let i = last - 4; i <= last; i++) {
        displayPages.push(i);
      }
    } else {
      displayPages.push(1);
      displayPages.push("...");
      for (let i = current - 1; i <= current + 1; i++) {
        displayPages.push(i);
      }
      displayPages.push("...");
      displayPages.push(last);
    }
  }

  for (let i = 0; i < displayPages.length; i++) {
    const pageItem = displayPages[i];
    const etcClassName =
      "border border-slate-200 rounded-md px-3 py-1 select-none";
    const className = `border border-slate-200 rounded-md px-3 py-1 hover:bg-green hover:text-white cursor-pointer select-none ${
      pageItem === props.currentPage ? "text-white bg-green" : ""
    }`;
    const onClick = typeof pageItem === "number" ? getPage : null;
    const dataValue = typeof pageItem === "number" ? pageItem : null;

    page.push(
      <div
        key={i}
        className={typeof pageItem === "number" ? className : etcClassName}
        onClick={onClick}
        data-value={dataValue}
      >
        {pageItem}
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-1 w-full items-center justify-center">
        <div
          onClick={() => {
            props.getPage(1);
          }}
          className="border border-slate-200 rounded-md px-3 py-1 hover:bg-green hover:text-white cursor-pointer select-none"
        >
          &laquo;
        </div>
        <div
          onClick={() => {
            props.currentPage > 1 && props.getPage(props.currentPage - 1);
          }}
          className="border border-slate-200 rounded-md px-3 py-1 hover:bg-green hover:text-white cursor-pointer select-none"
        >
          &#8249;
        </div>
        {page}
        <div
          onClick={() => {
            props.currentPage < props.totalPages &&
              props.getPage(props.currentPage + 1);
          }}
          className="border border-slate-200 rounded-md px-3 py-1 hover:bg-green hover:text-white cursor-pointer select-none"
        >
          &#8250;
        </div>
        <div
          onClick={() => {
            props.getPage(props.totalPages);
          }}
          className="border border-slate-200 rounded-md px-3 py-1 hover:bg-green hover:text-white cursor-pointer select-none"
        >
          &raquo;
        </div>
      </div>
    </div>
  );
};

export default Paginate;
