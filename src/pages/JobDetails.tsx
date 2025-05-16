import React, { useState, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
      span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
      button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
      form: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
      label: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
      input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
      textarea: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
      svg: React.DetailedHTMLProps<React.HTMLAttributes<SVGElement>, SVGElement>;
      path: React.DetailedHTMLProps<React.HTMLAttributes<SVGPathElement>, SVGPathElement>;
    }
  }
}

interface Milestone {
  id: number;
  title: string;
  description: string;
  percentage: number;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'approved';
  file?: File;
}

interface Job {
  id: number;
  title: string;
  budget: string;
  description: string;
  skills: string[];
  company: string;
  location: string;
  duration: string;
  milestones: Milestone[];
}

interface Application {
  id: number;
  freelancerName: string;
  proposal: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const mockJob = {
  id: 1,
  title: 'Web3 Developer for DApp',
  budget: '5000 USDC',
  description: 'Looking for an experienced Web3 developer to build a decentralized application with smart contracts and frontend integration',
  skills: ['React', 'TypeScript', 'Solidity'],
  company: 'Web3 Ventures',
  location: 'Remote',
  duration: '4 weeks',
  milestones: [
    {
      id: 1,
      title: 'Design Phase',
      description: 'Create wireframes and design system',
      percentage: 20,
      dueDate: '2025-05-30',
      status: 'pending' as const,
    },
    {
      id: 2,
      title: 'Smart Contract Development',
      description: 'Implement core features and smart contracts',
      percentage: 40,
      dueDate: '2025-06-15',
      status: 'pending' as const,
    },
    {
      id: 3,
      title: 'Frontend Integration & Testing',
      description: 'Integrate frontend with smart contracts and perform testing',
      percentage: 40,
      dueDate: '2025-06-30',
      status: 'pending' as const,
    },
  ],
};

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job>(mockJob);
  const [applications, setApplications] = useState<Application[]>([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [proposal, setProposal] = useState('');
  const [showJobPosted, setShowJobPosted] = useState(false);
  const [showSubmissionMessage, setShowSubmissionMessage] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  const [showApproveButtons, setShowApproveButtons] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [approvedMilestones, setApprovedMilestones] = useState<number[]>([]);
  const [showApplicationsCard, setShowApplicationsCard] = useState(false);

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in_progress':
        return 'bg-orange-100 text-orange-700';
      case 'approved':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleApply = () => {
    setShowApplicationForm(true);
  };

  const handleSubmitApplication = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newApplication = {
      id: Date.now(),
      freelancerName: 'John Doe',
      proposal,
      status: 'pending' as const,
    };
    setApplications([...applications, newApplication]);
    setShowSubmissionMessage(true);
    
    // Hide the submission message after 3 seconds and then hide the form
    setTimeout(() => {
      setShowSubmissionMessage(false);
      setShowApplicationForm(false);
      setShowEditButton(true);
      // Show applications card after the form is hidden
      setShowApplicationsCard(true);
    }, 3000);
    
    setProposal('');
    setShowJobPosted(true);
    setTimeout(() => setShowJobPosted(false), 3000);
  };

  const handleAcceptApplication = (applicationId: number) => {
    setApplications(applications.map(app => 
      app.id === applicationId ? { ...app, status: 'accepted' } : app
    ));
  };

  const handleFileUpload = (milestoneId: number, file: File) => {
    // In a real app, this would upload the file to storage
    console.log('Uploading file for milestone:', milestoneId, file);
  };

  const handleCompleteMilestone = (milestoneId: number) => {
    // Update the milestone status in the job state
    setJob(prevJob => ({
      ...prevJob,
      milestones: prevJob.milestones.map(milestone =>
        milestone.id === milestoneId
          ? { ...milestone, status: 'completed' }
          : milestone
      )
    }));

    // Check if all milestones are completed
    const allCompleted = job.milestones.every(m => m.id === milestoneId || m.status === 'completed');
    if (allCompleted) {
      // Wait 3 seconds before showing approve buttons
      setTimeout(() => {
        setShowApproveButtons(true);
      }, 3000);
    }
  };

  const handleApproveMilestone = async (milestoneId: number) => {
    // In a real app, this would release payment through smart contract
    console.log('Approving milestone and releasing payment:', milestoneId);
    setApprovedMilestones(prev => [...prev, milestoneId]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Job Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <p className="text-gray-600">{job.company}</p>
          </div>
          <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-xl font-medium">
            {job.budget}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {job.duration}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {job.skills.join(', ')}
          </div>
        </div>

        <p className="text-gray-700 mb-6">{job.description}</p>

        {!applications.some(app => app.status === 'accepted') && (
          <button
            onClick={handleApply}
            className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-lg"
          >
            {showEditButton ? 'Edit Listing' : 'Apply for this Job'}
          </button>
        )}
      </div>

      {/* Application Form */}
      {showApplicationForm && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          {!showSubmissionMessage ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Application</h2>
              <form onSubmit={handleSubmitApplication}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Proposal
                  </label>
                  <textarea
                    value={proposal}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setProposal(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows={6}
                    placeholder="Describe why you're the best fit for this job..."
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all"
                  >
                    Submit Application
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-48">
              <h2 className="text-2xl font-bold text-green-600 animate-pulse">Application Submitted!</h2>
            </div>
          )}
        </div>
      )}

      {/* Applications */}
      {showApplicationsCard && applications.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Applications</h2>
          <div className="space-y-6">
            {applications.map((application) => (
              <div key={application.id} className="p-6 border border-gray-200 rounded-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{application.freelancerName}</h3>
                    <p className="text-gray-600">{application.proposal}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    application.status === 'accepted' ? 'bg-green-100 text-green-700' :
                    application.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {application.status}
                  </span>
                </div>
                {application.status === 'pending' && (
                  <button
                    onClick={() => handleAcceptApplication(application.id)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all"
                  >
                    Accept Application
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Milestones */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Milestones</h2>
        <div className="space-y-6">
          {job.milestones.map((milestone) => (
            <div key={milestone.id} className="p-6 border border-gray-200 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(milestone.status)}`}>
                  {milestone.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Due Date</span>
                  <p className="text-gray-900">{new Date(milestone.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Percentage</span>
                  <p className="text-gray-900">{milestone.percentage}%</p>
                </div>
              </div>

              {applications.some(app => app.status === 'accepted') && (
                <div className="space-y-4">
                  {milestone.status === 'pending' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Deliverable
                      </label>
                      <input
                        type="file"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => e.target.files && handleFileUpload(milestone.id, e.target.files[0])}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      <button
                        onClick={() => handleCompleteMilestone(milestone.id)}
                        className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all"
                      >
                        Mark as Complete
                      </button>
                    </div>
                  )}
                  {milestone.status === 'completed' && !showApproveButtons && (
                    <div className="w-full px-4 py-2 bg-orange-100 text-orange-700 rounded-xl font-semibold text-center">
                      Waiting Verification
                    </div>
                  )}
                  {milestone.status === 'completed' && showApproveButtons && (
                    approvedMilestones.includes(milestone.id) ? (
                      <div className="w-full px-4 py-2 bg-green-100 text-green-700 rounded-xl font-semibold text-center">
                        Completed!
                      </div>
                    ) : (
                      <button
                        onClick={() => handleApproveMilestone(milestone.id)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-lg"
                      >
                        Approve & Release Payment
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobDetails; 