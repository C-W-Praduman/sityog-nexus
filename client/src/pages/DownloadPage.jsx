import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import API_BASE_URL from "../config/api";
import BackgroundGlow from "../components/download/BackgroundGlow";
import DownloadHeader from "../components/download/DownloadHeader";
import Filters from "../components/download/Filters";
import NotesGrid from "../components/download/NotesGrid";
import EmptyState from "../components/download/EmptyState";

// Get current user from local storage

const DownloadPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [userProfile, setUserProfile] = useState(null);
  const { token, user } = useAuth();

  useEffect(() => {
    setUserProfile(user);
  }, [user]);
  const selectedBranch = searchParams.get("branch") || "Common";
  const selectedSemester = searchParams.get("semester") || "1";

  const branches = [
    "Common",
    "CSE",
    "Electrical",
    "Electronics",
    "Civil",
    "Mechanical",
  ];
  const semesters = [
    { label: "SEM 01", value: "1" },
    { label: "SEM 02", value: "2" },
    { label: "SEM 03", value: "3" },
    { label: "SEM 04", value: "4" },
    { label: "SEM 05", value: "5" },
    { label: "SEM 06", value: "6" },
  ];

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        if (selectedBranch !== "Common") {
          params.append("branch", selectedBranch);
        }

        params.append("semester", selectedSemester);

        const response = await fetch(
          `${API_BASE_URL}/api/notes?${params.toString()}`,
        );

        const data = await response.json();
        setNotes(data);
      } catch (err) {
        toast.error("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [selectedBranch, selectedSemester]);


  const handlePreview = (fileurl) => {
    window.open(fileurl, "_blank");
  };
  const handleBranchChange = (branch) => {
    setSearchParams({
      branch,
      semester: selectedSemester,
    });
  };
  const handleSemesterChange = (semester) => {
    setSearchParams({
      branch: selectedBranch,
      semester,
    });
  };

  const handleDelete = async (note) => {
  if (!window.confirm("Are you sure you want to delete this note?")) return;

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/deletenote/${note._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Delete failed");
    }

    toast.success("Note deleted");
    setNotes(notes.filter(noteItem => noteItem._id !== note._id)); // remove from UI
  } catch (err) {
    toast.error("Failed to delete note");
  }
};



  return (
    <div className="min-h-screen bg-[#020617] relative overflow-x-hidden pt-24 pb-20">
      <BackgroundGlow />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <DownloadHeader />

        <Filters
          branches={branches}
          semesters={semesters}
          selectedBranch={selectedBranch}
          selectedSemester={selectedSemester}
          onBranchChange={handleBranchChange}
          onSemesterChange={handleSemesterChange}
        />

        {loading ? (
          <div className="text-center py-32 text-blue-400 font-black">
            Loading...
          </div>
        ) : notes.length === 0 ? (
          <EmptyState branch={selectedBranch} semester={selectedSemester} />
        ) : (
          <NotesGrid
            notes={notes}
            onPreview={handlePreview}
            currentUser={userProfile}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default DownloadPage;
