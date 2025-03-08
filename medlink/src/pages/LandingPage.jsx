import React, { useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import useDocTitle from "../hooks/useDocTitle";
import { MdAccountCircle } from "react-icons/md";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { MdExpandMore } from 'react-icons/md';
import { AiFillLinkedin, AiFillGithub } from 'react-icons/ai';
import { IoMdMail } from "react-icons/io";
import { TbStethoscope, TbHeartPlus } from "react-icons/tb";
import { BsRobot } from "react-icons/bs";
import { GiMedicines } from "react-icons/gi";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { IoAccessibility } from "react-icons/io5";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";
import {Canvas} from "@react-three/fiber";
import {PerspectiveCamera} from "@react-three/drei";
import Heart from "../components/3dmodels/Heart";
import Stethoscope from "../components/3dmodels/stethoscope";
import Tablets from "../components/3dmodels/Tablets";
import CanvasLoader from "../components/3dmodels/CanvasLoader";
import { Suspense } from "react";
import {Leva, useControls} from "leva";
import { OrbitControls } from "@react-three/drei";
import { use } from "react";
import { useState } from "react";
import NewsCard from "../components/common/NewsCard";
import "../styles/components/news.css"
const apiKey = import.meta.env.VITE_NEWS_API_KEY;

const LandingPage = () => {

        const [articles, setArticles] = useState([]);
      
        useEffect(() => {
          const fetchNews = async () => {
            try {
              const response = await fetch("https://newsapi.org/v2/top-headlines?country=us&category=health",{
                headers: {
                "X-Api-Key": apiKey,
                },
              });
              const data = await response.json();
              setArticles(data.articles);
            } catch (error) {
              console.error("Error fetching news:", error);
            }
          };
      
          fetchNews();
        }, []);

    // const x=useControls("Heart",{
    //     positionx:{
    //         value:2.5,
    //         min:-10,
    //         max:10
    //     },
    //     positiony:{
    //         value:2.5,
    //         min:-10,
    //         max:10
    //     },
    //     positionz:{
    //         value:2.5,
    //         min:-10,
    //         max:10
    //     },
    //     rotationx:{
    //         value:0,
    //         min:-10,
    //         max:10
    //     },
    //     rotationy:{
    //         value:0,
    //         min:-10,
    //         max:10
    //     },
    //     rotationz:{
    //         value:0,
    //         min:-10,
    //         max:10
    //     },
    //     scale:{
    //         value:4,
    //         min:1,
    //         max:10
    //     }

    // })

    const { isLoading, toggleLoading } = useContext(commonContext);

    useEffect(() => {
        toggleLoading(true);
        setTimeout(() => toggleLoading(false), 1250);
    }, []);

    useScrollDisable(isLoading);    

    useDocTitle();

    const navigate = useNavigate();

    const faqs = [
        {
            question: "What is MedLink?",
            answer: "It is the web application that connects patients to the right doctor or allow them to choose a doctor as per their need, It also allows users to create instant meetings with doctors."
        },
        {
            question: "Can we get a free account in MedLink and use all its features for free?",
            answer: "Yes, Ofcourse. You can use all the features provided by MedLink for free."
        },
        {
            question: "Can we book an appointment at any time?",
            answer: "No. It is under process ."
        },
        {
            question: "Can we purchase the medicines from here?",
            answer: "No. You can purchase the medicines from Medical store."
        },
    ];

    if(isLoading) {
        return <Preloader />;
    }
    
    return (
        <>




        <div id="landing-page-bg"></div>
        <div id="landing-page">
            <section className="intro-section">
                <div className="curvy-img"></div>
                <div className="content">
                    <div className="text">
                        <h2>Take best quality treatments <br />and avoid health problems</h2>
                        <p>The art of medicine consists in amusing the patient while nature cures the disease. Treatment without prevention is simply unsustainable.</p>
                        {(localStorage.getItem("username") && localStorage.getItem("username")!=="undefined") && localStorage.getItem("usertype")==="patient" && 
                            <button onClick={() => navigate("/doctors")}>Appointment</button> }
                    </div>
                    {/* <div className="doctor-img">
                        <img src="/doctor-image.png" alt="" />
                    </div> */}

                    <div className="doctor-img" style={{ height: "500px", width: "600px" }}>
                    <Canvas>
  
    <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} aspect={window.innerWidth / window.innerHeight} near={0.1} far={1000} />


    <ambientLight intensity={10} />

    <Stethoscope
    scale={1}
    />
  
    <directionalLight position={[5, 10, 15]} intensity={10} />
    
    <OrbitControls enableZoom={false} enableRotate={true}/>
</Canvas>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div><h2>Our Future Scope</h2></div>
                <div className="features">
                    <div className="item">
                        <div className="img-div">
                            <div className="img first">
                                <TbStethoscope />
                            </div>
                        </div>
                        <h3> Appointment Scheduling</h3>
                        <p>you can schedule an appointment as per your comfort </p>
                    </div>
                    <div className="item">
                        <div className="img-div">
                            <div className="img second">
                                <BsRobot />
                            </div>
                        </div>
                        <h3>Disease Identification model</h3>
                        <p>You can test your health whether you have a possibility of disease or not.</p>
                    </div>
                    <div className="item">
                        <div className="img-div">
                            <div className="img third">
                                <GiMedicines />
                            </div>
                        </div>
                        <h3>Pharmacy integration with stripe</h3>
                        <p>You can purchase medicines through our pharmacy store with stripe secured payments.</p>
                    </div>
                    
                </div>

            </section>

            <section className="need-section">
                <div className="need-div">
                    
<div className="img-div" style={{ height: "400px", width: "400px" }}>
    
<Canvas>
    <Suspense fallback={<CanvasLoader />}>
    <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} aspect={window.innerWidth / window.innerHeight} near={0.1} far={1000} />


    <ambientLight intensity={2} />
    
    <Heart 
    //scale={4} 
    position={[-0.1,0,-0.7]} 
    rotation={[0,0,0.2]}
    scale={3.5}
    />
    <directionalLight position={[5, 10, 5]} intensity={1} />
    
    </Suspense>
    <OrbitControls enableZoom={false} enableRotate={true}/>
</Canvas>
</div>

                    <div className="content">
                        <h2>Why do we need?</h2>
                        <ul>
                            <li>WHO recommends 44.5 doctors per 10,000 people but India has only 22 per 10k people so major supply demand mismatchIndia has 22.8 doctors for every 10K citizens, the half of what WHO recommends.</li>
                            <li>Also, local doctors may fail to provide  the best consultation as they lack expertise & experience.</li>
                            <li>Thus all-in-one online hospital was created. It offers a disease prediction system, pharmacy, and payments.</li>
                            <li>This platform provides access to quality healthcare from anywhere, improving healthcare outcomes and accessibility.</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="benefits-section">
                <div className="content">
                    <h2>Our Benefits</h2>
                    <div className="benefits">
                        <div className="first">
                            <div className="icon"><MdOutlineHealthAndSafety /> </div>
                            <p>TeleHealth services</p>
                        </div>
                        <div className="second">
                            <div className="icon"><IoAccessibility /> </div>
                            <p>Convenience and accessibility</p>
                        </div>
                        
                        <div className="fourth">
                            <div className="icon"><TbHeartPlus /> </div>
                            <p>Competitive advantage</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="faq-section">
                <div className="faq-div">
                    <div className="img-div">
                        <img src="faq-img.png" alt="faq" />
                    </div>
                    <div className="content">
                        <h2 className="head">Any Queries?</h2>
                        <div className="faqs">
                            {faqs.map((item, index) => (
                                <Accordion key={index} className="faq-item">
                                    <AccordionSummary
                                        expandIcon={<MdExpandMore className="icon" />}
                                        className="expand-icon"
                                    >
                                    <div className="item-qn">{item.question}</div>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div className="item-ans">{item.answer}</div>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </div>
                    </div>

                    

                </div>
            </section>

            <section>
  <div className="container">
    <h2 
      style={{ textAlign: 'center', color: "#4D51B0", marginTop: '20px' }}>
      Latest Health News
    </h2>

    <div className="articles">
    {articles.slice(0, 5).map((article, index) => (
  <NewsCard
    key={index}
    title={article.title || "No Title Available"}
    description={article.description || "No description available."}
    url={article.url}
    imageUrl={article.urlToImage || "default-news-image.jpg"}
  />
))}

    </div>
  </div>
</section>



            
        </div>
        </>
    )
}

export default LandingPage;