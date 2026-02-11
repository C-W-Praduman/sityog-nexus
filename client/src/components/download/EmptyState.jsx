import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';


const EmptyState = ({ branch, semester }) => (
<div className="text-center py-24 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
<div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-8">
<FaSearch className="text-3xl text-blue-500" />
</div>
<h3 className="text-2xl font-black text-white mb-3">No Uploads Found</h3>
<p className="text-gray-400 mb-8">No notes for {branch} {semester}</p>
<Link to="/upload" className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl">Contribute</Link>
</div>
);


export default EmptyState;