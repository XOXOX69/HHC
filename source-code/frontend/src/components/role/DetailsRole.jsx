import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../loader/loader";

import Card from "@/UI/Card";
import {
  addPermission,
  loadAllPermission,
} from "@/redux/rtk/features/hr/role/permissionSlice";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { loadSingleRole } from "../../redux/rtk/features/hr/role/roleSlice";

const DetailRole = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [selectedIds, setSelectedIds] = useState([]);
  const [disabled, setChanged] = useState(true);
  const [loader, setLoader] = useState(false);

  const { list: permissions } = useSelector((state) => state.permission);

  const data = useMemo(() => dataTransform(permissions), [permissions]);
  const { role, loading } = useSelector((state) => state.role);

  const handleSelectRow = (i, type) => {
    const a = data[i].map((item) => item.id);
    setSelectedIds((prev) => {
      const localData = [...prev];
      a.forEach((item) => {
        const index = localData.indexOf(item);
        if (index !== -1) {
          localData.splice(index, 1);
        }
      });

      if (type) {
        const newArray = localData.concat(a);
        return newArray;
      } else {
        return localData;
      }
    });
  };

  const handleSelectCol = (rowName, type) => {
    setSelectedIds((prev) => {
      const localData = [...prev];
      const a = permissions
        ?.filter((item) => item.name.includes(rowName))
        .map((item) => item.id);

      a.forEach((item) => {
        const index = localData.indexOf(item);
        if (index !== -1) {
          localData.splice(index, 1);
        }
      });

      if (type) {
        const newArray = localData.concat(a);
        return newArray;
      } else {
        return localData;
      }
    });
  };

  const handleChange = async (newId) => {
    setSelectedIds((prev) => {
      const localArray = [...prev];
      const index = localArray.indexOf(newId);
      if (index !== -1) {
        localArray.splice(index, 1);
      } else {
        localArray.push(newId);
      }

      return localArray;
    });
  };

  const onSubmit = async () => {
    setLoader(true);
    const resp = await dispatch(
      addPermission({ roleId: parseInt(id), permissionId: selectedIds })
    );
    if (resp.payload.message === "success") {
      dispatch(loadSingleRole(id));
    }
    setLoader(false);
  };

  useEffect(() => {
    role &&
      setSelectedIds(role?.rolePermission.map((item) => item.permissionId));
  }, [role]);

  useEffect(() => {
    dispatch(loadSingleRole(id));
    dispatch(loadAllPermission());
  }, [dispatch, id]);

  useEffect(() => {
    if (role) {
      const realPermissions =
        role.rolePermission.map((item) => item.permissionId) || [];
      realPermissions.sort();
      const localPermissions = [...selectedIds];
      localPermissions.sort();
      if (
        JSON.stringify(realPermissions) !== JSON.stringify(localPermissions)
      ) {
        setChanged(false);
      } else {
        setChanged(true);
      }
    }
  }, [role, selectedIds]);

  let content = null;
  if (loading) {
    content = <Loader />;
  } else if (!loading && role) {
    content = (
      <Card
        className='max-md:border-0 max-md:bg-white'
        bodyClass='max-md:p-0 '
        headClass='border-none'
        title={"Permissions of " + role?.name}
        extra={
          <>
            <Button
              disabled={disabled}
              loading={loader}
              type='primary'
              className=''
              onClick={onSubmit}
            >
              Permit now
            </Button>
          </>
        }
      >
        <div className='tableScrollBar overflow-y-auto w-full'>
          <div className='max-h-[calc(100vh-165px)]'>
            <table className='border-collapse w-full '>
              <thead className='font-Popins text-black/70 bg-tableHeaderBg  border-gray-200 sticky top-[-1px] z-10'>
                <tr>
                  <th className='border'>Permission Name</th>
                  <th className='border'>
                    <div className='flex items-center justify-center'>
                      <input
                        onChange={(e) =>
                          handleSelectCol("create-", e.target.checked)
                        }
                        type='checkbox'
                        className='mr-2'
                      />
                      <span>Create</span>
                    </div>
                  </th>
                  <th className='border py-2'>
                    <div className='flex items-center justify-center'>
                      <input
                        onChange={(e) =>
                          handleSelectCol("delete-", e.target.checked)
                        }
                        type='checkbox'
                        className='mr-2'
                      />
                      <span>Delete</span>
                    </div>
                  </th>
                  <th className='border py-2'>
                    <div className='flex items-center justify-center'>
                      <input
                        onChange={(e) =>
                          handleSelectCol("readAll-", e.target.checked)
                        }
                        type='checkbox'
                        className='mr-2'
                      />
                      <span>Read All</span>
                    </div>
                  </th>
                  <th className='border py-2'>
                    <div className='flex items-center justify-center'>
                      <input
                        onChange={(e) =>
                          handleSelectCol("readSingle-", e.target.checked)
                        }
                        type='checkbox'
                        className='mr-2'
                      />
                      <span>Read Single</span>
                    </div>
                  </th>
                  <th className='border py-2'>
                    <div className='flex items-center justify-center'>
                      <input
                        onChange={(e) =>
                          handleSelectCol("update-", e.target.checked)
                        }
                        type='checkbox'
                        className='mr-2'
                      />
                      <span>Update</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(data).map((item) => {
                  return (
                    <tr key={item} className=''>
                      <td className='border pl-4'>
                        <input
                          title='Select Row'
                          type='checkbox'
                          onChange={(e) =>
                            handleSelectRow(item, e.target.checked)
                          }
                          className='mr-4'
                        />

                        {item}
                      </td>
                      {data[item].map((d) => {
                        const isTrue = selectedIds.find((rol) => rol === d.id);
                        return (
                          <td
                            className='border align-middle text-center'
                            key={d.id}
                          >
                            <input
                              disabled={loading}
                              onChange={(e) => handleChange(d.id)}
                              checked={Boolean(isTrue)}
                              type='checkbox'
                            />
                          </td>
                        );
                        
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    );
  }

  return content;
};

export default DetailRole;

function dataTransform(data) {
  if (!Array.isArray(data)) return {};

  function convertToReadableText(inputString) {
    const words = inputString.match(/[A-Z]?[a-z]+/g) || [];
    const readableText = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return readableText;
  }

  const permissionNameArray = data
    .filter((item) => item.name.includes("create"))
    .map((item) => item.name.replace("create-", ""));

  const temp = {};

  permissionNameArray.forEach((name) => {
    const newArr = data.filter((item) => item.name.split("-")[1] === name);
    newArr.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    temp[convertToReadableText(name)] = newArr;
  });

  return temp;
}
