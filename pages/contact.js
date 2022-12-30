import React, { useState, useEffect } from "react";
import { Table, Pagination, Spinner } from "flowbite-react";
import { contactGet } from "../api/contact";
import { useSelector } from "react-redux";

const Contact = () => {
  const [contactFetchData, setContactFetchData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    (async () => {
      setisLoading(true);
      const res = await contactGet(token);
      setisLoading(false);
      setContactFetchData(res.data?.all_data || []);
    })();
  }, [token]);

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
              {contactFetchData.length > 0 ? (
                contactFetchData.map((item, index) => {
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
          currentPage={0}
          layout="table"
          onPageChange={() => {}}
          showIcons={true}
          totalPages={0}
          nextLabel="Next"
          previousLabel="Prev"
        />
      </div>
    </div>
  );
};

export default Contact;
