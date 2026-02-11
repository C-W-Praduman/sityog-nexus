import { FaBook } from "react-icons/fa";

const DownloadHeader = () => (
  <div className="text-center mb-12 sm:mb-20">
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-black tracking-widest uppercase mb-6">
      <FaBook className="text-xs" />
      Study Repository
    </div>

    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-6">
      Digital{" "}
      <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">
        Archive
      </span>
    </h1>

    <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto px-4">
      Access organized study materials, previous year questions, and expert
      notes.
    </p>
  </div>
);

export default DownloadHeader;
