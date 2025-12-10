import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import { useState } from "react";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";

export default function CreateDrawer({
  title,
  width,
  permission,
  children,
  update,
  color,
}) {
  // Drawer state
  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <UserPrivateComponent permission={permission}>
        <button
          onClick={() => setOpen(true)}
          className={`xs:px-3 px-2 md:text-base py-[6px] lg:px-5  border ${
            color ? color : "bg-primary"
          } hover:bg-primary/60 text-white rounded cursor-pointer`}
        >
          <span className='flex items-center justify-center gap-1 md:gap-2 '>
            {update ? <EditOutlined /> : <PlusOutlined />}
            <span className=''>{title}</span>
          </span>
        </button>
        <Drawer
          width={
            window.innerWidth <= 768 ? "100%" : width ? `${width}%` : "45%"
          }
          title={`${title}`}
          placement='right'
          onClose={onClose}
          open={open}
        >
          <div className='px-5 pt-5'> {children}</div>
        </Drawer>
      </UserPrivateComponent>
    </>
  );
}
