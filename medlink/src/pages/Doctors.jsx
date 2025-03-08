import React, { useState, useEffect, useContext } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Modal from "@mui/material/Modal";
import { IoMdClose } from "react-icons/io";
import useDocTitle from "../hooks/useDocTitle";
import { AiFillStar } from "react-icons/ai";
import { TbPointFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import httpClient from "../httpClient";
import { IoMdRefresh } from "react-icons/io";
import { FaVideo } from "react-icons/fa";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";

const Doctors = () => {
  useDocTitle("Doctors");

  const { isLoading, toggleLoading } = useContext(commonContext);

  const [meetModal, setMeetModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [isInstantMeet, setInstantMeet] = useState(false);
  const [isConnecting, setConnecting] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  // Set this to user's balance amount

  const navigate = useNavigate();
  const userNotExists =
    localStorage.getItem("usertype") === undefined ||
    localStorage.getItem("usertype") === null;

  useEffect(() => {
    if (userNotExists) {
      navigate("/");
    } else {
      fetchDoctors();
    }
    //eslint-disable-next-line
  }, []);

  function fetchDoctors() {
    setFetchingData(true);
    toggleLoading(true);
    httpClient
      .get("/get_status")
      .then((res) => {
        setDoctors(res.data.details);
        // console.log(doctors)
        toggleLoading(false);
        setFetchingData(false);
      })
      .catch(() => {
        // console.log(res)
        toggleLoading(false);
        setFetchingData(false);
      });
  }

  const doctorNames = doctors.map(
    (item) =>
      "Dr. " +
      item.username
        .split(" ")
        .map((item) => item[0].toUpperCase() + item.slice(1).toLowerCase())
        .join(" ")
  );
  const [selectedDoc, setSelectedDoc] = useState(doctorNames[0]);
  const [selectedDocStatus, setSelectedDocStatus] = useState(false);
  const [selectedDocAvailable, setSelectedDocAvailable] = useState(false);
  const [selectEmail, setSelectEmail] = useState("");
  const [message, setMessage] = useState("");

  const handlemeet = () => {
    const time = new Date().getTime();
    console.log(time);
    httpClient
      .post("/meet_status", { email: selectEmail })
      .then((res) => {
        if (res.status === 200) {
          httpClient
            .put("/make_meet", {
              email: selectEmail,
              link: `/instant-meet?meetId=${time}&selectedDoc=${selectedDoc}&selectedMail=${encodeURIComponent(
                selectEmail
              )}&name=${localStorage.getItem(
                "username"
              )}&age=${localStorage.getItem(
                "age"
              )}&gender=${localStorage.getItem(
                "gender"
              )}&pemail=${localStorage.getItem("email")}&fee=${350}`,
              patient: localStorage.getItem("username"),
            })
            .then((res) => {
              setTimeout(() => {
                httpClient
                  .post("/currently_in_meet", { email: selectEmail })
                  .then((res) => {
                    if (res.data.curmeet) {
                      setConnecting(false);
                      navigate(
                        `/instant-meet?meetId=${time}&selectedDoc=${selectedDoc}&selectedMail=${encodeURIComponent(
                          selectEmail
                        )}&name=${localStorage.getItem(
                          "username"
                        )}&age=${localStorage.getItem(
                          "age"
                        )}&gender=${localStorage.getItem(
                          "gender"
                        )}&pemail=${localStorage.getItem("email")}fee=${350}`
                      );
                    } else {
                      httpClient.put("/delete_meet", { email: selectEmail });
                      setConnecting(false);
                      setMessage(res.data.message);
                    }
                  });
              }, 20000);
            })
            .catch(() => {
              // console.log(res)
            });
        } else {
          setConnecting(false);
          setMessage(res.data.message);
        }
      })
      .catch(() => {
        // console.log(res)
      });
  };

  const columns = [
    {
      field: "id",
      headerName: "#",
      headerAlign: "center",
      align: "center",
      width: 100,
    },
    {
      field: "username",
      headerName: "Doctor",
      headerAlign: "center",
      align: "left",
      width: 150,
      renderCell: (params) => {
        const fullname =
          "Dr. " +
          params.row.username
            .split(" ")
            .map((item) => item[0].toUpperCase() + item.slice(1).toLowerCase())
            .join(" ");
        return <div className="name-column--cell">{fullname}</div>;
      },
    },
    {
      field: "email",
      headerName: "Email",
      headerAlign: "center",
      align: "left",
      width: 150,
    },
    {
      field: "gender",
      headerName: "Gender",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: (params) => {
        return (
          <>
            {params.row.gender[0].toUpperCase() +
              params.row.gender.slice(1).toLowerCase()}
          </>
        );
      },
    },
    {
      field: "specialization",
      headerName: "Specialization",
      headerAlign: "center",
      align: "center",
      width: 150,
    },
    {
      field: "languages",
      headerName: "Languages",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: () => {
        return <div className="social-column--cell">English / Hindi</div>;
      },
    },
    {
      field: "ratings",
      headerName: "Ratings",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="ratings-column--cell">
            {params.row.noOfAppointments ? (
              <>
                {(params.row.noOfStars / params.row.noOfAppointments).toFixed(
                  1
                )}{" "}
                <AiFillStar className="ratings-icon" />
              </>
            ) : (
              <>
                0 <AiFillStar className="ratings-icon" />
              </>
            )}
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="status-column--cell">
            <TbPointFilled
              className={`${
                params.row.status === "online" ? "green-icon" : "red-icon"
              }`}
            />{" "}
            {params.row.status}
          </div>
        );
      },
    },
    {
      field: "appointments",
      headerName: "Book an Appointment",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="appointment-column--cell">
            <button
              onClick={() => {
                setSelectEmail(params.row.email);
                setSelectedDocStatus(params.row.status === "online");
                setSelectedDocAvailable(params.row.isInMeet);
                setInstantMeet(false);
                setSelectedDoc(
                  "Dr. " +
                    params.row.username
                      .split(" ")
                      .map(
                        (item) =>
                          item[0].toUpperCase() + item.slice(1).toLowerCase()
                      )
                      .join(" ")
                );
                setMeetModal(true);
              }}
            >
              BOOK
            </button>
          </div>
        );
      },
    },
  ];

  useScrollDisable(isLoading);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <>
      <div id="doctors-page">
        <div className="doctor-details">
          <div className="heading">
            <h3>Doctor Details</h3>
            <div className="refresh-btn" onClick={fetchDoctors}>
              <span className={`${fetchingData ? "active" : ""}`}>
                <IoMdRefresh className="refresh-icon" />
              </span>
              <div className="refresh-tooltip tooltip">Refresh details</div>
            </div>
          </div>
          <DataGrid
            className="doctor-details-table"
            rows={doctors}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        </div>
      </div>
      <Modal
        open={meetModal}
        onClose={() => {
          setMessage("");
          setMeetModal(false);
          setConnecting(false);
        }}
      >
        <div
          id="meet-modal"
          style={{
            width: `${
              !selectedDocAvailable && selectedDocStatus
                ? "min(570px, 90vw)"
                : "min(400px, 90vw)"
            }`,
          }}
        >
          <div className="close_btn_div">
            <IoMdClose
              onClick={() => {
                setMessage("");
                setMeetModal(false);
                setConnecting(false);
                httpClient.put("/delete_meet", { email: selectEmail });
              }}
            />
          </div>
          <div className="meet-details-div">
            <h3>Wanna meet?</h3>
            <div className="meet-details">
              {selectedDocStatus && !selectedDocAvailable && (
                <div
                  className="create-meet"
                  onClick={() => {
                    setInstantMeet(!isInstantMeet);
                    setConnecting(false);
                  }}
                >
                  Create an Instant meet
                </div>
              )}
              {(message || (selectedDocStatus && selectedDocAvailable)) && (
                <div className="not-available-note">
                  Oops! {selectedDoc} is currently in another meet, you can wait
                  a few minutes.{" "}
                </div>
              )}
            </div>
          </div>

          {isInstantMeet &&
            (isConnecting ? (
              <div className="instant-meet-div">
                <div className="loader">
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                </div>
                <div>Connecting...</div>
              </div>
            ) : (
              <div className="instant-meet-div">
                <button
                  onClick={() => {
                    setConnecting(true);
                    handlemeet();
                  }}
                >
                  Connect <FaVideo />
                </button>
              </div>
            ))}
        </div>
      </Modal>
    </>
  );
};

export default Doctors;
