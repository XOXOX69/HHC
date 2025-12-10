import { Table } from "antd";
import { forwardRef, useRef } from "react";
import { useReactToPrint } from "react-to-print";

const PrintToPdf = forwardRef(({ title, list, columns }, ref) => {
  return (
    <div ref={ref} className="p-3">
      <h1 className="text-center text-semibold mb-3  text-[18px]">{title}</h1>
      <Table
        columns={columns}
        dataSource={
          !!list?.length && list.map((item) => ({ ...item, key: item?.id }))
        }
        pagination={false}
      />
    </div>
  );
});

PrintToPdf.displayName = "printToPdf";

export default function PrintPdf({ title, list, columns }) {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <div className="hidden">
        <PrintToPdf
          ref={componentRef}
          list={list}
          columns={columns.slice(0, -1)}
          title={title}
        />
      </div>
      <div className="inline-block min-w-[110px]" onClick={handlePrint}>
        Print PDF
      </div>
    </>
  );
}
