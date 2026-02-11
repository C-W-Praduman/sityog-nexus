import { FaDownload, FaCalendarAlt, FaUser, FaGraduationCap, FaBook } from 'react-icons/fa';

const NoteCard = ({ note,  onPreview , currentUser, handleDelete }) => (
  <div className="group bg-white/5 rounded-4xl border border-white/10 hover:border-blue-500/50 transition-all overflow-hidden flex flex-col">
    <div className="flex items-center justify-between flex-wrap gap-2 px-6 pt-6">
     <div className='flex flex-wrap gap-2'>
       <span className="px-3 py-1 text-[10px] font-black rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
        {note.branch}
      </span>

      <span className="px-3 py-1 text-[10px] font-black rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">
        SEM {note.semester}
      </span>

      <span className="px-3 py-1 text-[10px] font-black rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase">
        {note.documentType}
      </span>
     </div>

      <div>
        {currentUser?.role === "host" && (
  <button onClick={() => handleDelete(note)} className=" px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 cursor-pointer text-[13px] hover:bg-purple-500/20 transition-all ">
    delete
  </button>
)}

      </div>
    </div>

    <div className="p-6 grow">
      <h3 className="text-xl font-black text-white mb-4 line-clamp-2">
        {note.title}
      </h3>

      <div className="space-y-2 text-sm text-gray-400">
        <div className="flex items-center">
          <FaCalendarAlt className="mr-2 text-blue-400/60" />
          {new Date(note.uploadedAt).toLocaleDateString()}
        </div>

        <div className="flex items-center">
          <FaUser className="mr-2 text-purple-400/60" />
          <span className="font-semibold text-gray-300">{note.uploaderName}</span>
        </div>
      </div>
    </div>

    <div className="p-6 pt-0 ">
      <button
        onClick={() => onPreview(note.fileUrl)}
        className="w-full py-3 flex items-center cursor-pointer justify-center bg-white/5 hover:bg-blue-600 text-white font-black rounded-xl border border-white/10 transition-all"
      >
        <FaBook className="inline mr-2" />
        Preview
      </button>
     
    </div>
  </div>
);

export default NoteCard;
