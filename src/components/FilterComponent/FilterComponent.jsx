import React, { useState } from "react";
import "./Filter.css";
import { FaFilter } from "react-icons/fa";
import Model from "../Model/Model";
function FilterComponent() {
  const [show, setShow] = useState(false);

  const onClose = () => {
    setShow(false);
  };
  return (
    <>
      <Model show={show} onClose={onClose} />
      <div className="filter" onClick={() => setShow(true)}>
        <FaFilter />
      </div>
    </>
  );
}

export default FilterComponent;
