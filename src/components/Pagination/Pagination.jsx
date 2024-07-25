import React from "react";
import "./Pagination.css";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

function Pagination({ totalPages, onPrevious, onNext, page }) {
  return (
    <div className="pagination">
      {page > 1 && (
        <div className="arrow prev" onClick={onPrevious}>
          <FaAngleLeft />
        </div>
      )}
      <div className="middle">
        {page}/ {totalPages}
      </div>
      {page < totalPages && (
        <div className="arrow next" onClick={onNext}>
          <FaAngleRight />
        </div>
      )}
    </div>
  );
}

export default Pagination;
