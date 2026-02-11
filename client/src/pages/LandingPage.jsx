import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { FaBookOpen, FaDownload, FaFileUpload, FaUsers, FaGraduationCap, FaQuoteLeft, FaRocket, FaChevronDown } from 'react-icons/fa';
import { useState } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// User Illustrations
import HeroImg from '../assets/illustrations/hero_futuristic_students.png';
import KnowledgeImg from '../assets/illustrations/knowledge_sharing.png';
import DomainsImg from '../assets/illustrations/engineering_domains.png';

const features = [
  {
    title: "Note Sharing",
    description: "Upload and access comprehensive lecture notes from your peers and seniors.",
    icon: <FaBookOpen className="text-4xl text-blue-500" />,
  },
  {
    title: "PYQ Bank",
    description: "Get access to previous year questions to effectively prepare for your SITYOG exams.",
    icon: <FaGraduationCap className="text-4xl text-cyan-500" />,
  },
  {
    title: "Collaborative Learning",
    description: "Join a community of diploma students dedicated to helping each other succeed.",
    icon: <FaUsers className="text-4xl text-blue-400" />,
  },
  {
    title: "Easy Access",
    description: "Download materials anywhere, anytime. Your study lab is now in your pocket.",
    icon: <FaDownload className="text-4xl text-indigo-500" />,
  },
];

const testimonials = [
  {
    name: "Rahul Kumar",
    branch: "Civil Engineering",
    text: "The notes available here helped me clear my 3rd-semester backlogs. It's truly a lifesaver for SITYOG students.",
  },
  {
    name: "Anjali Kumari",
    branch: "Computer Science",
    text: "I uploaded my lab manuals, and the feedback from others was great. Sharing is indeed caring here!",
  },
  {
    name: "Vivek Singh",
    branch: "Mechanical Engineering",
    text: "The PYQ bank is the best thing about this platform. No more searching for old question papers in the library.",
  },
];

const faqData = [
  {
    question: "How do I upload notes for my branch?",
    answer: "Simply click on the 'SHARE KNOWLEDGE' button on the homepage or navigation bar. Choose your branch, semester, and subject, then drag and drop your PDF file. It's that easy!"
  },
  {
    question: "Are the Previous Year Questions (PYQs) verified?",
    answer: "Yes, our team and senior students regularly verify the uploaded PYQs to ensure they match the SBTIE Bihar curriculum for SITYOG students."
  },
  {
    question: "Is this platform completely free for all students?",
    answer: "Absolutely! SITYOG Nexus is a student-driven initiative aimed at helping each other. all resources are free to access and share."
  },
  {
    question: "Which engineering branches are covered?",
    answer: "We currently support all core branches offered at SITYOG, including Computer Science, Civil, Mechanical, and Electrical Engineering."
  }
];

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`mb-4 transition-all duration-500 overflow-hidden ${isOpen ? 'bg-white/10' : 'bg-white/5'} backdrop-blur-md rounded-2xl border ${isOpen ? 'border-blue-500/50' : 'border-white/10'} hover:border-blue-400/30 group`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
      >
        <span className={`text-lg sm:text-xl font-bold transition-colors duration-300 ${isOpen ? 'text-blue-400' : 'text-white'} group-hover:text-blue-300`}>
          {question}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-blue-600 rotate-180' : 'bg-white/10'}`}>
          <FaChevronDown className={`text-sm ${isOpen ? 'text-white' : 'text-blue-400'}`} />
        </div>
      </button>
      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-6 mt-2 border-t border-white/5 pt-4">
          <p className="text-gray-400 leading-relaxed text-base sm:text-lg font-light">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

function LandingPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] lg:min-h-[95vh] flex items-center pt-24 pb-16 lg:pt-32 lg:pb-24 px-4 sm:px-6 lg:px-8 bg-[#0a0f1d] overflow-hidden">
        {/* Futuristic Grid/Pattern Background */}
        
        
        {/* Glowing Orbs */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-200 h-200 bg-blue-600/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-150 h-150 bg-purple-600/20 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
          <div className="flex-1 text-center lg:text-left space-y-10 animate-fade-in-up">
            <div className="inline-flex items-center px-5 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold tracking-widest border border-blue-500/20 uppercase">
              <FaRocket className="mr-2" /> Next-Gen Learning Hub
            </div>
            <h1 className="text-6xl sm:text-6xl lg:text-8xl font-black text-white leading-[1.1] tracking-normal">
              SITYOG <br />
              <span className="bg-linear-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">Nexus</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Revolutionizing diplomas at <b>SITYOG GROUP OF INSTITUTIONS</b>. Access premium notes, PYQs, and resources designed for engineering excellence.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 sm:gap-6 pt-4">
              <Link 
                to="/upload" 
                className="group relative px-6 py-4 sm:px-10 sm:py-5 bg-blue-600 text-white font-black rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(37,99,235,0.6)] hover:bg-blue-500 transition-all duration-300 hover:-translate-y-2 text-center"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <FaFileUpload className="text-xl sm:text-2xl" /> SHARE KNOWLEDGE
                </span>
              </Link>
              <Link 
                to="/download" 
                className="group px-6 py-4 sm:px-10 sm:py-5 bg-white/5 text-white font-black rounded-2xl border-2 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 flex items-center justify-center gap-3 text-center"
              >
                <FaDownload className="text-lg sm:text-xl group-hover:animate-bounce" /> ACCESS VAULT
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-8 sm:gap-12 pt-10 border-t border-white/5 mt-4">
              <div className="text-center lg:text-left">
                <p className="text-3xl sm:text-4xl font-black text-white">500+</p>
                <p className="text-[10px] sm:text-xs text-blue-400 font-bold uppercase tracking-[0.2em]">Artifacts</p>
              </div>
              <div className="w-px h-12 sm:h-16 bg-white/10" />
              <div className="text-center lg:text-left">
                <p className="text-3xl sm:text-4xl font-black text-white">1.2k+</p>
                <p className="text-[10px] sm:text-xs text-purple-400 font-bold uppercase tracking-[0.2em]">Pioneers</p>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-3xl lg:max-w-none transform hover:scale-[1.02] transition-transform duration-700">
            <div className="relative group">
              <div className="absolute -inset-2 bg-linear-to-r from-blue-600 via-cyan-400 to-purple-500 rounded-[3rem] blur opacity-40 group-hover:opacity-75 transition duration-500 animate-pulse" />
              <div className="relative bg-[#0d1425] p-1.5 sm:p-2 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/10">
                 <img 
                    src={HeroImg} 
                    alt="Sityog Nexus Illustration" 
                    className="w-full h-auto object-cover rounded-4xl sm:rounded-[3rem] shadow-inner" 
                  />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Using Knowledge Sharing Illustration */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 sm:gap-7 items-center">
            <div className="order-2 lg:order-1 relative animate-on-scroll">
              <div className="relative z-10 bg-blue-50/50 rounded-[2.5rem] sm:rounded-[4rem] p-8 sm:p-12 border border-blue-100/50 shadow-2xl">
                <img 
                  src={KnowledgeImg} 
                  alt="Knowledge Sharing Ecosystem" 
                  className="w-full h-auto drop-shadow-2xl sm:scale-110 hover:rotate-2 transition-transform duration-500" 
                />
              </div>
              <div className="absolute -top-20 -left-20 w-80 h-80 bg-cyan-200/20 rounded-full blur-[100px]" />
            </div>

            <div className="order-1 lg:order-2 space-y-10">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                Deep Dive Into <br />
                <span className="text-blue-600">SITYOG Excellence</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed font-light">
                Our platform isn't just a website; it's a <b>knowledge accelerator</b>. Bridging the gap between classroom teaching and exam mastery.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-blue-200 transition-colors">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 mb-4">
                    <FaGraduationCap className="text-2xl" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Curated Content</h4>
                  <p className="text-sm text-gray-500">SBTIE compliant material verified by top seniors.</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-blue-200 transition-colors">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-purple-600 mb-4">
                    <FaUsers className="text-2xl" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Open Network</h4>
                  <p className="text-sm text-gray-500">Connect with classmates across all branches instantly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Domains Section - Using Engineering Domains Illustration */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-900 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-white to-transparent opacity-100" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                All Engineering <br />
                <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Domains Covered</span>
              </h2>
              <p className="text-xl text-gray-400 font-light max-w-xl">
                Whether you're in Civil, Mechanical, Computer Science, or Electrical, we have specialized repositories for every discipline at SITYOG.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 font-bold text-sm uppercase tracking-widest text-blue-400">
                <span className="px-4 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">Civil</span>
                <span className="px-4 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">CS</span>
                <span className="px-4 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">Mechanical</span>
                <span className="px-4 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">Electrical</span>
              </div>
            </div>
            <div className="lg:w-1/2 p-6 sm:p-8 bg-white/5 rounded-[2.5rem] sm:rounded-[4rem] border border-white/10 backdrop-blur-sm shadow-inner group">
              <img 
                src={DomainsImg} 
                alt="Engineering Domains Hierarchy" 
                className="w-full h-auto rounded-4xl sm:rounded-[3.5rem] transform group-hover:scale-[1.03] transition-transform duration-700" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Swiper Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-size-[40px_40px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="mb-12 sm:mb-20 space-y-4 sm:space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter">Core Capabilities</h2>
            <p className="text-blue-100 text-lg sm:text-xl max-w-3xl mx-auto font-light leading-relaxed">
              We've built a suite of features that transform the way you study, collaborate, and succeed.
            </p>
          </div>

          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={40}
            slidesPerView={1}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1280: { slidesPerView: 3 },
            }}
            className="features-swiper pb-24"
          >
            {features.map((feature, index) => (
              <SwiperSlide key={index}>
                <div className="h-full bg-white/10 backdrop-blur-2xl border border-white/20 p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] hover:bg-white/20 transition-all duration-500 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors" />
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-10 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 sm:mb-6 uppercase tracking-tight">{feature.title}</h3>
                  <p className="text-blue-50/70 text-base sm:text-lg leading-relaxed font-light">{feature.description}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-24 sm:gap-7 items-center">
            <div className="lg:w-1/3 text-center lg:text-left space-y-8">
              <h2 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tighter leading-none uppercase">Voices of <span className="text-blue-600">Sityog</span></h2>
              <p className="text-gray-500 text-xl font-light leading-relaxed">
                Join thousands of students who have already upgraded their academic experience.
              </p>
              <div className="hidden lg:block pt-10 text-blue-600/5">
                <FaQuoteLeft className="text-[10rem] lg:text-[12rem]" />
              </div>
            </div>
            
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-10">
              {testimonials.map((testi, index) => (
                <div key={index} className="p-8 sm:p-10 bg-white rounded-[2.5rem] sm:rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-500 group">
                  <div className="space-y-6">
                    <div className="flex text-amber-400 text-xl gap-2">
                      {[1,2,3,4,5].map(i => <span key={i}>★</span>)}
                    </div>
                    <p className="text-gray-700 italic text-lg font-medium leading-relaxed">"{testi.text}"</p>
                  </div>
                  <div className="mt-12 flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center text-2xl font-black shadow-lg shadow-blue-200">
                      {testi.name[0]}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-xl">{testi.name}</h4>
                      <p className="text-sm text-blue-600 font-black tracking-[0.2em] uppercase">{testi.branch}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 px-4 sm:px-6 lg:px-8 bg-[#0a0f1d] relative overflow-hidden scroll-mt-20">
        {/* Subtle grid and glows */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-black tracking-widest border border-blue-500/20 uppercase">
              Support Center
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase leading-none">
              Query <span className="text-blue-500">Nexus</span>
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              Got questions? We've engineered the answers you need for a seamless SITYOG experience.
            </p>
          </div>
          
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <FAQItem key={index} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto bg-[#0a0f1d] rounded-[4rem] p-16 lg:p-24 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
           {/* Abstract glows */}
          <div className="absolute top-0 right-0 w-125 h-125 bg-blue-600/20 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-125 h-125 bg-purple-600/20 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2" />
          
          <div className="relative z-10 text-center space-y-12">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight uppercase tracking-tighter">
              Ignite Your <br className="hidden sm:block" /> Potential
            </h2>
            <p className="text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              Don't wait for the next semester. Join the <b>SITYOG Nexus</b> today and take control of your academic destiny.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 pt-6">
              <Link 
                to="/upload" 
                className="px-8 sm:px-14 py-4 sm:py-6 bg-linear-to-r from-blue-600 to-indigo-700 text-white font-black rounded-2xl sm:rounded-3xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_40px_rgba(37,99,235,0.3)] uppercase tracking-widest text-base sm:text-lg text-center"
              >
                Upload Artifact
              </Link>
              <Link 
                to="/download" 
                className="px-8 sm:px-14 py-4 sm:py-6 bg-white/5 text-white font-black rounded-2xl sm:rounded-3xl border-2 border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 uppercase tracking-widest text-base sm:text-lg backdrop-blur-xl text-center"
              >
                Explore Vault
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Styles for Swiper dots and animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        .features-swiper .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.3;
          width: 12px;
          height: 12px;
        }
        .features-swiper .swiper-pagination-bullet-active {
          background: white !important;
          opacity: 1;
          width: 40px;
          border-radius: 6px;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
      `}} />

    </div>
  );
}

export default LandingPage;
