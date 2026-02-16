import { FaGraduationCap, FaFilter } from "react-icons/fa";

const Filters = ({
  branches,
  semesters,
  selectedBranch,
  selectedSemester,
  onBranchChange,
  onSemesterChange,
}) => (
  <div className="bg-white/5 backdrop-blur-2xl rounded-3xl sm:rounded-[3rem] p-4 sm:p-10 border border-white/10 mb-10 sm:mb-20">
    <div className="flex flex-col lg:flex-row gap-8 sm:gap-10">
      
      {/* Branch Section */}
      <div className="flex-1">
        <label className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 text-white font-black uppercase text-[30px] mb-4 md:text-lg sm:mb-6">
          <FaGraduationCap className="text-blue-500" />
          Choose Branch
        </label>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3">
          {branches.map((b) => (
            <button
              key={b}
              onClick={() => onBranchChange(b)}
              className={`py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-black border transition-all cursor-pointer ${
                selectedBranch === b
                  ? "bg-blue-600 text-white border-blue-400"
                  : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Divider (mobile only) */}
      <div className="h-px w-full bg-white/10 lg:hidden my-2" />

      {/* Semester Section */}
      <div className="flex-1 lg:pl-10">
        <label className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 text-white font-black uppercase text-[30px] mb-4 md:text-lg sm:mb-6">
          <FaFilter className="text-purple-500" />
          Semester
        </label>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3">
          {semesters.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => onSemesterChange(value)}
              className={`py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-black border transition-all cursor-pointer ${
                selectedSemester === value
                  ? "bg-blue-600 text-white border-blue-400"
                  : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

    </div>
  </div>
);

export default Filters;
