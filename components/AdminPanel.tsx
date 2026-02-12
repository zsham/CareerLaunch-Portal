
import React, { useState } from 'react';
import { Job, Application, ApplicationStatus, UserProfile } from '../types';
import { Button } from './Button';
import { enhanceJobDescription } from '../services/geminiService';

interface AdminPanelProps {
  jobs: Job[];
  applications: Application[];
  users: UserProfile[];
  onAddJob: (job: Job) => void;
  onUpdateApplicationStatus: (appId: string, status: ApplicationStatus) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  jobs, 
  applications, 
  users, 
  onAddJob, 
  onUpdateApplicationStatus 
}) => {
  const [newJob, setNewJob] = useState({ title: '', company: '', location: '', description: '', salary: '' });
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhance = async () => {
    if (!newJob.title || !newJob.description) return;
    setIsEnhancing(true);
    const enhanced = await enhanceJobDescription(newJob.title, newJob.description);
    setNewJob(prev => ({ ...prev, description: enhanced }));
    setIsEnhancing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const job: Job = {
      ...newJob,
      id: Math.random().toString(36).substr(2, 9),
      postedAt: Date.now()
    };
    onAddJob(job);
    setNewJob({ title: '', company: '', location: '', description: '', salary: '' });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4 flex items-center text-indigo-900">
          <i className="fas fa-plus-circle mr-2"></i> Post New Job
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <input 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Job Title (e.g. Senior Frontend Engineer)"
              value={newJob.title}
              onChange={e => setNewJob(p => ({ ...p, title: e.target.value }))}
              required
            />
            <input 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Company"
              value={newJob.company}
              onChange={e => setNewJob(p => ({ ...p, company: e.target.value }))}
              required
            />
            <input 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Location"
              value={newJob.location}
              onChange={e => setNewJob(p => ({ ...p, location: e.target.value }))}
              required
            />
             <input 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Salary Range (Optional)"
              value={newJob.salary}
              onChange={e => setNewJob(p => ({ ...p, salary: e.target.value }))}
            />
          </div>
          <div className="space-y-4">
            <textarea 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 h-32 transition-all"
              placeholder="Job Description..."
              value={newJob.description}
              onChange={e => setNewJob(p => ({ ...p, description: e.target.value }))}
              required
            />
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="secondary" 
                className="flex-1"
                onClick={handleEnhance}
                isLoading={isEnhancing}
                disabled={!newJob.description}
              >
                <i className="fas fa-magic mr-2"></i> Enhance with AI
              </Button>
              <Button type="submit" className="flex-1">Post Job</Button>
            </div>
          </div>
        </form>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <h2 className="text-xl font-bold mb-4 flex items-center text-indigo-900">
          <i className="fas fa-clipboard-list mr-2"></i> Review Applications
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-sm">
                <th className="pb-4 font-medium">Candidate</th>
                <th className="pb-4 font-medium">Job Applied</th>
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 italic">No applications received yet.</td>
                </tr>
              ) : (
                applications.map(app => {
                  const job = jobs.find(j => j.id === app.jobId);
                  const user = users.find(u => u.id === app.userId);
                  return (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <div className="font-semibold text-gray-900">{user?.name}</div>
                        <div className="text-xs text-gray-500">{user?.email}</div>
                      </td>
                      <td className="py-4">
                        <div className="text-gray-900">{job?.title}</div>
                        <div className="text-xs text-indigo-600">{job?.company}</div>
                      </td>
                      <td className="py-4 text-sm text-gray-500">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          app.status === ApplicationStatus.ACCEPTED ? 'bg-green-100 text-green-700' :
                          app.status === ApplicationStatus.REJECTED ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => onUpdateApplicationStatus(app.id, ApplicationStatus.ACCEPTED)}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="Accept"
                          >
                            <i className="fas fa-check-circle"></i>
                          </button>
                          <button 
                            onClick={() => onUpdateApplicationStatus(app.id, ApplicationStatus.REJECTED)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Reject"
                          >
                            <i className="fas fa-times-circle"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
