import Button from "@/UI/Button";
import CSV from "@/UI/CSV";
import Menu from "@/UI/Menu";
import { Popover } from "antd";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import Pagination from "../../UI/Pagination";
import Table from "../../UI/Table";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import CommonSearch from "./CommonSearch";
import Filter from "./Filter";
import PrintPdf from "./PrintPdf";

const TableComponent = ({
  columns,
  list,
  total,
  loading,
  children,
  filters,
  title,
  setPageConfig,
  isSearch,
  loadingUiSize = 10,
}) => {
  const fetchData = (page, count) => {
    setPageConfig((prev) => {
      return { ...prev, page, count };
    });
  };

  // column select
  const [columnsToShow, setColumnsToShow] = useState([]);

  useEffect(() => {
    setColumnsToShow(columns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const columnsToShowHandler = (val) => {
    setColumnsToShow(val);
  };

  return (
    <>
      <div className='mt-2'>
        <div className='w-full dark:text-yellow-50 flex flex-wrap gap-2 items-center flex-col-reverse sm:flex-row  justify-between mb-3'>
          <div className='flex flex-wrap lg:flex-nowrap gap-2 w-full md:w-auto'>
            {isSearch && (
              <div className='w-full sm:w-[250px]'>
                <CommonSearch setPageConfig={setPageConfig} />
              </div>
            )}
            <div className='hideScrollBar overflow-x-auto overflow-y-hidden w-full'>
              <Filter setPageConfig={setPageConfig} filters={filters} />
            </div>
          </div>

          <div className='flex items-center gap-2 w-full sm:w-auto'>
            <ColVisibilityDropdown
              options={columns}
              columns={columns}
              columnsToShowHandler={columnsToShowHandler}
            />

            <Popover
              content={
                <Menu
                  items={[
                    {
                      key: "1",
                      label: (
                        <PrintPdf list={list} columns={columns} title={title} />
                      ),
                    },
                    {
                      key: "2",
                      label: (
                        <CSV
                          notButton={true}
                          list={list}
                          columns={columns}
                          title={title}
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
                className='  px-3'
              ></Button>
            </Popover>
          </div>
        </div>

        <Table
          loading={loading}
          columns={columnsToShow}
          data={
            !!list?.length && list.map((item) => ({ ...item, key: item?.id }))
          }
          scroll={{ y: window.innerHeight - 350 }}
          loadingUiSize={loadingUiSize}
        />
      </div>
      <div className='flex justify-center mt-3'>
        {total >= 11 && <Pagination onChange={fetchData} total={total} />}
      </div>
      {children && children}
    </>
  );
};
export default TableComponent;
