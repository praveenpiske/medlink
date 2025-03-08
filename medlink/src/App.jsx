import React from "react";
import { CommonProvider } from "./contexts/common/commonContext";
import Header from "./components/common/Header";
import RouterRoutes from "./routes/RouterRoutes";
import Footer from "./components/common/Footer";
import httpClient from "./httpClient";

const App = () => {

    setInterval(() => {
      (localStorage.getItem("usertype") === "doctor" && 
      httpClient.post('make_meet', { email: localStorage.getItem('email') })
        .then((res) => {
          if (res.data.link !== null) {
            localStorage.setItem("curpname", res.data.link['name']);
            localStorage.setItem("curmlink", res.data.link['link']);
            localStorage.setItem("setSearchPatient", true);
            localStorage.setItem("searching", 2);
          }
          else {
            localStorage.setItem("setSearchPatient", false);
            localStorage.setItem("curpname", "");
            localStorage.setItem("curmlink", "");
            localStorage.setItem("searching", 1);
          }
        })
        .catch((err) => {
          console.log(err);
        }))
    }, 25000);

  return (
    <>
      <CommonProvider>
        <Header />
        <RouterRoutes />
        <Footer />
      </CommonProvider>
    </>
  );
};

export default App;
