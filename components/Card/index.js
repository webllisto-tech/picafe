import React from "react";
import styles from "./card.module.scss";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import Image from "next/image";

// import Modal from "../Modal";

const Card = ({
  className,
  edit,
  item,
  setIsPopup,
  setIsShow,
  handleGetSingleItem,
  setActiveItemId,
  children,
}) => {
  return (
    <>
      <div className={`${styles.card_wrp} ${className}`}>
        <div className={styles.card}>
          <div className={styles.card_front}>
            {item.category_name ? (
              <span className="top-2 right-2 absolute z-[1] capitalize rounded-md bg-blue-600 py-1 px-3  text-white">
                {item.category_name}
              </span>
            ) : (
              <></>
            )}
            <Image
              src={`${process.env.NEXT_PUBLIC_APIURL}${
                item.image ? item.image : ""
              }`}
              alt="cake"
              fill
              className="absolute object-cover"
            />
          </div>

          <div className={styles.card_back}>
            <div className="flex flex-col">
              {children ? <div className="data">{children}</div> : <></>}
              <div className={styles.action_btn}>
                {edit ? (
                  <button
                    onClick={() => {
                      setIsPopup(false);
                      handleGetSingleItem(item.id);
                      setIsShow((prev) => !prev);
                    }}
                    className={styles.icon_wrp}
                  >
                    <AiOutlineEdit />
                  </button>
                ) : (
                  ""
                )}
                <button
                  onClick={() => {
                    setIsShow((prev) => !prev);
                    setActiveItemId(item.id);
                    setIsPopup(true);
                  }}
                  className={styles.icon_wrp}
                >
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
