import React, { useState, useEffect } from "react";
import { Table, Spinner } from "flowbite-react";
import { contactGet } from "../api/contact";
import { useSelector } from "react-redux";
import Pagination from "react-js-pagination";

const Contact = () => {
  const [contactFetchData, setContactFetchData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const res = await contactGet(token, 1);
      setIsLoading(false);
      setContactFetchData(res.data);
    })();
  }, [token]);

  const handlePagination = async (page) => {
    setIsLoading(true);
    if (query.slug) {
      const res = await contactGet(token, page);
      setContactFetchData(res.data);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="header mb-4 py-2 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-[64px] z-[10] bg-white">
          <h2 className="text-xl font-[700]">Contact Details</h2>
        </div>

        <div className="py-2 px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>S.No</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Phone</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Date</Table.HeadCell>
                <Table.HeadCell>Message</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                <Table.Row>
                  <Table.Cell colSpan={6} className="text-center">
                    <Spinner color="info" />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="header mb-4 py-2 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-[64px] z-[10] bg-white">
        <h2 className="text-xl font-[700]">Contact Details</h2>
      </div>

      <div className="py-2 px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>S.No</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Phone</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Message</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {contactFetchData?.data?.length > 0 ? (
                contactFetchData?.data?.map((item, index) => {
                  return (
                    <Table.Row
                      key={new Date().getTime() + index + 1}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>{item.phone}</Table.Cell>
                      <Table.Cell>{item.email}</Table.Cell>
                      <Table.Cell>
                        {new Date(item.date_and_time).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <span
                          className="block overflow-hidden h-4 hover:overflow-visible hover:h-auto"
                          dangerouslySetInnerHTML={{ __html: item.message }}
                        ></span>
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={6} className="text-center">
                    No Data Found
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>

        <Pagination
          activePage={parseInt(contactFetchData?.current_page)}
          itemsCountPerPage={6}
          totalItemsCount={contactFetchData?.total_contacts}
          pageRangeDisplayed={5}
          onChange={handlePagination}
          innerClass="flex gap-5"
          activeClass="bg-red-500 text-white border-transparent"
          linkClass="w-full h-full flex items-center justify-center"
          disabledClass="bg-gray-200 text-white border-0 pointer-events-none"
          itemClass="border border-gray-500 rounded-full w-9 h-9 hover:bg-red-500 hover:text-white hover:border-0"
        />
      </div>
    </div>
  );
};

export default Contact;
