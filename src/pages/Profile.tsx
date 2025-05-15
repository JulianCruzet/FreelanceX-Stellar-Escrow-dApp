import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import Footer from '../components/Footer';

interface Job {
  id: number;
  title: string;
  company: string;
  status: string;
  progress?: number;
  amount?: string;
  completedAt?: string;
}

const mockUser = {
  name: 'John Doe',
  title: 'Full Stack Developer',
  rating: 4.8,
  completedJobsCount: 12,
  totalEarned: '25,000 USDC',
  skills: ['React', 'TypeScript', 'Solidity', 'Node.js', 'Web3'],
  bio: 'Experienced full stack developer with a focus on blockchain and decentralized applications. Passionate about building secure and scalable solutions.',
  activeJobs: [
    {
      id: 1,
      title: 'Smart Contract Development',
      company: 'Web3 Ventures',
      status: 'in_progress',
      progress: 60,
    },
    {
      id: 2,
      title: 'UI/UX Design',
      company: 'Design Studio X',
      status: 'pending',
      progress: 0,
    },
  ] as Job[],
  completedJobs: [
    {
      id: 3,
      title: 'DeFi Protocol Integration',
      company: 'DeFi Labs',
      status: 'completed',
      amount: '5000 USDC',
      completedAt: '2024-02-15',
    },
    {
      id: 4,
      title: 'NFT Marketplace Development',
      company: 'NFT Studio',
      status: 'completed',
      amount: '8000 USDC',
      completedAt: '2024-01-30',
    },
  ] as Job[],
};

const Profile = () => {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {mockUser.name[0]}
                </span>
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockUser.name}</h1>
              <p className="text-xl text-gray-600 mb-4">{mockUser.title}</p>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 font-medium">{mockUser.rating}</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{mockUser.completedJobsCount} jobs completed</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{mockUser.totalEarned} earned</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {mockUser.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <p className="text-gray-700">{mockUser.bio}</p>
            </div>
          </div>
        </div>

        {/* Active Jobs */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Jobs</h2>
          <div className="space-y-6">
            {mockUser.activeJobs.map((job) => (
              <div key={job.id} className="p-6 border border-gray-200 rounded-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-gray-600">{job.company}</p>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                    {job.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{job.progress}% complete</span>
                  <Link
                    to={`/job/${job.id}`}
                    className="text-orange-500 hover:text-orange-600 font-medium text-sm"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Jobs */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Completed Jobs</h2>
          <div className="space-y-6">
            {mockUser.completedJobs.map((job) => (
              <div key={job.id} className="p-6 border border-gray-200 rounded-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-gray-600">{job.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-500 font-medium">{job.amount}</p>
                    <p className="text-sm text-gray-500">
                      Completed {new Date(job.completedAt!).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
};

export default Profile; 