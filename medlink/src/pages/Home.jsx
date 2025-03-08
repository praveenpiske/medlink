import React, { useState, useEffect, useContext } from "react";
import Modal from "@mui/material/Modal";
import useDocTitle from "../hooks/useDocTitle";
import { IoMdClose } from "react-icons/io";
import { IoCheckmarkDone } from "react-icons/io5";
import { Alert } from "@mui/material";
import { BsEmojiSmile } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { HiUserGroup } from "react-icons/hi";
import { FaVideo } from "react-icons/fa";
import httpClient from "../httpClient";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";

const Home = () => {
  useDocTitle("Home");
  const navigate = useNavigate();

  const { isLoading } = useContext(commonContext);

  const [haslastMeet, setHasLastMeet] = useState(
    localStorage.getItem("lastMeetWith") !== undefined &&
      localStorage.getItem("lastMeetWith") !== null &&
      localStorage.getItem("lastMeetWith") !== "null"
  );
  const [searchPatient, setSearchPatient] = useState(
    localStorage.getItem("setSearchPatient") !== undefined &&
      localStorage.getItem("setSearchPatient") !== null &&
      localStorage.getItem("setSearchPatient") === "true"
  );
  const isDoctor = localStorage.getItem("usertype") === "doctor";
  const [searching, setSearching] = useState(
    localStorage.getItem("searching") !== undefined &&
      localStorage.getItem("searching") !== null
      ? localStorage.getItem("searching") === "2"
        ? 2
        : 1
      : 0
  );
  const [patient_name, setPatient_name] = useState(
    localStorage.getItem("curpname") !== undefined &&
      localStorage.getItem("curpname") !== null &&
      localStorage.getItem("curpname") !== "null"
      ? localStorage.getItem("curpname")
      : ""
  );
  const [meetlink, setMeetlink] = useState(
    localStorage.getItem("curmlink") !== undefined &&
      localStorage.getItem("curmlink") !== null &&
      localStorage.getItem("curmlink") !== "null"
      ? localStorage.getItem("curmlink")
      : ""
  );
  const [doctormail, setDoctorMail] = useState("");
  const [isAlert, setIsAlert] = useState("");
  const [availablemodal, setAvailablemodal] = useState(false);
  const [alertmessage, setAlertmessage] = useState("");
  const [available, setAvailable] = useState(
    localStorage.getItem("available") === undefined ||
      localStorage.getItem("available") === null ||
      localStorage.getItem("available") === "true"
  );
  const [isVerified, setVerified] = useState(
    localStorage.getItem("verified") !== undefined &&
      localStorage.getItem("verified") !== null &&
      localStorage.getItem("verified") === "true"
  );
  const [verCont, setVerCont] = useState(
    "Your Account is not verified yet! Please wait until you're verified!!"
  );
  const [verAlert, setVerAlert] = useState(false);

  const searchmeet = () => {
    setSearchPatient(true);
    setSearching(0);
    httpClient
      .post("make_meet", { email: localStorage.getItem("email") })
      .then((res) => {
        console.log(res.data);
        if (res.data.link === null) {
          setTimeout(() => {
            setSearching(1);
          }, 1000);
          setTimeout(() => {
            setSearchPatient(false);
          }, 2000);
        } else {
          setPatient_name(res.data.link["name"]);
          setMeetlink(res.data.link["link"]);
          setTimeout(() => {
            setSearching(2);
          }, 2000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  
  {
    localStorage.getItem("usertype") === "doctor" &&
      setInterval(() => {
        setMeetlink(localStorage.getItem("curmlink"));
        setPatient_name(localStorage.getItem("curpname"));
        setSearching(
          localStorage.getItem("searching") === "2"
            ? 2
            : localStorage.getItem("searching") === "1"
            ? 1
            : 0
        );
        setSearchPatient(
          localStorage.getItem("setSearchPatient") === "true" ? true : false
        );
      }, 10000);
  }

  const iamavailable = () => {
    setIsAlert("success");
    setAlertmessage("Now, patients can meet you");
    setAvailablemodal(false);
    setTimeout(() => {
      httpClient.put("/doctor_avilability", {
        email: localStorage.getItem("email"),
      });
      setIsAlert("");
      setAlertmessage("");
      setAvailable(true);
      localStorage.setItem("available", true);
    }, 3000);
  };

  const iamnotavailable = () => {
    setIsAlert("error");
    setAlertmessage("Now, patients can't meet you");
    setAvailablemodal(false);
    setTimeout(() => {
      httpClient.put("/doc_status", { email: localStorage.getItem("email") });
      setIsAlert("");
      setAlertmessage("");
      setAvailable(false);
      localStorage.setItem("available", false);
    }, 3000);
  };

  const check = () => {
    httpClient
      .post("/verify", { email: localStorage.getItem("email") })
      .then((res) => {
        console.log(res.data);
        if (res.data.verified) {
          console.log(res.data.verified);
          setVerCont("Yayy! Your Account is verified!!");
          setVerAlert(true);
          setTimeout(() => {
            setVerified(true);
          }, 2000);
          localStorage.setItem("verified", true);
        } else {
          setVerCont("Oops! Your Account isn't verfied yet!!");
          setVerAlert(false);
          setTimeout(() => {
            setVerCont(
              "Your Account is not verified yet! Please wait until you're verified!!"
            );
            setVerified(false);
          }, 2000);
          localStorage.setItem("verified", false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useScrollDisable(isLoading);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <>
      <div id="home-page">
        {isDoctor && !isVerified && (
          <Alert
            severity={verAlert ? "success" : "error"}
            style={{
              position: "fixed",
              top: "50px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {verCont}
          </Alert>
        )}

        {isDoctor && !isVerified && (
          <div className="check-verify-status">
            <h3>Wanna check your verification status? </h3>
            <button onClick={check}>Check</button>
          </div>
        )}

        {isDoctor && (
          <div className="is-meet-div">
            <div className="meet-bg"></div>
            <div className="main">
              <div className="content-div">
                <h2>Is there any patient waiting?</h2>
                <p>Search for a patient now</p>
              </div>
              <div className="test-btn">
                <button
                  onClick={() => {
                    searchmeet();
                  }}
                  disabled={!isVerified}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        )}

        {isDoctor && isVerified && (
          <div
            className="make-available"
            onClick={() => setAvailablemodal(true)}
          >
            {isAlert !== "" && (
              <Alert severity={isAlert} className="avilability_alert">
                {alertmessage}
              </Alert>
            )}
            Set your availability
            <span
              className={`doctor_status ${available ? "available" : ""}`}
            ></span>
          </div>
        )}
      </div>
      <Modal
        open={haslastMeet && isDoctor}
        onClose={() => {
          localStorage.setItem("lastMeetWith", null);
          setHasLastMeet(false);
        }}
      >
        <div id="feedback-modal">
          <div className="close_btn_div">
            <IoMdClose
              onClick={() => {
                localStorage.setItem("lastMeetWith", null);
                httpClient.put("/delete_meet", { email: doctormail });
                setHasLastMeet(false);
              }}
            />
          </div>
          <div className="doctor-feedback">
            <h3>
              Thank You <BsEmojiSmile />{" "}
            </h3>
            <div className="thankyou-note">
              Thank you, {localStorage.getItem("username")}!!
              <br /> You just treated one more life!
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={searchPatient}
        onClose={() => {
          // httpClient.put('/delete_meet', { email: localStorage.getItem("email")})
          setSearchPatient(false);
        }}
      >
        <div id="search-patient-modal">
          <div className="close_btn_div">
            <IoMdClose
              onClick={() => {
                // httpClient.put('/delete_meet', { email: localStorage.getItem("email")})
                setSearchPatient(false);
              }}
            />
          </div>
          {searching === 0 && (
            <div className="searching-div">
              <div className="search-div">
                <HiUserGroup className="patients-icon" />
                <div className="circle">
                  <div className="search-img-div">
                    <img
                      className="search-img"
                      src="search-img.png"
                      alt="searching"
                    />
                  </div>
                </div>
              </div>
              <h3>Searching...</h3>
            </div>
          )}
          {searching === 1 && (
            <div className="searching-div">
              <div className="search-div">
                <HiUserGroup className="patients-icon" />
                <div className="done-icon-div">
                  <IoCheckmarkDone className="done-icon" />
                </div>
              </div>
              <h3>No Patients Found!</h3>
            </div>
          )}
          {searching === 2 && (
            <div className="searching-div">
              <h3>Patient Found!</h3>
              <div className="connect-details">
                <div>Name: {patient_name}</div>
                <div className="connect-div">
                  <button
                    onClick={() => {
                      httpClient.post("meet_status", {
                        email: localStorage.getItem("email"),
                      });
                      httpClient
                        .put("/currently_in_meet", {
                          email: localStorage.getItem("email"),
                        })
                        .then((res) => {
                          setSearchPatient(false);
                          localStorage.setItem("setSearchPatient", false);
                          navigate(`${meetlink}`);
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }}
                  >
                    Connect now <FaVideo />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        open={availablemodal}
        onClose={() => {
          setAvailablemodal(false);
        }}
      >
        <div id="available-modal">
          <div className="close_btn_div">
            <IoMdClose
              onClick={() => {
                setAvailablemodal(false);
              }}
            />
          </div>
          <div className="available-details">
            <div className="note" onClick={() => iamavailable()}>
              Yes, I am available!
            </div>
            <div className="note" onClick={() => iamnotavailable()}>
              No, I am not available!
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Home;
