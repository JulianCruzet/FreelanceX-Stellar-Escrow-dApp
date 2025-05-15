import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import Footer from '../components/Footer';

interface Job {
  id: number;
  title: string;
  company: string;
  budget: string;
  description: string;
  skills: string[];
  location: string;
  duration: string;
  postedAt: string;
  image: string;
}

const mockJobs: Job[] = [
  {
    id: 1,
    title: 'Full Stack Developer',
    company: 'Web3 Ventures',
    budget: '5000 USDC',
    description: 'Looking for an experienced full stack developer to build a decentralized application...',
    skills: ['React', 'TypeScript', 'Solidity'],
    location: 'Remote',
    duration: '4 weeks',
    postedAt: '2024-03-10',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Smart Contract Developer',
    company: 'DeFi Labs',
    budget: '8000 USDC',
    description: 'Join our team to develop and audit smart contracts for our DeFi protocol...',
    skills: ['Solidity', 'Rust', 'Web3.js'],
    location: 'Remote',
    duration: '6 weeks',
    postedAt: '2024-03-09',
    image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    company: 'Design Studio X',
    budget: '4000 USDC',
    description: 'Create beautiful and intuitive interfaces for our Web3 products...',
    skills: ['Figma', 'UI/UX', 'Web3'],
    location: 'Remote',
    duration: '3 weeks',
    postedAt: '2024-03-08',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop'
  },
];

const FindWork = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'budget'>('recent');

  const allSkills = Array.from(new Set(mockJobs.flatMap(job => job.skills)));

  const filteredJobs = mockJobs
    .filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSkills = selectedSkills.length === 0 ||
        selectedSkills.every(skill => job.skills.includes(skill));
      return matchesSearch && matchesSkills;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      }
      return parseInt(b.budget) - parseInt(a.budget);
    });

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Filters</h2>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Search jobs..."
                />
              </div>

              {/* Skills Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <div className="space-y-2">
                  {allSkills.map((skill) => (
                    <label key={skill} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSkills([...selectedSkills, skill]);
                          } else {
                            setSelectedSkills(selectedSkills.filter(s => s !== skill));
                          }
                        }}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'recent' | 'budget')}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="budget">Highest Budget</option>
                </select>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="flex-1">
            <div className="grid gap-6">
              {filteredJobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/job/${job.id}`}
                  className="block bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group h-[240px]"
                >
                  <div className="relative flex h-full">
                    {/* Content Section */}
                    <div className="w-[60%] p-5 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-orange-500 transition-colors">{job.title}</h3>
                          <p className="text-gray-600">{job.company}</p>
                        </div>
                        <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-xl font-medium">
                          {job.budget}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-3 line-clamp-2 flex-grow">{job.description}</p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {job.duration}
                          </span>
                        </div>
                        <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Image Section with Gradient */}
                    <div className="w-[40%] relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent z-10" />
                      <img
                        src={job.image}
                        alt={job.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
};

export default FindWork; 