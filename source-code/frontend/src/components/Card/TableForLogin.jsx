import Menu from "@/UI/Menu";
import { cn } from "@/utils/functions";
import { Popover } from "antd";
import { BsDatabaseExclamation, BsThreeDots } from "react-icons/bs";

const TableForLogin = ({
  columns,
  data,
  loading = false,
  loadingUiSize = 5,
  scroll = {},
  headClass,
  nestedRowKey,
  setDefaultValue,
}) => {
  let nestedRow = null;
  const renderItem = (item, column) => {
    if (column?.key === "action" && column?.render) {
      return (
        <Popover
          content={<Menu items={column.render(item)} />}
          placement="bottomRight"
          arrow={false}
          trigger="click">
          <BsThreeDots className="cursor-pointer text-base mr-2" />
        </Popover>
      );
    } else if (
      column?.dataIndex &&
      Object.prototype.hasOwnProperty.call(item, column?.dataIndex)
    ) {
      if (column.render)
        return column.render(item[column?.dataIndex], item) || "-";
      else if (typeof item[column?.dataIndex] === "number") {
        return item[column?.dataIndex];
      } else {
        return item[column?.dataIndex] ? item[column?.dataIndex] : "-";
      }
    } else if (column.render && !column?.dataIndex) {
      return column.render(item) || "-";
    }
    return "-";
  };

  const renderNestedRow = (nestedItem, column) => {
    if (column.renderNested)
      return column.renderNested(nestedItem[column.nestDataIndex]) || "-";
  };

  const handleSetValue = (e) => {
    setDefaultValue(data);
  };

  return (
    <div className="tableContainer tableScrollBar overflow-y-auto w-full">
      <div
        style={{
          maxHeight: scroll.y ? `${scroll.y}px` : "auto",
        }}>
        <table
          className=""
          style={{
            width: "100%",
          }}>
          <thead
            className={cn(
              "font-Popins text-black/70 bg-tableHeaderBg border-gray-200 sticky top-0 z-10",
              { [headClass]: headClass }
            )}>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  className={`py-[14px] pl-3 text-left whitespace-nowrap tracking-wide ${
                    index === 0 ? "rounded-tl-lg" : "" // rounded class
                  } ${index === columns.length - 1 ? "rounded-tr-lg" : ""}`} // rounded class
                >
                  {column.title || null}
                </th>
              ))}
            </tr>
          </thead>
          {data?.length > 0 && !loading && (
            <>
              {data.map((item, index) => {
                const isNest = Boolean(
                  nestedRowKey &&
                    item[nestedRowKey] &&
                    item[nestedRowKey].length > 1
                );

                if (isNest) {
                  nestedRow = item[nestedRowKey];
                }
                let nestContent = null;
                if (nestedRow) {
                  nestContent = nestedRow.map((nestedItem, nestedIndex) => {
                    if (nestedIndex === 0) {
                      return null;
                    }
                    return (
                      <tr
                        key={nestedIndex}
                        className={`${
                          nestedIndex === nestedRow.length - 1
                            ? "border-b"
                            : "border-b border-b-slate-900/20"
                        }`}>
                        {columns.map((column) => {
                          if (
                            column?.nestDataIndex &&
                            Object.prototype.hasOwnProperty.call(
                              nestedItem,
                              column?.nestDataIndex
                            )
                          ) {
                            return (
                              <td
                                key={column.key}
                                className={cn("py-2 pl-3 whitespace-nowrap", {
                                  [column.tdClass]: column.tdClass,
                                })}>
                                {renderNestedRow(nestedItem, column)}
                              </td>
                            );
                          } else return null;
                        })}
                      </tr>
                    );
                  });
                }
                nestedRow = null;
                return (
                  <tbody
                    onClick={handleSetValue}
                    className="bg-tableBg hover:bg-slate-900/10 cursor-pointer"
                    key={index}>
                    <tr
                      className={cn({
                        "border-b": index !== data.length - 1,
                        "border-b border-b-slate-900/20":
                          isNest && index !== data.length - 1,
                      })}>
                      {columns.map((column, colIndex) => {
                        const isNest = Boolean(
                          nestedRowKey &&
                            item[nestedRowKey] &&
                            item[nestedRowKey].length > 1
                        );
                        const isSetRowSpan = Boolean(
                          isNest && !column.renderNested
                        );
                        return (
                          <td
                            rowSpan={
                              isSetRowSpan ? item[nestedRowKey].length : 1
                            }
                            key={column.key}
                            className={cn(
                              "py-2 pl-3 whitespace-nowrap",
                              {
                                "rounded-bl-lg":
                                  index === data.length - 1 && colIndex === 0,
                              },
                              {
                                "rounded-br-lg":
                                  index === data.length - 1 &&
                                  colIndex === columns.length - 1,
                              },
                              {
                                [column.tdClass]: column.tdClass,
                              }
                            )}>
                            {renderItem(item, column)}
                          </td>
                        );
                      })}
                    </tr>
                    {nestContent || null}
                  </tbody>
                );
              })}
            </>
          )}
        </table>
        {!data?.length && !loading && (
          <div
            colSpan={columns.length}
            className="flex flex-col justify-center items-center h-full py-10">
            <BsDatabaseExclamation className="text-slate-200" size={70} />
            <span className="py-2 text-lg  text-slate-500"> Empty</span>
          </div>
        )}
        {loading && <TableLoader length={loadingUiSize} />}
      </div>
    </div>
  );
};

export default TableForLogin;

const TableLoader = ({ length = 3 }) => {
  const loaderArray = Array(length).fill("1");
  return loaderArray.map((_, index) => (
    <div
      key={index}
      className="w-full flex justify-between px-10 border-b py-2 gap-5">
      <div className="rounded w-full h-[18px] bg-slate-200 animate-pulse" />
      <div className="rounded w-full h-[18px] bg-slate-200 animate-pulse" />
      <div className="rounded w-full h-[18px] bg-slate-200 animate-pulse" />
    </div>
  ));
};
