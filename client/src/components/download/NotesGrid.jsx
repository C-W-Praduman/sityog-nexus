import NoteCard from './NoteCard';


const NotesGrid = ({ notes, onPreview, currentUser,handleDelete }) => (
<div className="overflow-hidden">
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
{notes.map(note => (
<NoteCard key={note._id} note={note} onPreview={onPreview} currentUser={currentUser} handleDelete={handleDelete} />
))}
</div>
</div>
);


export default NotesGrid;