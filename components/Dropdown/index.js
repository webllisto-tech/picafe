import React, { useState } from "react";
import { FiFilter } from "react-icons/fi";

const Dropdown = ({ className, selectedItem, setSelectedItem }) => {
  const [isOpen, setOpen] = useState(false);
  const [items] = useState([
    { label: "All" },
    { label: "Image" },
    { label: "Video" },
  ]);

  const toggleDropdown = () => setOpen(!isOpen);

  const handleItemClick = (value) => {
    setSelectedItem(value.toLowerCase());
  };

  return (
    <div className={`dropdown ${className}`}>
      <div
        className="dropdown-header w-20 p-1 capitalize"
        onClick={toggleDropdown}
      >
        <FiFilter />
        {selectedItem}
      </div>
      <div className={`dropdown-body top-[110%] ${isOpen && "open"}`}>
        {items.map((item, id) => (
          <div
            key={new Date().getTime() + 1 + id + "custom"}
            className={`dropdown-item ${
              item.label.toLowerCase() == selectedItem
                ? "bg-red-400 text-white"
                : ""
            }`}
            onClick={(e) => {
              handleItemClick(e.target.id);
              toggleDropdown();
            }}
            id={item.label}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
