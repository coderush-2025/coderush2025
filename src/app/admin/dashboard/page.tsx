'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiUsers, FiUpload, FiAlertCircle, FiLogOut, FiEdit2, FiTrash2, FiSave, FiX, FiGrid, FiList, FiHome, FiTrendingUp, FiUserCheck, FiFileText, FiExternalLink } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

type Tab = 'dashboard' | 'registrations' | 'submissions' | 'issues';
type ViewMode = 'card' | 'table';

interface Member {
  fullName: string;
  indexNumber: string;
  batch: string;
  email: string;
}

interface Registration {
  _id: string;
  teamName: string;
  teamBatch: string;
  members: Member[];
  createdAt: string;
}

interface Submission {
  _id: string;
  teamName: string;
  githubLink: string;
  googleDriveLink: string;
  submittedAt: string;
}

interface Issue {
  _id: string;
  teamName: string;
  contactNumber: string;
  email: string;
  problemType: string;
  reason: string;
  status: string;
  createdAt: string;
  adminNotes?: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [submissionViewMode, setSubmissionViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminUsername, setAdminUsername] = useState('');
  const router = useRouter();

  // Edit states
  const [editingReg, setEditingReg] = useState<string | null>(null);
  const [editingRegData, setEditingRegData] = useState<Registration | null>(null);
  const [editingSub, setEditingSub] = useState<string | null>(null);
  const [editingSubData, setEditingSubData] = useState<Submission | null>(null);
  const [editingIssue, setEditingIssue] = useState<string | null>(null);
  const [editingIssueData, setEditingIssueData] = useState<Issue | null>(null);
  const editingCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const username = localStorage.getItem('adminUsername');

    if (!token || !username) {
      router.push('/admin/login');
      return;
    }

    setAdminUsername(username);

    // Fetch data only once
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [regRes, subRes, issueRes] = await Promise.all([
          fetch('/api/admin/registrations'),
          fetch('/api/admin/submissions'),
          fetch('/api/admin/issues'),
        ]);

        const regData = await regRes.json();
        const subData = await subRes.json();
        const issueData = await issueRes.json();

        if (isMounted) {
          if (regData.success) setRegistrations(regData.registrations);
          if (subData.success) setSubmissions(subData.submissions);
          if (issueData.success) setIssues(issueData.issues);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (isMounted) {
          toast.error('Failed to load dashboard data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    router.push('/admin/login');
  };

  const deleteRegistration = async (id: string, teamName: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <div>
          <p className="font-semibold text-gray-900">Delete Registration?</p>
          <p className="text-sm text-gray-600 mt-1">
            Are you sure you want to delete team &quot;<span className="font-medium">{teamName}</span>&quot;?
          </p>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading('Deleting registration...');
              try {
                const res = await fetch(`/api/admin/registrations?id=${id}`, {
                  method: 'DELETE',
                });

                if (res.ok) {
                  setRegistrations(registrations.filter(r => r._id !== id));
                  toast.success('Registration deleted successfully!', { id: loadingToast });
                } else {
                  toast.error('Failed to delete registration', { id: loadingToast });
                }
              } catch (error) {
                console.error('Error deleting registration:', error);
                toast.error('Error deleting registration', { id: loadingToast });
              }
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      style: {
        maxWidth: '400px',
      },
    });
  };

  const startEditRegistration = (reg: Registration) => {
    setEditingReg(reg._id);
    setEditingRegData({ ...reg });
    // Scroll to the editing card after state updates
    setTimeout(() => {
      editingCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  };

  const saveRegistration = async () => {
    if (!editingRegData) return;

    const loadingToast = toast.loading('Updating registration...');

    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingRegData._id,
          teamName: editingRegData.teamName,
          teamBatch: editingRegData.teamBatch,
          members: editingRegData.members,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRegistrations(registrations.map(r => r._id === editingRegData._id ? data.registration : r));
        setEditingReg(null);
        setEditingRegData(null);
        toast.success('Registration updated successfully!', { id: loadingToast });
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to update registration', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error updating registration:', error);
      toast.error('Error updating registration', { id: loadingToast });
    }
  };

