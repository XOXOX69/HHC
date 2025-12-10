import { CSVLink } from "react-csv";
import Button from "./Button";

export default function CSV({
  columns,
  list,
  title,
  className,
  btnName,
  notButton,
}) {
  if (!Array.isArray(list) || !Array.isArray(columns)) return null;

  const newList = list.map((item) => {
    const data = {};
    columns.forEach((column) => {
      if (column.csvOff) return null;
      if (column.renderCsv && typeof column.renderCsv === "function") {
        if (!column.dataIndex)
          return (data[column.title] = column.renderCsv(item));
        return (data[column.title] = column.renderCsv(
          item[column.dataIndex],
          item
        ));
      }

      if (!column.dataIndex) return (data[column.title] = item);
      return (data[column.title] = item[column.dataIndex]);
    });

    return data;
  });

  return (
    <>
      {notButton ? (
        <CSVLink
          data={newList ? newList : ""}
          className=""
          filename={title || "data"}
        >
          {btnName ? btnName : "Download CSV"}
        </CSVLink>
      ) : (
        <Button color="gray">
          <CSVLink
            data={newList ? newList : ""}
            className="text-white rounded"
            filename={title || "data"}
          >
            {btnName ? btnName : "Download CSV"}
          </CSVLink>
        </Button>
      )}
    </>
  );
}
