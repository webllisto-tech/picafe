import React from "react";
import { Modal, Button, Spinner } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const ModalComponent = ({
  onClose,
  isShow,
  popup,
  children,
  heading,
  onSubmit,
  itemDelete,
  deleteId,
  isLoading,
}) => {
  return (
    <>
      <Modal
        popup={popup}
        show={isShow}
        onClose={() => onClose((prev) => !prev)}
        className="md:h-[unset]"
      >
        <Modal.Header>{heading && !popup ? heading : ""}</Modal.Header>

        <Modal.Body>
          {popup ? (
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this item?
              </h3>
              <div className="flex justify-center gap-4">
                {isLoading ? (
                  <Button disabled onClick={onSubmit} color="failure">
                    <Spinner color="failure" className="mx-2" /> Loading
                  </Button>
                ) : (
                  <Button color="failure" onClick={() => itemDelete(deleteId)}>
                    Yes, I&apos;m sure
                  </Button>
                )}

                <Button color="gray" onClick={() => onClose((prev) => !prev)}>
                  No, cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>{children}</div>
          )}
        </Modal.Body>

        <Modal.Footer>
          {popup ? (
            ""
          ) : (
            <>
              {isLoading ? (
                <Button disabled onClick={onSubmit} color="failure">
                  <Spinner color="failure" className="mx-2" /> Loading...
                </Button>
              ) : (
                <Button onClick={onSubmit} color="failure">
                  Submit
                </Button>
              )}
              <Button color="light" onClick={() => onClose((prev) => !prev)}>
                Close
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalComponent;
