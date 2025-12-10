import Button from "@/UI/Button";
import CSV from "@/UI/CSV";
import Menu from "@/UI/Menu";
import Pagination from "@/UI/Pagination";
import { Popover, Table } from "antd";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch } from "react-redux";
import PrintPdf from "../CommonUi/PrintPdf";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";

const TableComponent = ({
  columns,
  list,
  total,
  loading,
  paginatedThunk,
  children,
  query,
  setProductList,
  productList,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const dispatch = useDispatch();

  const onSelectChange = (newSelectedRowKeys, second) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setProductList(second);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const fetchData = (page, count) => {
    dispatch(paginatedThunk({ ...query, status: true, page, count }));
  };

  // column select
  const [columnsToShow, setColumnsToShow] = useState([]);

  useEffect(() => {
    setColumnsToShow(columns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className='mt-2'>
        <div className='pb-3'>
          <div className='w-full dark:text-yellow-50 flex flex-col md:flex-row gap-2 items-center justify-between'>
            <div className=''></div>
            <div className='flex items-center gap-2 w-full sm:w-auto'>
              <ColVisibilityDropdown
                options={columns}
                columns={columns}
                columnsToShowHandler={setColumnsToShow}
              />
              <Popover
                content={
                  <Menu
                    items={[
                      {
                        key: "1",
                        label: (
                          <PrintPdf
                            list={list}
                            columns={columns}
                            title={"Shortage Products"}
                          />
                        ),
                      },
                      {
                        key: "2",
                        label: (
                          <CSV
                            notButton={true}
                            list={list}
                            columns={columns}
                            title={"Shortage Products"}
                          />
                        ),
                      },
                    ]}
                  />
                }
                placement='bottomRight'
                arrow={false}
                trigger='click'
              >
                <Button
                  color={"gray"}
                  icon={<BsThreeDotsVertical size={15} />}
                  className='px-2'
                ></Button>
              </Popover>
            </div>
          </div>
        </div>

        <Table
          loading={loading}
          rowSelection={rowSelection}
          columns={columnsToShow}
          dataSource={
            !!list?.length && list.map((item) => ({ ...item, key: item?.id }))
          }
          pagination={false}
          scroll={{ x: 1000, y: window.innerHeight - 319 }}
        />
        <div className='flex justify-center mt-3'>
          {total >= 11 && <Pagination onChange={fetchData} total={total} />}
        </div>
      </div>
      {children && children}
    </>
  );
};
export default TableComponent;
