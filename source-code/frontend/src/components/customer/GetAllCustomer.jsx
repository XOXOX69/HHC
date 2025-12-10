import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Card from "../../UI/Card";
import { loadAllCustomer } from "../../redux/rtk/features/customer/customerSlice";
import ViewBtn from "../Buttons/ViewBtn";
import CreateDrawer from "../CommonUi/CreateDrawer";
import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import AddCustomer from "./AddCustomer";

const GetAllCustomer = () => {
  const dispatch = useDispatch();
  const { list, total, loading } = useSelector((state) => state.customers);
  const [pageConfig, setPageConfig] = useState({
    page: 1,
    count: 10,
    status: "true",
  });
  const columns = [
    {
      id: 1,
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <Link to={`/admin/customer/${id}`}>{id}</Link>,
      renderCsv: (id) => id,
    },
    {
      id: 2,
      title: "username",
      dataIndex: "username",
      key: "name",
      render: (name, { id }) => (
        <Link to={`/admin/customer/${id}`}>{name}</Link>
      ),
      renderCsv: (name) => name,
    },
    {
      id: 3,
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      id: 3,
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      id: 4,
      title: "Address",
      dataIndex: "address",
      key: "address",
      responsive: ["md"],
    },
    {
      id: 5,
      title: "Action",
      key: "Action",
      render: ({ id }) => <ViewBtn path={`/admin/customer/${id}`} />,
      csvOff: true,
    },
  ];
  const filters = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Show", value: "true" },
        { label: "Hide", value: "false" },
      ],
      className: "min-w-[85px] max-w-[150px]",
      popupClassName: "w-[100px]",
    },
  ];
  useEffect(() => {
    dispatch(loadAllCustomer({ page: 1, count: 10 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadAllCustomer(pageConfig));
  }, [dispatch, pageConfig]);

  return (
    <Card
      className="max-md:border-0 max-md:bg-white"
      bodyClass="max-md:p-0 "
      headClass="border-none"
      title={"Customers"}
      extra={
        <CreateDrawer
          permission={"create-customer"}
          title={"Create Customer"}
          width={35}
        >
          <AddCustomer />
        </CreateDrawer>
      }
    >
      <UserPrivateComponent permission={"readAll-customer"}>
        <TableComponent
          columns={columns}
          list={list}
          total={total}
          loading={loading}
          title={"Customer List"}
          setPageConfig={setPageConfig}
          filters={filters}
          isSearch
        />
      </UserPrivateComponent>
    </Card>
  );
};

export default GetAllCustomer;
