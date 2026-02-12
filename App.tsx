
import React, { useState, useEffect } from 'react';
import { AppRole, Job, Application, UserProfile, ApplicationStatus } from './types';
import { AdminPanel } from './components/AdminPanel';
import { UserPanel } from './components/UserPanel';
import { AuthScreen } from './components/AuthScreen';
import { Button } from './components/Button';

// Initial Mock Data
const INITIAL_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Product Designer',
    company: 'Skyline Tech',
    location: 'Remote',
    salary: '$120k - $160k',
    description: 'We are looking for a visionary Product Designer to lead our mobile app redesign. You should have at least 5 years of experience in high-growth startups and a portfolio showcasing complex UX challenges.',
    postedAt: Date.now() - 86400000
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'CloudWorks',
    location: 'Austin, TX',
    salary: '$100k - $140k',
    description: 'Join our cloud infrastructure team to build scalable services using React, Node.js, and AWS. Experience with Kubernetes and Docker is a huge plus.',
    postedAt: Date.now() - 43200000
  },
  {
    id: '3',
    title: 'Marketing Specialist',
    company: 'BrightEdge',
    location: 'New York, NY',
    salary: '$80k - $110k',
    description: 'Manage our social media presence and digital marketing campaigns. Ideal candidate has 2-3 years of experience in content creation and SEO.',
    postedAt: Date.now() - 172800000
  }
];

const ADMIN_USER: UserProfile = {
  id: 'admin_1',
  name: 'Admin User',
  email: 'admin@portal.com',
  password: 'password123',
  bio: 'Platform Administrator',
  skills: [],
  role: AppRole.ADMIN
};

const INITIAL_USER: UserProfile = {
  id: 'user_1',
  name: 'Alex Rivera',
  email: 'alex@candidate.com',
  password: 'password123',
  bio: 'Passionate software engineer with a focus on creating intuitive user experiences. Expert in React and TypeScript.',
  skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
  role: AppRole.USER
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('cl_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('cl_users');
    return saved ? JSON.parse(saved) : [ADMIN_USER, INITIAL_USER];
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('cl_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('cl_apps');
    return saved ? JSON.parse(saved) : [];
  });

  const [showAuthModal, setShowAuthModal] = useState(false);

  // Persist state to local storage
  useEffect(() => {
    localStorage.setItem('cl_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('cl_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('cl_apps', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cl_current_user', JSON.stringify(currentUser));
      setShowAuthModal(false);
    } else {
      localStorage.removeItem('cl_current_user');
    }
  }, [currentUser]);

  const addJob = (job: Job) => {
    setJobs(prev => [job, ...prev]);
  };

  const updateApplicationStatus = (appId: string, status: ApplicationStatus) => {
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, status } : app
    ));
  };

  const applyToJob = (jobId: string, status: ApplicationStatus, feedback: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    const newApp: Application = {
      id: Math.random().toString(36).substr(2, 9),
      jobId,
      userId: currentUser.id,
      status,
      feedback,
      appliedAt: Date.now()
    };
    setApplications(prev => [newApp, ...prev]);
  };

  const updateProfile = (profile: UserProfile) => {
    setUsers(prev => prev.map(u => u.id === profile.id ? profile : u));
    setCurrentUser(profile);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen pb-12 flex flex-col relative">
      {showAuthModal && (
        <AuthScreen 
          registeredUsers={users}
          onLogin={setCurrentUser}
          onRegister={(user) => {
            setUsers(prev => [...prev, user]);
            setCurrentUser(user);
          }}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <i className="fas fa-rocket text-xl"></i>
              </div>
              <span className="text-xl font-black text-indigo-900 tracking-tight hidden sm:block">CareerLaunch</span>
            </div>
            
            <div className="flex items-center gap-4">
              {currentUser ? (
                <>
                  <div className="hidden md:flex flex-col items-end mr-2 text-right">
                    <span className="text-sm font-bold text-gray-900">{currentUser.name}</span>
                    <span className="text-[10px] uppercase font-black tracking-widest text-indigo-500">
                      {currentUser.role === AppRole.ADMIN ? 'Employer Portal' : 'Candidate Portal'}
                    </span>
                  </div>
                  <Button variant="secondary" onClick={handleLogout} className="px-3 py-1.5 text-xs">
                    <i className="fas fa-sign-out-alt mr-2"></i> Logout
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                   <Button variant="ghost" onClick={() => setShowAuthModal(true)} className="text-sm">
                     Login
                   </Button>
                   <Button onClick={() => setShowAuthModal(true)} className="text-sm">
                     Register
                   </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero / Banner */}
      <div className="bg-indigo-900 py-10 text-white overflow-hidden relative mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
              {!currentUser 
                ? 'Your Career Starts Here' 
                : currentUser.role === AppRole.ADMIN 
                  ? 'Build Your Dream Team' 
                  : `Hello, ${currentUser.name.split(' ')[0]}!`}
            </h1>
            <p className="text-indigo-200 text-lg mb-0 font-medium opacity-90">
              {!currentUser 
                ? 'Explore the most exciting job opportunities from top companies and apply today.'
                : currentUser.role === AppRole.ADMIN 
                  ? 'Create compelling job posts and review applications from top talent.' 
                  : 'Browse curated roles and track your application results in real-time.'}
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-indigo-800 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow">
        {currentUser && currentUser.role === AppRole.ADMIN ? (
          <AdminPanel 
            jobs={jobs} 
            applications={applications} 
            users={users}
            onAddJob={addJob} 
            onUpdateApplicationStatus={updateApplicationStatus}
          />
        ) : (
          <UserPanel 
            jobs={jobs} 
            applications={applications} 
            profile={currentUser}
            onUpdateProfile={updateProfile}
            onApply={applyToJob}
            onAuthRequired={() => setShowAuthModal(true)}
          />
        )}
      </main>

      <footer className="mt-12 py-8 border-t border-gray-100 text-center text-gray-400 text-sm">
        <p>&copy; 2024 CareerLaunch Portal. Powered by Gemini AI.</p>
      </footer>
    </div>
  );
};

export default App;
