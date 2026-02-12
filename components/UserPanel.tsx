
import React, { useState } from 'react';
import { Job, Application, UserProfile, ApplicationStatus } from '../types';
import { Button } from './Button';
import { getApplicationFeedback } from '../services/geminiService';

interface UserPanelProps {
  jobs: Job[];
  applications: Application[];
  profile: UserProfile | null;
  onUpdateProfile: (profile: UserProfile) => void;
  onApply: (jobId: string, status: ApplicationStatus, feedback: string) => void;
  onAuthRequired: () => void;
}

export const UserPanel: React.FC<UserPanelProps> = ({ 
  jobs, 
  applications, 
  profile, 
  onUpdateProfile, 
  onApply,
  onAuthRequired
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile | null>(profile);
  const [isApplyingId, setIsApplyingId] = useState<string | null>(null);

  const userApps = profile ? applications.filter(a => a.userId === profile.id) : [];
  const appliedJobIds = userApps.map(a => a.jobId);
  const canApplyMore = profile ? userApps.length < 3 : true;

  const handleApply = async (job: Job) => {
    if (!profile) {
      onAuthRequired();
      return;
    }
    if (!canApplyMore) return;
    setIsApplyingId(job.id);
    
    // Use Gemini for a "mock" hiring manager evaluation
    const result = await getApplicationFeedback(job, profile);
    
    onApply(job.id, result.status as ApplicationStatus, result.feedback);
    setIsApplyingId(null);
  };

  const handleSaveProfile = () => {
    if (tempProfile) {
      onUpdateProfile(tempProfile);
      setIsEditingProfile(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Profile Section - Only visible if logged in */}
      {profile && (
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold flex items-center text-indigo-900">
              <i className="fas fa-user-circle mr-2"></i> My Profile
            </h2>
            {!isEditingProfile && (
              <Button variant="ghost" onClick={() => { setTempProfile(profile); setIsEditingProfile(true); }}>
                <i className="fas fa-edit mr-2"></i> Edit Profile
              </Button>
            )}
          </div>

          {isEditingProfile && tempProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <input 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
                  placeholder="Full Name"
                  value={tempProfile.name}
                  onChange={e => setTempProfile(p => p ? ({ ...p, name: e.target.value }) : null)}
                />
                <input 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
                  placeholder="Email"
                  value={tempProfile.email}
                  onChange={e => setTempProfile(p => p ? ({ ...p, email: e.target.value }) : null)}
                />
                <input 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
                  placeholder="Skills (comma separated)"
                  value={tempProfile.skills.join(', ')}
                  onChange={e => setTempProfile(p => p ? ({ ...p, skills: e.target.value.split(',').map(s => s.trim()) }) : null)}
                />
              </div>
              <div className="space-y-4">
                <textarea 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg h-32"
                  placeholder="Bio / About Me"
                  value={tempProfile.bio}
                  onChange={e => setTempProfile(p => p ? ({ ...p, bio: e.target.value }) : null)}
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveProfile} className="flex-1">Save Profile</Button>
                  <Button variant="ghost" onClick={() => setIsEditingProfile(false)} className="flex-1">Cancel</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                 <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold">
                  {profile.name.charAt(0)}
                 </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-gray-900">{profile.name}</h3>
                <p className="text-gray-500 mb-4">{profile.email}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.skills.map((skill, idx) => (
                    <span key={idx} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed max-w-2xl">{profile.bio}</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-xl flex-shrink-0 self-start text-center">
                 <div className="text-3xl font-bold text-indigo-600">{userApps.length}/3</div>
                 <div className="text-xs text-indigo-400 font-medium uppercase tracking-wider">Jobs Applied</div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Tabs */}
      <div className={`grid grid-cols-1 ${profile ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-8`}>
        {/* Job Feed */}
        <div className={`${profile ? 'lg:col-span-2' : 'max-w-4xl mx-auto w-full'} space-y-6`}>
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold flex items-center text-indigo-900">
              <i className="fas fa-briefcase mr-2"></i> Open Positions
            </h2>
            {!profile && (
              <span className="text-sm text-indigo-600 font-medium">Log in to apply for these roles</span>
            )}
          </div>
          <div className="space-y-4">
            {jobs.length === 0 ? (
               <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-400">No jobs posted yet. Check back later!</p>
               </div>
            ) : (
              jobs.map(job => {
                const isApplied = appliedJobIds.includes(job.id);
                return (
                  <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1 gap-4">
                          <span><i className="fas fa-building mr-1"></i> {job.company}</span>
                          <span><i className="fas fa-map-marker-alt mr-1"></i> {job.location}</span>
                          {job.salary && <span><i className="fas fa-wallet mr-1"></i> {job.salary}</span>}
                        </div>
                      </div>
                      <Button 
                        disabled={isApplied || (profile && !canApplyMore)} 
                        isLoading={isApplyingId === job.id}
                        variant={isApplied ? 'ghost' : 'primary'}
                        onClick={() => handleApply(job)}
                        className="text-sm"
                      >
                        {isApplied ? (
                          <span className="text-green-600"><i className="fas fa-check-circle mr-1"></i> Applied</span>
                        ) : profile ? 'Apply Now' : 'Sign in to Apply'}
                      </Button>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap line-clamp-3">
                      {job.description}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* My Applications (Track Status) - Only visible if logged in */}
        {profile && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center text-indigo-900 px-2">
              <i className="fas fa-tasks mr-2"></i> Application Status
            </h2>
            <div className="space-y-4">
              {userApps.length === 0 ? (
                 <div className="text-center py-12 bg-gray-100 rounded-xl">
                    <p className="text-gray-400 text-sm">You haven't applied to any jobs yet.</p>
                 </div>
              ) : (
                userApps.map(app => {
                  const job = jobs.find(j => j.id === app.jobId);
                  return (
                    <div key={app.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-indigo-500">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-bold text-gray-900">{job?.title}</div>
                          <div className="text-xs text-gray-500">{job?.company}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          app.status === ApplicationStatus.ACCEPTED ? 'bg-green-100 text-green-700' :
                          app.status === ApplicationStatus.REJECTED ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                         <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-tighter">Hiring Manager Feedback</p>
                         <p className="text-sm text-gray-700 italic">"{app.feedback || 'Still reviewing your profile...'}"</p>
                      </div>
                      <div className="mt-3 text-[10px] text-gray-400 text-right">
                        Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
