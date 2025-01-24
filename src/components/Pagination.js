const Pagination = ({ totalPage, active, setActive }) => {
  let pageNumber = [];
  let placement = Math.min(active, totalPage - active - 1);
  if (placement >= 2)
    for (
      let i = Math.max(active - 2, 0);
      i <= Math.min(active + 2, totalPage - 1);
      i++
    )
      pageNumber.push(i);
  else if (active <= 1) {
    for (let i = 0; i < Math.min(5, totalPage); i++) pageNumber.push(i);
  } else if (active >= totalPage - 2) {
    for (let i = Math.max(totalPage - 5, 0); i < totalPage; i++)
      pageNumber.push(i);
  }
  return (
    <ul className="pagination">
      <li onClick={() => setActive(Math.max(active - 1, 0))}>
        <img
          src={process.env.PUBLIC_URL + "/Images/arrow_left.svg"}
          alt="arrow_left"
        />
      </li>
      {pageNumber.map((x, i) => (
        <li
          key={`li-${i}`}
          className={
            active === x ? "active secondary-medium" : "secondary-medium"
          }
          onClick={() => setActive(x)}
        >
          {x + 1}
        </li>
      ))}

      <li onClick={() => setActive(Math.min(active + 1, totalPage - 1))}>
        <img
          src={process.env.PUBLIC_URL + "/Images/arrow_right.svg"}
          alt="arrow_right"
        />
      </li>
    </ul>
  );
};
export default Pagination;
