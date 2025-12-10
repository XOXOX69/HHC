import Card from "@/UI/Card";
import { deleteStaff, loadAllStaff } from "@/redux/rtk/features/user/userSlice";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ViewBtn from "../Buttons/ViewBtn";
import CreateDrawer from "../CommonUi/CreateDrawer";
import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import AddStaff from "./AddStaff";
import CommonDelete from "../CommonUi/CommonDelete";

export default function GetAllStaff() {
  const dispatch = useDispatch();
  const { list, total, loading } = useSelector((state) => state.users);
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
      render: (id) => <Link to={`/admin/hr/staffs/${id}`}>{id}</Link>,
      renderCsv: (id) => id,
    },
    {
      id: 2,
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (username, { id }) => (
        <Link to={`/admin/hr/staffs/${id}`}>{username}</Link>
      ),
    },
    {
      id: 3,
      title: "Name",
      key: "email",
      render: ({ firstName, lastName }) =>
        `${firstName || ""} ${lastName || ""}`,
      renderCsv: ({ firstName, lastName }) =>
        `${firstName || ""} ${lastName || ""}`,
    },
    {
      id: 3,
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: ({ name }) => name,
      renderCsv: ({ name }) => name,
    },
    {
      id: 4,
      title: "Created at",
      dataIndex: "createdAt",
      key: "addrcreatedAtess",
      render: (createdAt) => moment(createdAt).format("YYYY-MM-DD"),
      renderCsv: (createdAt) => moment(createdAt).format("YYYY-MM-DD"),
    },
    {
      id: 5,
      title: "",
      key: "action",
      render: (staff) => [
        {
          label: (
            <ViewBtn title={"View"} path={`/admin/hr/staffs/${staff?.id}`} />
          ),
          key: "view",
        },

        {
          label: (
            <CommonDelete
              values={{
                id: staff?.id,
                status: staff?.status,
              }}
              title={staff?.status === "true" ? "Hide" : "Show"}
              permission={"delete-user"}
              deleteThunk={deleteStaff}
              loadThunk={loadAllStaff}
              query={pageConfig}
              className="bg-white text-black"
            />
          ),
          key: "delete",
        },
      ],
      csvOff: true,
    },
  ];
  const filters = [
    {
      key: "roleId",
      label: "Role",
      type: "select",
      options: list?.map(({ id, name }) => ({ value: id, label: name })),
      className: "min-w-[120px] max-w-[150px]",
      popupClassName: "w-[200px]",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Show", value: "true" },
        { label: "Hide", value: "false" },
      ],
      className: "min-w-[85px] max-w-[150px]",
      popupClassName: "w-[200px]",
    },
  ];
  useEffect(() => {
    dispatch(loadAllStaff(pageConfig));
  }, [dispatch, pageConfig]);

  return (
    <>
      <Card
        className="max-md:border-0 max-md:bg-white"
        bodyClass="max-md:p-0 "
        headClass="border-none"
        title={"Staff List"}
        extra={
          <CreateDrawer
            permission={"create-user"}
            title={"Create Staff"}
            width={85}>
            <AddStaff />
          </CreateDrawer>
        }>
        <UserPrivateComponent permission={"readAll-user"}>
          <TableComponent
            columns={columns}
            list={list}
            total={total}
            loading={loading}
            setPageConfig={setPageConfig}
            title={"Staff List"}
            filters={filters}
          />
        </UserPrivateComponent>
      </Card>
    </>
  );
}
