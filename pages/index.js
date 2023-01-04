import React, { useState, useEffect } from "react";
import { Table, Spinner } from "flowbite-react";
import { contactGet } from "../api/contact";
import { useSelector } from "react-redux";

function Dashboard() {
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

  return (
    <div className="px-4">
      <h2 className="font-bold text-xl">Latest Contact</h2>
      <div className="contact_wrp">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>S.No</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Phone</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Message</Table.HeadCell>
          </Table.Head>

          {isLoading ? (
            <>
              <Table.Body className="divide-y">
                <Table.Row>
                  <Table.Cell colSpan={6} className="text-center">
                    <Spinner color="info" />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </>
          ) : (
            <Table.Body className="divide-y">
              {contactFetchData.data?.length > 0 ? (
                contactFetchData.data.map((item, index) => {
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
          )}
        </Table>
      </div>
    </div>
  );
}

export default Dashboard;
