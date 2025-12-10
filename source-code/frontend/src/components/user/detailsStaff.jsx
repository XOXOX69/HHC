import {
  CalendarOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Alert, Col, Row } from "antd";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import BtnDeleteSvg from "../UI/Button/btnDeleteSvg";
import Loader from "../loader/loader";

import EmployeeDesignation from "../UI/EmployeeDesignation";
import EmployeeTimeline from "../UI/EmployeeTimeline";

import EmployeeSalary from "../UI/EmployeeSalary";

import EmployeeAward from "../UI/EmployeeAward";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteStaff,
  loadAllStaff,
  loadSingleStaff,
} from "../../redux/rtk/features/user/userSlice";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import AwardHistoryEditPopup from "../UI/PopUp/PopUp/AwardHistoryEditPopup";
import DesignationEditPopup from "../UI/PopUp/PopUp/DesignationEditPopup";
import EducationEditPopup from "../UI/PopUp/PopUp/EducationEditPopup";
import ProfileEditPopup from "../UI/PopUp/PopUp/ProfileEditPopup";
import SalaryEditPopup from "../UI/PopUp/PopUp/SalaryEditPopup";

const DetailStaff = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const referenceDate = "2023-11-22";
  const { user, loading } = useSelector((state) => state.users);

  const handleDeleteStaff = async () => {
    await dispatch(deleteStaff(id));
    navigate(-1);
    dispatch(
      loadAllStaff({
        page: 1,
        count: 10,
        status: "true",
      })
    );
  };
  useEffect(() => {
    dispatch(loadSingleStaff(id));
  }, [dispatch, id]);

  return (
    <div>
      <UserPrivateComponent permission={"readSingle-user"}>
        {user ? (
          <div>
            <section>
              <div className="flex justify-between ant-card rounded h-auto mr-8">
                {/* Profile Card */}

                <div className="flex justify-start">
                  <div className="flex justify-center py-8 px-4 mt-4 ml-4">
                    <div className="flex flex-col items-around">
                      <h1 className="text-2xl font-bold txt-color-2 mb-1">
                        {user.username}
                      </h1>
                      <h2 className="text-base font-medium txt-color-secondary mb-1">
                        {user.designationHistory?.length
                          ? user.designationHistory[0].designation?.name
                          : "No Designation"}
                      </h2>
                      <h3 className="text-base font-medium txt-color-secondary">
                        {user?.department?.name || "No Department"}
                      </h3>
                      <h3 className="text-base font-medium txt-color-secondary">
                        {user.employeeId || "No Employee ID"}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}

                <div className="">
                  <div className="flex justify-center py-8 px-4 mt-10 mr-4">
                    <UserPrivateComponent permission="update-user">
                      <button className="mr-2 mt-2">
                        {user && <ProfileEditPopup data={user} />}
                      </button>
                    </UserPrivateComponent>
                    <UserPrivateComponent permission="delete-user">
                      <button onClick={handleDeleteStaff}>
                        <BtnDeleteSvg size={30} />
                      </button>
                    </UserPrivateComponent>
                  </div>
                </div>
              </div>
            </section>
            <Row
              className="mt-5"
              gutter={{
                xs: 8,
                sm: 16,
                md: 24,
                lg: 32,
                xl: 32,
              }}>
              <Col
                xs={24}
                sm={12}
                md={12}
                lg={11}
                xl={11}
                className="new-card rounded h-auto m-2">
                <div className="txt-color-2 text-xl text-center mt-5 ">
                  Personal Information
                </div>

                <hr className="mt-3 mb-3 new-hr" />

                <div className="m-5">
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <TeamOutlined
                        className="mr-3"
                        style={{ fontSize: "15px" }}
                      />
                      <span className="txt-color-2 font-medium">
                        Department:
                      </span>
                      <p className="txt-color-secondary ml-2">
                        {user?.department?.name
                          ? user?.department?.name
                          : "No Department "}
                      </p>
                    </li>
                    <li className="flex items-center">
                      <TrophyOutlined
                        className="mr-3"
                        style={{ fontSize: "15px" }}
                      />
                      <span className="txt-color-2 font-medium">
                        Employment Status:
                      </span>
                      <p className="txt-color-secondary ml-2">
                        {user?.employmentStatus?.name
                          ? user?.employmentStatus?.name
                          : "No Status"}
                      </p>
                    </li>

                    <li className="flex items-center">
                      <CalendarOutlined
                        className="mr-3"
                        style={{ fontSize: "15px" }}
                      />
                      <span className="txt-color-2 font-medium">
                        Join Date :
                      </span>
                      <p className="txt-color-secondary ml-2">
                        {user?.joinDate
                          ? dayjs(user?.joinDate).format("DD/MM/YYYY")
                          : "Date Not Found"}
                      </p>
                    </li>

                    <li className="flex items-center">
                      <CalendarOutlined
                        className="mr-3"
                        style={{ fontSize: "15px" }}
                      />
                      <span className="txt-color-2 font-medium">
                        Leave Date:
                      </span>
                      <p className="txt-color-secondary ml-2">
                        {user?.leaveDate
                          ? dayjs(user?.leaveDate).format("DD/MM/YYYY")
                          : "PRESENT"}
                      </p>
                    </li>

                    <li className="flex items-center">
                      <UserOutlined
                        className="mr-3"
                        style={{ fontSize: "15px" }}
                      />
                      <span className="txt-color-2 font-medium">Role :</span>
                      <p className="txt-color-secondary ml-2">
                        {user?.role?.name || "No Role"}
                      </p>
                    </li>

                    <li className="flex items-center">
                      <ClockCircleOutlined
                        className="mr-3"
                        style={{ fontSize: "15px" }}
                      />
                      <span className="txt-color-2 font-medium">Shift :</span>
                      <p className="txt-color-secondary ml-2">
                        {user?.shift?.name
                          ? `${user?.shift?.name} (${dayjs(
                              `2023-11-22T${user?.shift?.startTime}`
                            ).format("h:mm A")} - ${dayjs(
                              `2023-11-22T${user?.shift?.endTime}`
                            ).format("h:mm A")})`
                          : "Shift Not Found"}

                        {/* {user?.shift?.name} (
                        {dayjs(user?.shift?.startTime).format("h:mm A")} -{" "}
                        {dayjs(user?.shift?.endTime).format("h:mm A")}) */}
                      </p>
                    </li>
                  </ul>
                </div>
              </Col>
              <Col
                xs={24}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                className="new-card rounded h-auto m-2">
                <div className="txt-color-2 text-xl text-center mt-5 ">
                  Contact Information
                </div>

                <hr className="mt-3 mb-3 new-hr" />
                <div className="m-5">
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <MailOutlined
                        className="mr-3"
                        style={{ fontSize: "15px" }}
                      />
                      <span className="txt-color-2 font-medium">Email:</span>
                      <p className="txt-color-secondary  ml-2">
                        {user?.email || "No Email"}
                      </p>
                    </li>
                    <li className="flex items-center">
                      <PhoneOutlined
                        className="mr-3"
                        style={{ fontSize: "15px" }}
                      />
                      <span className="txt-color-2 font-medium">Phone:</span>
                      <p className="txt-color-secondary ml-2">
                        {user?.phone || "No Phone"}
                      </p>
                    </li>

                    <li className="flex items-start">
                      <HomeOutlined
                        className="mr-3"
                        style={{ fontSize: "15px" }}
                      />
                      <span className="txt-color-2 font-medium">Address:</span>
                      <div className="">
                        <li className="txt-color-secondary ml-2">
                          {" "}
                          Street : {user?.street || "No Address"}
                        </li>
                        <li className="txt-color-secondary ml-2">
                          {" "}
                          City : {user?.city || "No Address"}
                        </li>
                        <li className="txt-color-secondary ml-2">
                          {" "}
                          State : {user?.state || "No Address"}
                        </li>
                        <li className="txt-color-secondary ml-2">
                          {" "}
                          Country : {user?.country || "No Address"}
                        </li>

                        <li className="txt-color-secondary ml-2">
                          {" "}
                          Zip Code : {user?.zipCode || "No Address"}
                        </li>
                      </div>
                    </li>

                    <li className="flex items-center">
                      <ThunderboltOutlined
                        className="mr-3"
                        style={{ fontSize: "15px" }}
                      />
                      <span className="txt-color-2 font-medium">
                        Blood Group:
                      </span>
                      <p className="txt-color-secondary ml-2">
                        {user?.bloodGroup || "No Blood Group"}
                      </p>
                    </li>
                  </ul>
                </div>
              </Col>
              <Col
                xs={24}
                sm={12}
                md={12}
                lg={11}
                xl={11}
                className="new-card rounded h-auto m-2">
                <div className="flex justify-between">
                  <div className="txt-color-2 text-xl text-center mt-5 ">
                    Designation History
                  </div>

                  <UserPrivateComponent
                    permission={"update-designationHistory"}>
                    <DesignationEditPopup data={user?.designationHistory} />
                  </UserPrivateComponent>
                </div>
                <hr className="mt-3 mb-3 new-hr" />
                <div className="flex justify-start ml-10">
                  {user.designationHistory?.length ? (
                    <EmployeeDesignation list={user?.designationHistory} />
                  ) : (
                    <div className="mb-10">
                      <p className="text-center mt-3 mb-3">
                        No Designation History Found
                      </p>
                      <Alert
                        message="Not found , Click on edit button to add new"
                        type="info"
                        showIcon
                      />
                    </div>
                  )}
                </div>
              </Col>

              <Col
                xs={24}
                sm={12}
                md={12}
                lg={11}
                xl={12}
                className="new-card rounded h-auto m-2 ">
                <div className="flex justify-between">
                  <div className="txt-color-2 text-xl text-center mt-5 ">
                    Education History
                  </div>
                  <UserPrivateComponent permission={"update-education"}>
                    <EducationEditPopup data={user?.education} />
                  </UserPrivateComponent>
                </div>
                <hr className="mt-3 mb-3 new-hr" />
                <div className="flex justify-start ml-10">
                  {user?.education?.length ? (
                    <EmployeeTimeline list={user?.education} />
                  ) : (
                    <div className="mb-10">
                      <p className="text-center mt-3 mb-3">
                        No Education History Found
                      </p>
                      <Alert
                        message="Not found , Click on edit button to add new"
                        type="info"
                        showIcon
                      />
                    </div>
                  )}
                </div>
              </Col>

              <Col
                xs={24}
                sm={12}
                md={12}
                lg={11}
                xl={11}
                className="new-card rounded h-auto m-2 ">
                <div className="flex justify-between">
                  <div className="txt-color-2 text-xl text-center mt-5 ">
                    Salary History
                  </div>
                  <UserPrivateComponent permission={"update-salaryHistory"}>
                    <SalaryEditPopup data={user?.salaryHistory} />
                  </UserPrivateComponent>
                </div>
                <hr className="mt-3 mb-3 new-hr" />
                <div className="flex justify-start ml-10">
                  {user.salaryHistory?.length ? (
                    <EmployeeSalary list={user?.salaryHistory} />
                  ) : (
                    <div className="mb-10">
                      <p className="text-center mt-3 mb-3 ">
                        No Education History Found
                      </p>
                      <Alert
                        message="Not found , Click on edit button to add new"
                        type="info"
                        showIcon
                      />
                    </div>
                  )}
                </div>
              </Col>

              <Col
                xs={24}
                sm={12}
                md={12}
                lg={11}
                xl={12}
                className="new-card rounded h-auto m-2 ">
                <div className="flex justify-between">
                  <div className="txt-color-2 text-xl text-center mt-5 ">
                    Award History
                  </div>

                  <UserPrivateComponent permission={"update-awardHistory"}>
                    <AwardHistoryEditPopup data={user?.awardHistory} />
                  </UserPrivateComponent>
                </div>
                <hr className="mt-3 mb-3 new-hr" />
                <div className="flex justify-start ml-10">
                  {user.awardHistory?.length ? (
                    <EmployeeAward list={user?.awardHistory} />
                  ) : (
                    <div className="mb-10">
                      <p className="text-center mt-3 mb-3 ">
                        No Award History Found
                      </p>
                      <Alert
                        message="Not found , Click on edit button to add new"
                        type="info"
                        showIcon
                      />
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        ) : (
          <div className="mt-10">{loading && <Loader />}</div>
        )}
      </UserPrivateComponent>
    </div>
  );
};

export default DetailStaff;
