import React from 'react'
import Title from '../component/Title'
import contact from "../assets/contact.jpg"
import NewLetterBox from '../component/NewLetterBox'
import Footer from '../component/Footer'

function Contact() {
  return (
    <div className="w-[99vw] min-h-[100vh] flex items-center justify-center flex-col bg-gradient-to-l from-[#141414] to-[#0c2025] gap-[50px] pt-[80px]">
      <Title text1={"CONTACT"} text2={"US"} />
      {/* Why Contact Us Section */}
      <div className="w-full flex flex-col items-center justify-center animate-fade-in-up">
        <h2 className="text-white text-[20px] md:text-[24px] font-bold mb-2">
          Why Contact Us?
        </h2>
        <p className="text-white text-[14px] md:text-[16px] text-center max-w-[600px] mb-4">
          We value your feedback, questions, and suggestions! Whether you need
          help with an order, want to know more about our products, or have a
          business inquiry, our team is here to assist you. Reach out and
          experience our commitment to excellent customer service.
        </p>
      </div>
      <div className="w-[100%] flex items-center justify-center flex-col lg:flex-row animate-fade-in-up delay-100">
        <div className="lg:w-[50%] w-[100%] flex items-center justify-center">
          <img
            src={contact}
            alt="Contact"
            className="lg:w-[70%] w-[80%] shadow-md shadow-black rounded-sm transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="lg:w-[50%] w-[80%] flex items-start justify-center gap-[20px] flex-col mt-[20px] lg:mt-[0px]">
          <p className="lg:w-[80%] w-[100%] text-[white] font-bold lg:text-[18px] text-[15px]">
            Our Store
          </p>
          <p className="lg:w-[80%] w-[100%] text-[white] md:text-[16px] text-[13px]">
            <span>12345 Random Station</span>
            <br />
            <span>Random City, State, India</span>
          </p>
          <p className="lg:w-[80%] w-[100%] text-[white] md:text-[16px] text-[13px]">
            <span>Tel: +91-9876543210</span>
            <br />
            <span>Email: admin@urbanwagon.com</span>
          </p>
          {/* Customer Support Block */}
          <div className="lg:w-[80%] w-[100%] bg-[#1e2223]/60 rounded-md p-3 mt-2 animate-fade-in-up delay-200">
            <p className="text-[#dbfcfc] font-semibold text-[15px] lg:text-[17px] mb-1">
              Customer Support
            </p>
            <p className="text-white text-[13px] md:text-[15px]">
              Our support team is available 7 days a week, 9am–9pm IST. For
              urgent queries, use the contact form below or call us directly.
            </p>
          </div>
          <p className="lg:w-[80%] w-[100%] text-[15px] text-[white] lg:text-[18px] mt-[10px] font-bold">
            Careers at UrbanWagon
          </p>
          <p className="lg:w-[80%] w-[100%] text-[white] md:text-[16px] text-[13px]">
            Learn more about our teams and job openings
          </p>
          <button className="px-[30px] py-[20px] flex items-center justify-center text-[white] bg-transparent border hover:bg-slate-600 rounded-md">
            Explore Jobs
          </button>
        </div>
      </div>
      <div className="w-full flex items-center justify-center animate-fade-in-up delay-300">
        <NewLetterBox />
      </div>
      <div className="animate-fade-in-up delay-300">
        <Footer />
      </div>
      {/* Animations */}
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.4,0,0.2,1) both; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
}

export default Contact