  const deleteSubmission = async (id: string, teamName: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <div>
          <p className="font-semibold text-gray-900">Delete Submission?</p>
          <p className="text-sm text-gray-600 mt-1">
            Are you sure you want to delete submission from &quot;<span className="font-medium">{teamName}</span>&quot;?
          </p>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading('Deleting submission...');
              try {
                const res = await fetch(`/api/admin/submissions?id=${id}`, {
                  method: 'DELETE',
                });

                if (res.ok) {
                  setSubmissions(submissions.filter(s => s._id !== id));
                  toast.success('Submission deleted successfully!', { id: loadingToast });
                } else {
                  toast.error('Failed to delete submission', { id: loadingToast });
                }
              } catch (error) {
                console.error('Error deleting submission:', error);
                toast.error('Error deleting submission', { id: loadingToast });
              }
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      style: {
        maxWidth: '400px',
      },
    });
  };

  const startEditSubmission = (sub: Submission) => {
    setEditingSub(sub._id);
    setEditingSubData({ ...sub });
    // Scroll to the editing card after state updates
    setTimeout(() => {
      editingCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  };

  const saveSubmission = async () => {
    if (!editingSubData) return;

    const loadingToast = toast.loading('Updating submission...');

    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingSubData._id,
          teamName: editingSubData.teamName,
          githubLink: editingSubData.githubLink,
          googleDriveLink: editingSubData.googleDriveLink,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmissions(submissions.map(s => s._id === editingSubData._id ? data.submission : s));
        setEditingSub(null);
        setEditingSubData(null);
        toast.success('Submission updated successfully!', { id: loadingToast });
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to update submission', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error updating submission:', error);
      toast.error('Error updating submission', { id: loadingToast });
    }
  };

  const updateIssueStatus = async (id: string, status: string, adminNotes?: string) => {
    const loadingToast = toast.loading('Updating issue...');

    try {
      const res = await fetch('/api/admin/issues', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, adminNotes }),
      });

      if (res.ok) {
        const data = await res.json();
        setIssues(issues.map(i => i._id === id ? data.issue : i));
        setEditingIssue(null);
        setEditingIssueData(null);
        toast.success('Issue updated successfully!', { id: loadingToast });
      } else {
        toast.error('Failed to update issue', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error updating issue:', error);
      toast.error('Error updating issue', { id: loadingToast });
    }
  };

  const deleteIssue = async (id: string, teamName: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <div>
          <p className="font-semibold text-gray-900">Delete Issue?</p>
          <p className="text-sm text-gray-600 mt-1">
            Are you sure you want to delete the issue from &quot;<span className="font-medium">{teamName}</span>&quot;?
          </p>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading('Deleting issue...');
              try {
                const res = await fetch(`/api/admin/issues?id=${id}`, {
                  method: 'DELETE',
                });

                if (res.ok) {
                  setIssues(issues.filter(i => i._id !== id));
                  toast.success('Issue deleted successfully!', { id: loadingToast });
                } else {
                  toast.error('Failed to delete issue', { id: loadingToast });
                }
              } catch (error) {
                console.error('Error deleting issue:', error);
                toast.error('Error deleting issue', { id: loadingToast });
              }
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      style: {
        maxWidth: '400px',
      },
    });
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index} className="bg-yellow-400 text-gray-900 px-0.5 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const renderRegistrations = () => {
    // Filter registrations based on search query
    const filteredRegistrations = registrations.filter((reg) => {
      const query = searchQuery.toLowerCase();
      return (
        reg.teamName.toLowerCase().includes(query) ||
        reg.teamBatch.includes(query) ||
        reg.members.some(
          (member) =>
            member.fullName.toLowerCase().includes(query) ||
            member.indexNumber.toLowerCase().includes(query) ||
            member.email.toLowerCase().includes(query)
        )
      );
    });

    return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">
          Team Registrations ({filteredRegistrations.length}/{registrations.length})
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by team name, batch, member..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37c2cc] focus:border-transparent transition w-full sm:w-64"
          />

          {/* View Mode Toggle */}
          <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-2 px-4 py-2 rounded transition ${
                viewMode === 'card'
                  ? 'bg-[#37c2cc] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FiGrid /> Card
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded transition ${
                viewMode === 'table'
                  ? 'bg-[#37c2cc] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FiList /> Table
            </button>
          </div>
        </div>
      </div>

      {filteredRegistrations.length === 0 ? (
        <div className="text-center py-12 bg-white/5 border border-white/10 rounded-lg">
          <p className="text-gray-400 text-lg">No registrations found matching your search.</p>
        </div>
      ) : viewMode === 'card' ? (
        // Card View
        <div className="grid gap-4">
        {filteredRegistrations.map((reg) => (
          <div
            key={reg._id}
            ref={editingReg === reg._id ? editingCardRef : null}
            className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition"
          >
            {editingReg === reg._id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Team Name</label>
                      <input
                        type="text"
                        value={editingRegData?.teamName || ''}
                        onChange={(e) => setEditingRegData({ ...editingRegData!, teamName: e.target.value })}
                        className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Batch</label>
                      <select
                        value={editingRegData?.teamBatch || ''}
                        onChange={(e) => setEditingRegData({ ...editingRegData!, teamBatch: e.target.value })}
                        className="bg-[#1a2942] border border-white/20 rounded px-3 py-2 text-white w-full"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="23" className="bg-[#1a2942] text-white">Batch 23</option>
                        <option value="24" className="bg-[#1a2942] text-white">Batch 24</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-2 block font-semibold">Team Members</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {editingRegData?.members.map((member, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 rounded p-3 space-y-2">
                        <div className="text-xs text-[#37c2cc] font-semibold mb-2">
                          {idx === 0 ? '👑 Team Leader' : `Member ${idx + 1}`}
                        </div>
                        <input
                          type="text"
                          value={member.fullName}
                          onChange={(e) => {
                            const newMembers = [...editingRegData.members];
                            newMembers[idx].fullName = e.target.value;
                            setEditingRegData({ ...editingRegData, members: newMembers });
                          }}
                          className="bg-white/10 border border-white/20 rounded px-2 py-1.5 text-white w-full text-sm"
                          placeholder="Full Name"
                        />
                        <input
                          type="text"
                          value={member.indexNumber}
                          onChange={(e) => {
                            const newMembers = [...editingRegData.members];
                            newMembers[idx].indexNumber = e.target.value;
                            setEditingRegData({ ...editingRegData, members: newMembers });
                          }}
                          className="bg-white/10 border border-white/20 rounded px-2 py-1.5 text-white w-full text-sm"
                          placeholder="Index Number"
                        />
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) => {
                            const newMembers = [...editingRegData.members];
                            newMembers[idx].email = e.target.value;
                            setEditingRegData({ ...editingRegData, members: newMembers });
                          }}
                          className="bg-white/10 border border-white/20 rounded px-2 py-1.5 text-white w-full text-sm"
                          placeholder="Email"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={saveRegistration}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white transition font-medium"
                  >
                    <FiSave /> Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditingReg(null);
                      setEditingRegData(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded text-white transition font-medium"
                  >
                    <FiX /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {highlightText(reg.teamName, searchQuery)}
                    </h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="px-3 py-1 bg-[#37c2cc]/20 border border-[#37c2cc]/30 text-[#37c2cc] rounded-full font-medium">
                        Batch {highlightText(reg.teamBatch, searchQuery)}
                      </span>
                      <span className="text-gray-400">
                        Registered: {new Date(reg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditRegistration(reg)}
                      className="p-2 bg-blue-500 hover:bg-blue-600 rounded text-white transition"
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => deleteRegistration(reg._id, reg.teamName)}
                      className="p-2 bg-red-500 hover:bg-red-600 rounded text-white transition"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {reg.members.map((member, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded p-3">
                      <div className="text-xs text-[#37c2cc] font-semibold mb-2">
                        {idx === 0 ? '👑 Team Leader' : `Member ${idx + 1}`}
                      </div>
                      <div className="text-white font-medium mb-1">
                        {highlightText(member.fullName, searchQuery)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {highlightText(member.indexNumber, searchQuery)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {highlightText(member.email, searchQuery)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        </div>
      ) : (
        // Table View
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col className="w-[15%]" />
              <col className="w-[10%]" />
              <col className="w-[25%]" />
              <col className="w-[25%]" />
              <col className="w-[12%]" />
              <col className="w-[13%]" />
            </colgroup>
            <thead className="bg-white/10 border-b-2 border-[#37c2cc]/30">
              <tr>
                <th className="px-6 py-4 text-gray-200 font-semibold text-sm uppercase tracking-wider">Team Name</th>
                <th className="px-6 py-4 text-gray-200 font-semibold text-sm uppercase tracking-wider">Batch</th>
                <th className="px-6 py-4 text-gray-200 font-semibold text-sm uppercase tracking-wider">Team Leader</th>
                <th className="px-6 py-4 text-gray-200 font-semibold text-sm uppercase tracking-wider">Other Members</th>
                <th className="px-6 py-4 text-gray-200 font-semibold text-sm uppercase tracking-wider">Registered</th>
                <th className="px-6 py-4 text-gray-200 font-semibold text-sm uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRegistrations.map((reg) => (
                <tr key={reg._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-5">
                    <div className="text-white font-semibold text-base" title={reg.teamName}>
                      {highlightText(reg.teamName, searchQuery)}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-block px-4 py-1.5 bg-[#37c2cc]/20 border border-[#37c2cc]/40 text-[#37c2cc] rounded-full font-semibold text-sm">
                      {highlightText(reg.teamBatch, searchQuery)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-400 text-lg flex-shrink-0">👑</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-white font-medium text-sm mb-0.5" title={reg.members[0]?.fullName}>
                          {highlightText(reg.members[0]?.fullName || '', searchQuery)}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          {highlightText(reg.members[0]?.indexNumber || '', searchQuery)}
                        </div>
                        <div className="text-xs text-gray-500" title={reg.members[0]?.email}>
                          {highlightText(reg.members[0]?.email || '', searchQuery)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-3">
                      {reg.members.slice(1).map((member, idx) => (
                        <div key={idx} className="flex flex-col border-l-2 border-gray-600 pl-3 min-w-0">
                          <div className="text-white text-sm font-medium" title={member.fullName}>
                            {highlightText(member.fullName, searchQuery)}
                          </div>
                          <div className="text-xs text-gray-400 font-mono">
                            {highlightText(member.indexNumber, searchQuery)}
                          </div>
                          <div className="text-xs text-gray-500" title={member.email}>
                            {highlightText(member.email, searchQuery)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-gray-400 text-sm">
                      {new Date(reg.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => {
                          setViewMode('card');
                          startEditRegistration(reg);
                        }}
                        className="p-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors shadow-lg"
                        title="Edit Registration"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteRegistration(reg._id, reg.teamName)}
                        className="p-2.5 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors shadow-lg"
                        title="Delete Registration"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    );
  };

  const renderSubmissions = () => {
    // Filter submissions based on search query
    const filteredSubmissions = submissions.filter((sub) => {
      const query = submissionSearch.toLowerCase();
      return (
        sub.teamName.toLowerCase().includes(query) ||
        sub.githubLink.toLowerCase().includes(query) ||
        sub.googleDriveLink.toLowerCase().includes(query)
      );
    });

    return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">
          Project Submissions ({filteredSubmissions.length}/{submissions.length})
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by team name or links..."
            value={submissionSearch}
            onChange={(e) => setSubmissionSearch(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37c2cc] focus:border-transparent transition w-full sm:w-64"
          />

          {/* View Mode Toggle */}
          <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
            <button
              onClick={() => setSubmissionViewMode('card')}
              className={`flex items-center gap-2 px-4 py-2 rounded transition ${
                submissionViewMode === 'card'
                  ? 'bg-[#37c2cc] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FiGrid /> Card
            </button>
            <button
              onClick={() => setSubmissionViewMode('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded transition ${
                submissionViewMode === 'table'
                  ? 'bg-[#37c2cc] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FiList /> Table
            </button>
          </div>
        </div>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="text-center py-12 bg-white/5 border border-white/10 rounded-lg">
          <p className="text-gray-400 text-lg">No submissions found matching your search.</p>
        </div>
      ) : submissionViewMode === 'card' ? (
        // Card View
        <div className="grid gap-4">
          {filteredSubmissions.map((sub) => (
            <div
              key={sub._id}
              ref={editingSub === sub._id ? editingCardRef : null}
              className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition"
            >
              {editingSub === sub._id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Team Name</label>
                    <input
                      type="text"
                      value={editingSubData?.teamName || ''}
                      onChange={(e) => setEditingSubData({ ...editingSubData!, teamName: e.target.value })}
                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">GitHub Repository Link</label>
                    <input
                      type="text"
                      value={editingSubData?.githubLink || ''}
                      onChange={(e) => setEditingSubData({ ...editingSubData!, githubLink: e.target.value })}
                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white w-full"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Google Drive Folder Link</label>
                    <input
                      type="text"
                      value={editingSubData?.googleDriveLink || ''}
                      onChange={(e) => setEditingSubData({ ...editingSubData!, googleDriveLink: e.target.value })}
                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white w-full"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={saveSubmission}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white transition font-medium"
                    >
                      <FiSave /> Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setEditingSub(null);
                        setEditingSubData(null);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded text-white transition font-medium"
                    >
                      <FiX /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {highlightText(sub.teamName, submissionSearch)}
                      </h3>
                      <div className="text-sm text-gray-400">
                        Submitted: {new Date(sub.submittedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditSubmission(sub)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 rounded text-white transition"
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => deleteSubmission(sub._id, sub.teamName)}
                        className="p-2 bg-red-500 hover:bg-red-600 rounded text-white transition"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white/5 border border-white/10 rounded p-4">
                      <div className="text-xs text-[#37c2cc] font-semibold mb-2">📁 GitHub Repository</div>
                      <a
                        href={sub.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-[#37c2cc] break-all transition"
                      >
                        {highlightText(sub.githubLink, submissionSearch)}
                      </a>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded p-4">
                      <div className="text-xs text-[#37c2cc] font-semibold mb-2">☁️ Google Drive Folder</div>
                      <a
                        href={sub.googleDriveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-[#37c2cc] break-all transition"
                      >
                        {highlightText(sub.googleDriveLink, submissionSearch)}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Table View
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col className="w-[20%]" />
              <col className="w-[35%]" />
              <col className="w-[35%]" />
              <col className="w-[10%]" />
            </colgroup>
            <thead className="bg-white/10 border-b-2 border-[#37c2cc]/30">
              <tr>
                <th className="px-6 py-4 text-gray-200 font-semibold text-sm uppercase tracking-wider">Team Name</th>
                <th className="px-6 py-4 text-gray-200 font-semibold text-sm uppercase tracking-wider">GitHub Repository</th>
                <th className="px-6 py-4 text-gray-200 font-semibold text-sm uppercase tracking-wider">Google Drive Folder</th>
                <th className="px-6 py-4 text-gray-200 font-semibold text-sm uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSubmissions.map((sub) => (
                <tr key={sub._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-5">
                    <div className="text-white font-semibold text-base" title={sub.teamName}>
                      {highlightText(sub.teamName, submissionSearch)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(sub.submittedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-start gap-2">
                      <span className="text-lg flex-shrink-0">📁</span>
                      <a
                        href={sub.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#37c2cc] hover:underline text-sm break-all"
                        title={sub.githubLink}
                      >
                        {highlightText(sub.githubLink, submissionSearch)}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-start gap-2">
                      <span className="text-lg flex-shrink-0">☁️</span>
                      <a
                        href={sub.googleDriveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#37c2cc] hover:underline text-sm break-all"
                        title={sub.googleDriveLink}
                      >
                        {highlightText(sub.googleDriveLink, submissionSearch)}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => {
                          setSubmissionViewMode('card');
                          startEditSubmission(sub);
                        }}
                        className="p-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors shadow-lg"
                        title="Edit Submission"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteSubmission(sub._id, sub.teamName)}
                        className="p-2.5 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors shadow-lg"
                        title="Delete Submission"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    );
  };

  const renderIssues = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Reported Issues ({issues.length})</h2>
      </div>

      <div className="grid gap-4">
        {issues.map((issue) => (
          <div key={issue._id} className="bg-white/5 border border-white/10 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">{issue.teamName}</h3>
                <div className="flex gap-4 text-sm text-gray-400">
                  <span>{issue.contactNumber}</span>
                  <span>{issue.email}</span>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <select
                  value={issue.status}
                  onChange={(e) => updateIssueStatus(issue._id, e.target.value)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    issue.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                    issue.status === 'in-progress' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    'bg-green-500/20 text-green-300 border border-green-500/30'
                  }`}
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="pending" className="bg-[#1a2942] text-white">Pending</option>
                  <option value="in-progress" className="bg-[#1a2942] text-white">In Progress</option>
                  <option value="resolved" className="bg-[#1a2942] text-white">Resolved</option>
                </select>
                <button
                  onClick={() => deleteIssue(issue._id, issue.teamName)}
                  className="p-2 bg-red-500 hover:bg-red-600 rounded text-white transition"
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">Problem Type:</div>
              <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                issue.problemType === 'registration' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                issue.problemType === 'submission' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                'bg-gray-500/20 text-gray-300 border border-gray-500/30'
              }`}>
                {issue.problemType.charAt(0).toUpperCase() + issue.problemType.slice(1)}
              </span>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">Issue Description:</div>
              <p className="text-white bg-white/5 p-3 rounded">{issue.reason}</p>
            </div>

            {editingIssue === issue._id ? (
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-1">Admin Notes:</div>
                <textarea
                  value={editingIssueData?.adminNotes || ''}
                  onChange={(e) => setEditingIssueData({ ...editingIssueData!, adminNotes: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                  rows={3}
                  placeholder="Add notes..."
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => updateIssueStatus(issue._id, editingIssueData!.status, editingIssueData!.adminNotes)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white transition"
                  >
                    Save Notes
                  </button>
                  <button
                    onClick={() => {
                      setEditingIssue(null);
                      setEditingIssueData(null);
                    }}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded text-white transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {issue.adminNotes && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-1">Admin Notes:</div>
                    <p className="text-gray-300 bg-white/5 p-3 rounded">{issue.adminNotes}</p>
                  </div>
                )}
                <button
                  onClick={() => {
                    setEditingIssue(issue._id);
                    setEditingIssueData({ ...issue });
                  }}
                  className="text-sm text-[#37c2cc] hover:text-[#2ba8b3] transition"
                >
                  {issue.adminNotes ? 'Edit Notes' : 'Add Notes'}
                </button>
              </>
            )}

            <div className="text-xs text-gray-500 mt-4">
              Reported: {new Date(issue.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDashboard = () => {
    // Calculate statistics
    const batch23Count = registrations.filter(reg => reg.teamBatch === '23').length;
    const batch24Count = registrations.filter(reg => reg.teamBatch === '24').length;
    const pendingIssues = issues.filter(issue => issue.status === 'pending').length;
    const resolvedIssues = issues.filter(issue => issue.status === 'resolved').length;

    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white mb-6">Dashboard Overview</h2>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Registrations */}
          <div className="bg-gradient-to-br from-[#37c2cc]/20 to-[#2ba8b3]/10 border border-[#37c2cc]/30 rounded-xl p-6 hover:shadow-lg hover:shadow-[#37c2cc]/20 transition">
            <div className="flex items-center justify-between mb-4">
              <FiUsers className="text-4xl text-[#37c2cc]" />
              <FiTrendingUp className="text-2xl text-[#37c2cc]/60" />
            </div>
            <h3 className="text-gray-300 text-sm font-medium mb-2">Total Registrations</h3>
            <p className="text-4xl font-bold text-white">{registrations.length}</p>
          </div>

          {/* Batch 23 */}
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500/20 transition">
            <div className="flex items-center justify-between mb-4">
              <FiUserCheck className="text-4xl text-purple-400" />
              <span className="text-xs font-semibold px-3 py-1 bg-purple-500/30 text-purple-300 rounded-full">Batch 23</span>
            </div>
            <h3 className="text-gray-300 text-sm font-medium mb-2">Batch 23 Teams</h3>
            <p className="text-4xl font-bold text-white">{batch23Count}</p>
          </div>

          {/* Batch 24 */}
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/20 transition">
            <div className="flex items-center justify-between mb-4">
              <FiUserCheck className="text-4xl text-blue-400" />
              <span className="text-xs font-semibold px-3 py-1 bg-blue-500/30 text-blue-300 rounded-full">Batch 24</span>
            </div>
            <h3 className="text-gray-300 text-sm font-medium mb-2">Batch 24 Teams</h3>
            <p className="text-4xl font-bold text-white">{batch24Count}</p>
          </div>

          {/* Total Submissions */}
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-green-500/20 transition">
            <div className="flex items-center justify-between mb-4">
              <FiUpload className="text-4xl text-green-400" />
              <FiFileText className="text-2xl text-green-400/60" />
            </div>
            <h3 className="text-gray-300 text-sm font-medium mb-2">Total Submissions</h3>
            <p className="text-4xl font-bold text-white">{submissions.length}</p>
          </div>

          {/* Pending Issues */}
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-yellow-500/20 transition">
            <div className="flex items-center justify-between mb-4">
              <FiAlertCircle className="text-4xl text-yellow-400" />
            </div>
            <h3 className="text-gray-300 text-sm font-medium mb-2">Pending Issues</h3>
            <p className="text-4xl font-bold text-white">{pendingIssues}</p>
          </div>

          {/* Resolved Issues */}
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-emerald-500/20 transition">
            <div className="flex items-center justify-between mb-4">
              <FiAlertCircle className="text-4xl text-emerald-400" />
            </div>
            <h3 className="text-gray-300 text-sm font-medium mb-2">Resolved Issues</h3>
            <p className="text-4xl font-bold text-white">{resolvedIssues}</p>
          </div>

          {/* Total Issues */}
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-red-500/20 transition">
            <div className="flex items-center justify-between mb-4">
              <FiAlertCircle className="text-4xl text-red-400" />
            </div>
            <h3 className="text-gray-300 text-sm font-medium mb-2">Total Issues</h3>
            <p className="text-4xl font-bold text-white">{issues.length}</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-white mb-4">Quick Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/register"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-5 transition group"
            >
              <div className="flex items-center gap-4">
                <FiUsers className="text-3xl text-[#37c2cc]" />
                <div>
                  <h4 className="text-white font-semibold">Registration Page</h4>
                  <p className="text-gray-400 text-sm">Open team registration</p>
                </div>
              </div>
              <FiExternalLink className="text-gray-400 group-hover:text-[#37c2cc] transition" />
            </a>

            <a
              href="/submission"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-5 transition group"
            >
              <div className="flex items-center gap-4">
                <FiUpload className="text-3xl text-green-400" />
                <div>
                  <h4 className="text-white font-semibold">Submission Page</h4>
                  <p className="text-gray-400 text-sm">Open project submissions</p>
                </div>
              </div>
              <FiExternalLink className="text-gray-400 group-hover:text-green-400 transition" />
            </a>

            <a
              href="/report-issue"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-5 transition group"
            >
              <div className="flex items-center gap-4">
                <FiAlertCircle className="text-3xl text-yellow-400" />
                <div>
                  <h4 className="text-white font-semibold">Report Issue Page</h4>
                  <p className="text-gray-400 text-sm">Open issue reporting</p>
                </div>
              </div>
              <FiExternalLink className="text-gray-400 group-hover:text-yellow-400 transition" />
            </a>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0e243f] via-[#204168] to-[#0e243f]">
        <div className="text-center">
          <div className="relative">
            {/* Outer spinning ring */}
            <div className="w-20 h-20 border-4 border-[#37c2cc]/20 border-t-[#37c2cc] rounded-full animate-spin mx-auto"></div>
            {/* Inner pulsing circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#37c2cc]/30 rounded-full animate-pulse"></div>
          </div>
          <p className="text-white text-xl font-semibold mt-6 animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a2942',
            color: '#fff',
            border: '1px solid rgba(55, 194, 204, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#37c2cc',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-[#0e243f] via-[#204168] to-[#0e243f]">

        {/* Fixed Admin Header - positioned below main navbar */}
        <div className="fixed top-14 sm:top-16 left-0 right-0 z-40 bg-white/5 backdrop-blur-lg border-b border-white/10">
          <div className="container mx-auto px-6 py-3">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-white">CodeRush 2025 Admin</h1>
                <p className="text-gray-400 text-xs">Welcome, {adminUsername}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition text-sm"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Spacer for main navbar + admin header */}
        <div className="h-[100px] sm:h-[104px]"></div>

        {/* Tabs */}
        <div className="container mx-auto px-6 pt-0 pb-4">
          <div className="flex gap-4 mb-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-[#37c2cc] text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <FiHome />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('registrations')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
                activeTab === 'registrations'
                  ? 'bg-[#37c2cc] text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <FiUsers />
              Registrations ({registrations.length})
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
                activeTab === 'submissions'
                  ? 'bg-[#37c2cc] text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <FiUpload />
              Submissions ({submissions.length})
            </button>
            <button
              onClick={() => setActiveTab('issues')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
                activeTab === 'issues'
                  ? 'bg-[#37c2cc] text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <FiAlertCircle />
              Issues ({issues.length})
            </button>
          </div>

          {/* Content */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'registrations' && renderRegistrations()}
            {activeTab === 'submissions' && renderSubmissions()}
            {activeTab === 'issues' && renderIssues()}
          </div>
        </div>
      </div>
    </>
  );
}
