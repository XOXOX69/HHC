import { Card } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadTrailBalance } from "../../redux/rtk/features/account/accountSlice";

const TrialBalance = () => {
  const dispatch = useDispatch();
  const { trailBalance: data, loading } =
    useSelector((state) => state?.accounts) || [];
  //make a use effect to get the data from the getTrailBalance function
  useEffect(() => {
    dispatch(loadTrailBalance());
  }, [dispatch]);
  return (
    <>
      <Card loading={loading}>
        <div>
          <div className='card-title flex justify-between'>
            <h5 className='text-xl mb-3'>
              <span className='ml-2 report-section-card-title'>
                Trail Balance
              </span>
            </h5>
          </div>
          <div className='border-gray-200 w-full rounded bg-white overflow-x-auto'>
            <table className='table report-section-table w-full'>
              <thead className='font-Popins text-black/70 bg-tableHeaderBg border-gray-200'>
                <tr className='border-b border-gray'>
                  <th
                    scope='col'
                    className='py-[14px] pl-3 text-left whitespace-nowrap tracking-wide'
                  >
                    Account
                  </th>
                  <th
                    scope='col'
                    className='py-[14px] pl-3 text-left whitespace-nowrap tracking-wide'
                  >
                    Debit
                  </th>
                  <th
                    scope='col'
                    className='py-[14px] pl-3 text-left whitespace-nowrap tracking-wide'
                  >
                    Credit
                  </th>
                </tr>
              </thead>
              <tbody className='bg-tableBg'>
                {data &&
                  data?.debits?.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className='hover:bg-slate-900/10 border-b'
                      >
                        <td className='py-2 pl-3 whitespace-nowrap'>
                          {item.subAccount}
                        </td>
                        <td className='py-2 pl-3 whitespace-nowrap'>
                          {item.balance ? Number(item.balance).toFixed(3) : ""}
                        </td>
                        <td className='py-2 pl-3 whitespace-nowrap'></td>
                      </tr>
                    );
                  })}
                {data &&
                  data?.credits?.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className='hover:bg-slate-900/10 border-b'
                      >
                        <td className='py-2 pl-3 whitespace-nowrap'>
                          {item.subAccount}
                        </td>
                        <td className='py-2 pl-3 whitespace-nowrap'></td>
                        <td className='py-2 pl-3 whitespace-nowrap'>
                          {item.balance ? Number(item.balance).toFixed(3) : ""}
                        </td>
                      </tr>
                    );
                  })}

                <tr className='hover:bg-gray-100 hover:cursor-pointer font-semibold'>
                  <td className='py-4 px-6 border-b border-gray-200 text-gray-900 text-sm '>
                    TOTAL
                  </td>
                  <td className='py-4 px-6 border-b border-gray-200 text-gray-900 text-sm'>
                    {data?.totalDebit
                      ? Number(data?.totalDebit).toFixed(3)
                      : "-"}
                  </td>
                  <td className='py-4 px-6 border-b border-gray-200 text-gray-900 text-sm'>
                    {data?.totalCredit
                      ? Number(data?.totalCredit).toFixed(3)
                      : "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </>
  );
};

export default TrialBalance;
