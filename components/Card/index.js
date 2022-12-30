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
  children,
}) => {
  return (
    <>
      <div className={`${styles.card_wrp} ${className}`}>
        <div className={styles.card}>
          <div className={styles.card_front}>
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
                    handleGetSingleItem(item.id);
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
