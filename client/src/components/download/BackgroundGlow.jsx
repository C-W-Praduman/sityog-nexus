const BackgroundGlow = () => (
  <>
    <div className="absolute top-0 left-0 w-full h-125 bg-linear-to-b from-blue-600/10 to-transparent pointer-events-none" />

    <div className="absolute top-[20%] right-0 translate-x-1/3 w-75 h-75 sm:w-125 sm:h-125 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

    <div className="absolute bottom-[10%] left-0 -translate-x-1/3 w-62.5 h-62.5 sm:w-100 sm:h-100 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
  </>
);

export default BackgroundGlow;
