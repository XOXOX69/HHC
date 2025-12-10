import dayjs from "dayjs";
import React from "react";
import { deleteSalaryHistory } from "../../redux/rtk/features/salaryHistory/salaryHistorySlice";
import CommonDelete from "../CommonUi/CommonDelete";
import BtnDeleteSvg from "./Button/btnDeleteSvg";
import SalaryEditSinglePopup from "./PopUp/PopUp/SalaryEditSinglePopup";
import SalaryTimelineSvg from "./SalaryTimelineSVG";
import { loadSingleStaff } from "../../redux/rtk/features/user/userSlice";
import { useParams } from "react-router-dom";

const EmployeeSalary = ({ list, edit, setLoading }) => {
    const { id } = useParams("id");
  return (
    <div>
      <main className='container mx-auto w-full flex justify-center mt-5'>
        <ol className='border-l-2 border-slate-600'>
          {list &&
            list?.map((item, index) => {
              return (
                <li key={index}>
                  <div className='md:flex flex-start'>
                    <SalaryTimelineSvg />
                    <div className='block p-6  max-w-md ml-6 mb-5 '>
                      <div className='flex justify-between mb-4'>
                        <h3 className='font-medium text-base mr-20 w-500 txt-color-2'>
                          Salary : {item?.salary}
                        </h3>
                        <h3 className='font-medium text-base mr-20 w-500 txt-color-2'>
                          {dayjs(item?.startDate).format("MMM YYYY")} -{" "}
                          {item?.endDate
                            ? dayjs(item?.endDate).format("MMM YYYY")
                            : "Present"}
                        </h3>
                        {edit && (
                          <div>
                            <SalaryEditSinglePopup
                              data={item}
                              setLoading={setLoading}
                            />

                            <CommonDelete
                              permission={"delete-salaryHistory"}
                              icon={
                                <button>
                                  <BtnDeleteSvg size={20} />
                                </button>
                              }
                              deleteThunk={deleteSalaryHistory}
                              id={item.id}
                              loadThunk={loadSingleStaff}
                              query={id}
                            />
                          </div>
                        )}
                      </div>

                      <h3 className='font-medium text-sm mr-20 w-500 txt-color-2'>
                        Comment :{" "}
                        <span className='font-medium text-sm txt-color-secondary'>
                          {item?.comment}
                        </span>
                      </h3>
                      <h3 className='font-medium text-sm mr-20 w-500 txt-color-2'>
                        Start Date :{" "}
                        <span className='font-medium text-sm txt-color-secondary'>
                          {" "}
                          {dayjs(item?.startDate).format("DD/MM/YYYY")}
                        </span>
                      </h3>

                      <h3 className='font-medium text-sm mr-20 w-500 txt-color-2'>
                        End Date :{" "}
                        <span className='font-medium text-sm txt-color-secondary'>
                          {item.endDate
                            ? dayjs(item?.endDate).format("DD/MM/YYYY")
                            : "Present"}
                        </span>
                      </h3>
                    </div>
                  </div>
                </li>
              );
            })}
        </ol>
      </main>
    </div>
  );
};

export default EmployeeSalary;
