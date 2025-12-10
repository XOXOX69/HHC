import { Popover } from "antd";
import { BsDatabaseExclamation, BsThreeDots } from "react-icons/bs";
import { cn } from "../utils/functions";
import Menu from "./Menu";
const Table = ({
  columns,
  data,
  loading = false,
  loadingUiSize = 5,
  scroll = {},
  className,
  headClass,
}) => {
  const renderItem = (item, column) => {
    if (column?.key === "action" && column?.render) {
      return (
        <Popover
          content={<Menu items={column.render(item)} />}
          placement='bottomRight'
          arrow={false}
          trigger='click'
        >
          <BsThreeDots className='cursor-pointer text-base mr-2' />
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

  return (
    <div className='tableContainer tableScrollBar overflow-y-auto w-full'>
      <div
        style={{
          maxHeight: scroll.y ? `${scroll.y}px` : "auto",
        }}
      >
        <table
          className=''
          style={{
            width: "100%",
          }}
        >
          <thead
            className={cn(
              "font-Popins text-black/70 bg-tableHeaderBg border-gray-200 sticky top-0 z-10",
              { [headClass]: headClass }
            )}
          >
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
            <tbody className={cn("bg-tableBg", { [className]: className })}>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className={`hover:bg-slate-900/10 ${
                    index === data.length - 1 ? "" : "border-b"
                  }`}
                >
                  {columns.map((column, colIndex) => (
                    <td
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
                      )}
                    >
                      {renderItem(item, column)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {!data?.length && !loading && (
          <div
            colSpan={columns.length}
            className='flex flex-col justify-center items-center h-full py-10'
          >
            <BsDatabaseExclamation className='text-slate-200' size={70} />
            <span className='py-2 text-lg  text-slate-500'> Empty</span>
          </div>
        )}
        {loading && <TableLoader length={loadingUiSize} />}
      </div>
    </div>
  );
};

export default Table;

const TableLoader = ({ length = 3 }) => {
  const loaderArray = Array(length).fill("1");
  return loaderArray.map((_, index) => (
    <div
      key={index}
      className='w-full flex justify-between px-10 border-b py-2 gap-5'
    >
      <div className='rounded w-full h-[18px] bg-slate-200 animate-pulse' />
      <div className='rounded w-full h-[18px] bg-slate-200 animate-pulse' />
      <div className='rounded w-full h-[18px] bg-slate-200 animate-pulse' />
    </div>
  ));
};
