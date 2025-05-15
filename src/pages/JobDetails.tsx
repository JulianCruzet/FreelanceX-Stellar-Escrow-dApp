import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

interface Milestone {
  id: number;
  title: string;
  description: string;
  percentage: number;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'approved';
}

const mockJob = {
  id: 1,
  title: 'Full Stack Developer',
  budget: '5000 USDC',
  description: 'Looking for an experienced full stack developer to build a decentralized application...',
  skills: ['React', 'TypeScript', 'Solidity'],
  company: 'Web3 Ventures',
  location: 'Remote',
  duration: '4 weeks',
  milestones: [
    {
      id: 1,
      title: 'Design Phase',
      description: 'Create wireframes and design system',
      percentage: 30,
      dueDate: '2024-03-15',
      status: 'completed' as const,
    },
    {
      id: 2,
      title: 'MVP Development',
      description: 'Implement core features and smart contracts',
      percentage: 40,
      dueDate: '2024-03-30',
      status: 'in_progress' as const,
    },
    {
      id: 3,
      title: 'Testing & Deployment',
      description: 'Comprehensive testing and mainnet deployment',
      percentage: 30,
      dueDate: '2024-04-15',
      status: 'pending' as const,
    },
  ],
};

const JobDetails = () => {
  const { id } = useParams();
  const [job] = useState(mockJob);

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

  const handleApproveMilestone = async (milestoneId: number) => {
    // TODO: Integrate with Soroban smart contract
    console.log('Approving milestone:', milestoneId);
  };

  return (
    <PageTransition>
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

          <p className="text-gray-700">{job.description}</p>
        </div>

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

                {milestone.status === 'completed' && (
                  <button
                    onClick={() => handleApproveMilestone(milestone.id)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Approve & Release Payment
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default JobDetails; 