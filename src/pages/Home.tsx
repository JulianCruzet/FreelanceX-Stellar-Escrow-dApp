import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const featuredJobs = [
  {
    id: 1,
    title: 'Full Stack Developer',
    budget: '5000 USDC',
    description: 'Looking for an experienced full stack developer to build a decentralized application...',
    skills: ['React', 'TypeScript', 'Solidity'],
    company: 'Web3 Ventures',
    location: 'Remote',
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    budget: '3000 USDC',
    description: 'Need a talented UI/UX designer to create a modern and intuitive interface...',
    skills: ['Figma', 'UI Design', 'User Research'],
    company: 'Design Studio X',
    location: 'Remote',
  },
  {
    id: 3,
    title: 'Smart Contract Developer',
    budget: '8000 USDC',
    description: 'Seeking a smart contract developer to implement complex DeFi protocols...',
    skills: ['Solidity', 'Rust', 'Web3'],
    company: 'DeFi Labs',
    location: 'Remote',
  },
];

const successStories = [
  {
    name: 'Alice Johnson',
    role: 'Full Stack Developer',
    text: 'FreelanceX made it so easy to get paid securely. The escrow system gave me peace of mind and my client was happy too!',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Carlos Rivera',
    role: 'UI/UX Designer',
    text: 'I love how transparent and fast the process is. I found great clients and got paid instantly after milestone approval.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Sophie Lee',
    role: 'Smart Contract Engineer',
    text: 'The smart contract escrow is a game changer. No more chasing payments. Highly recommend FreelanceX!',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    name: 'David Kim',
    role: 'DeFi Project Owner',
    text: 'We hired top talent and the payment process was seamless. The platform is intuitive and secure.',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
  },
];

const CAROUSEL_INTERVAL = 5000;

const HERO_VIDEO_URL = "/workflowBroll.mov";

const Home = () => {
  const [currentStory, setCurrentStory] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % successStories.length);
    }, CAROUSEL_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const goToStory = (idx: number) => setCurrentStory(idx);
  const prevStory = () => setCurrentStory((prev) => (prev - 1 + successStories.length) % successStories.length);
  const nextStory = () => setCurrentStory((prev) => (prev + 1) % successStories.length);

  return (
    <PageTransition>
      {/* HERO SECTION: Full local video background with overlay and centered content */}
      <section className="relative w-full h-[650px] flex items-center justify-center overflow-hidden bg-gradient-to-r from-yellow-400 to-orange-500">
        {/* Local video background */}
        <video
          src={HERO_VIDEO_URL}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />
        {/* Overlay: always present for contrast */}
        <div className="absolute inset-0 bg-black/40 z-20 transition-opacity duration-700 opacity-100" />
        {/* Leftmost Content */}
        <div className="relative z-30 flex flex-col items-start justify-center h-full text-left px-10 w-full max-w-none">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-xl">
            Trustless Freelancing on{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Stellar
            </span>
          </h1>
          <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl drop-shadow-lg">
            Secure your payments with smart contract escrow. No middlemen, no delays.
            Build your future with confidence.
          </p>
          {/* Search Bar with Arrow Button */}
          <form className="flex w-full max-w-[38rem] mb-6" onSubmit={e => e.preventDefault()}>
            <input
              type="text"
              placeholder="Search for jobs (e.g. developer, designer...)"
              className="flex-1 px-6 py-4 rounded-l-lg text-lg bg-transparent border border-gray-200 border-r-0 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-md"
            />
            <button
              type="submit"
              className="px-6 py-4 bg-white border border-gray-200 rounded-r-lg flex items-center justify-center transition-all group hover:bg-orange-500 hover:border-orange-500"
              aria-label="Search"
            >
              <svg className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
          </form>
          {/* Post a Job Button */}
          <Link
            to="/create-job"
            className="w-full max-w-xs px-8 py-4 bg-transparent border-2 border-orange-500 text-orange-500 rounded-lg font-semibold text-lg shadow-lg transition-all text-center hover:bg-orange-500 hover:text-white"
          >
            Post a Job
          </Link>
        </div>
      </section>

      {/* Popular Categories */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                title: "Development",
                count: "1,234",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                ),
                color: "bg-orange-400"
              },
              {
                title: "Design",
                count: "2,345",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                ),
                color: "bg-orange-400"
              },
              {
                title: "Marketing",
                count: "3,456",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                ),
                color: "bg-orange-400"
              },
              {
                title: "Writing",
                count: "4,567",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
                color: "bg-orange-400"
              }
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative overflow-hidden rounded-xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-300 border-2 border-orange-400/40 hover:border-orange-400/60"
              >
                <div className="absolute inset-0 bg-orange-400/5 group-hover:bg-orange-400/10 transition-colors duration-300" />
                <div className="relative p-6">
                  <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4 text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors duration-300">{category.title}</h3>
                  <p className="text-gray-600">{category.count} jobs</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Secure Payments",
                description: "Get paid in USDC through smart contract escrow. Funds are released only when milestones are approved.",
                color: "bg-orange-400"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Smart Contracts",
                description: "All agreements are enforced by smart contracts, ensuring transparency and trust.",
                color: "bg-orange-400"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "Global Network",
                description: "Connect with Web3 companies and freelancers from around the world.",
                color: "bg-orange-400"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative overflow-hidden rounded-xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-300 border-2 border-orange-400/40 hover:border-orange-400/60"
              >
                <div className="absolute inset-0 bg-orange-400/5 group-hover:bg-orange-400/10 transition-colors duration-300" />
                <div className="relative p-8">
                  <div className={`w-16 h-16 rounded-lg ${feature.color} flex items-center justify-center mb-6 text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Featured Jobs</h2>
            <Link
              to="/jobs"
              className="text-white hover:text-orange-100 font-medium flex items-center gap-2 group text-lg"
            >
              View all jobs
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                    </div>
                    <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium">
                      {job.budget}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-gray-500 text-sm flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </span>
                    <Link
                      to={`/job/${job.id}`}
                      className="text-orange-500 hover:text-orange-600 font-medium text-sm group"
                    >
                      View Details 
                      <span className="inline-block group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: "1",
                title: "Create Job",
                description: "Post your project with clear milestones and budget",
                gradient: "from-yellow-400 to-orange-500"
              },
              {
                number: "2",
                title: "Secure Payment",
                description: "Funds are locked in smart contract escrow",
                gradient: "from-yellow-400 to-orange-500"
              },
              {
                number: "3",
                title: "Release on Milestone",
                description: "Automatic payment release upon milestone approval",
                gradient: "from-yellow-400 to-orange-500"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-lg flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <span className="text-3xl font-bold text-white">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Home;
