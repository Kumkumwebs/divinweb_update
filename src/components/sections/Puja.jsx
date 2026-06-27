import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, EffectFade, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import TestimonialSection from "./TestimonialSection";
import FaqSection from "./FAQSection";
import BenefitOfOfferingsWidget from "./BenefitOfferingWidget";
import DescriptionBlock from "../common/DescriptionText";
import CountdownTimer from "../common/CountDownTimmer";
import BenefitsPujaWidget from "./BenefitsPujaWidget";
import PujaProcessWidget from "./PujaProcessWidget";
import PujaProcessFlow from "./PujaProcessWidget";
import PujaPackages from "./PujaPackages";
import UserReviews from "./UserReviews";
import UserDetailsModal from "../common/ChadhavaUserDetailsModel";

const Puja = ({ puja }) => {
    if (!puja) return null;
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    

    return (
        <div>
            <section className="space">
                <div className="container">
                    <div className="row">
                        {/* LEFT CONTENT */}
                        <div className="col-xxl-6 col-lg-6">
                            <div className="tour-page-single">

                                {/* ===== IMAGE SLIDER ===== */}
                                <div className="slider-area tour-slider1">

                                    {/* MAIN SLIDER */}
                                    <Swiper
                                        modules={[Thumbs, EffectFade, Navigation]}
                                        effect="fade"
                                        loop
                                        navigation={{
                                            nextEl: ".slider-next",
                                            prevEl: ".slider-prev",
                                        }}
                                        thumbs={{ swiper: thumbsSwiper }}
                                        className="th-slider mb-4"
                                    >
                                        {puja.bannerImages.map((img, index) => (
                                            <SwiperSlide key={index}>
                                                <div className="tour-slider-img">
                                                    <img src={img} alt="tour" />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>

                                    {/* THUMB SLIDER */}
                                    <Swiper
                                        modules={[Thumbs]}
                                        onSwiper={setThumbsSwiper}
                                        loop
                                        watchSlidesProgress
                                        slidesPerView={3}
                                        spaceBetween={10}
                                        breakpoints={{
                                            0: { slidesPerView: 2 },
                                            768: { slidesPerView: 3 },
                                        }}
                                        className="th-slider tour-thumb-slider"
                                    >
                                        {puja.bannerImages.map((img, index) => (
                                            <SwiperSlide key={index}>
                                                <div className="tour-slider-img">
                                                    <img src={img} alt="thumb" />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>

                                    {/* ARROWS */}
                                    <button className="slider-arrow style3 slider-prev">
                                        <img src="assets/img/icon/hero-arrow-left.svg" alt="" />
                                    </button>
                                    <button className="slider-arrow style3 slider-next">
                                        <img src="assets/img/icon/hero-arrow-right.svg" alt="" />
                                    </button>
                                </div>



                            </div>
                        </div>
                        {/* RIGHT SIDEBAR */}
                        <div className="col-xxl-6 col-lg-6">
                            <aside className="sidebar-area">

                                <div className="widget widget_tour_summary modern-summary">
                                    {/* Availability Notice */}
                                    <div className="time-alert">
                                        <div className="availability-text">
                                            Limited availability · Final day to participate
                                        </div>
                                        <div className="time-alert-bar"></div>
                                    </div>



                                    <div className="tour-summary-content">

                                        {/* Meta */}
                                        <div className="page-meta mb-20">
                                            <span className="page-tag premium-tag">Featured Offering</span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="box-title summary-title">
                                            {puja.title}
                                        </h3>

                                       

                                        {/* Description */}
                                        <DescriptionBlock text={puja.purposeOfPooja} />
                                        <p className="box-text mb-10 summary-desc temple-line">
                                            <i className="fa-solid fa-gopuram temple-fa me-2"></i>

                                            {puja.mandirName}
                                        </p>
                                        <p className="box-text mb-10 summary-desc temple-line">

                                            <i className="fa-solid fa-calendar-days me-2"></i>
                                            {puja.mandirName}
                                        </p>
                                        <p className="box-text summary-desc mb-10">
                                            Over <strong>3,00,000+ devotees</strong>  have participated in pujas conducted by
                                            <strong> DivinIQ</strong>.
                                        </p>






                                        {/* CTA */}
                                        <a href="#" className="th-btn style3 w-100 modern-cta">
                                            Select Puja Package
                                        </a>

                                    </div>

                                </div>

                            </aside>
                        </div>


                    </div>



                </div>
            </section>
            <CountdownTimer pujaDate={puja.pujaDate}/>
            <div className="container pt-20 mb-30">
  <div className="puja-purpose-block">

    {/* Heading with icon */}
    <h2 className="box-title puja-purpose-title">
      <span className="puja-purpose-icon">🕉️</span>
      {puja.purposeOfPooja}
    </h2>

    {/* Description */}
    <DescriptionBlock text={puja.aboutPuja} />

  </div>
</div>

            {/* <ShopPuja Puja={Puja} /> */}
            
            
            <BenefitsPujaWidget />
            <PujaProcessFlow/>
            <PujaPackages puja={puja}/>
            <UserReviews
  reviews={[
    {
      userName: "Rakesh Sharma",
      userImage: "/assets/img/user/user1.jpg",
      location: "Delhi",
      rating: 5,
      comment:
        "The puja was performed with great devotion. I received the video and blessings exactly as promised. Truly divine experience.",
      date: "2025-02-12",
    },
    {
      userName: "Anita Verma",
      userImage: "/assets/img/user/user2.jpg",
      location: "Mumbai",
      rating: 4,
      comment:
        "Very peaceful experience. The pandit ji called out our names clearly during sankalp. Felt blessed.",
      date: "2025-02-08",
    },
  ]}
/>


            <FaqSection faq={puja.faq} />
            <TestimonialSection />
        </div>
    );
};

export default Puja;
