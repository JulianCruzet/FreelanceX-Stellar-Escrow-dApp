import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import Footer from '../components/Footer';

interface Milestone {
  title: string;
  description: string;
  percentage: number;
  dueDate: string;
}

const CreateJob = () => {
  const navigate = useNavigate();
  const [milestones, setMilestones] = useState<Milestone[]>([
    { title: '', description: '', percentage: 0, dueDate: '' }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    skills: '',
    duration: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addMilestone = () => {
    setMilestones(prev => [...prev, { title: '', description: '', percentage: 0, dueDate: '' }]);
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: string | number) => {
    setMilestones(prev => prev.map((milestone, i) => 
      i === index ? { ...milestone, [field]: value } : milestone
    ));
  };

  const removeMilestone = (index: number) => {
    setMilestones(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with Soroban smart contract
    console.log({ ...formData, milestones });
    navigate('/jobs');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white flex flex-col">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center mt-6">Create New Job</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 flex-1 w-full">
          {/* Left Column: Combined Photo + Instructions Card */}
          <div className="rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col bg-white h-full self-stretch">
            <div className="relative w-full h-56">
              <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80" alt="Create Job Visual" className="object-cover w-full h-full" />
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent" />
            </div>
            <div className="p-4 text-gray-700 text-sm flex flex-col h-full justify-between">
              <h3 className="font-semibold text-lg mb-1 text-orange-600">How to Create a New Job</h3>
              <ul className="list-disc pl-4 space-y-0.5 mb-1">
                <li>Fill in the <span className="font-medium">Job Details</span> with a clear title, description, budget, duration, and required skills.</li>
                <li>Break your project into <span className="font-medium">Milestones</span> for better tracking and payment releases.</li>
                <li>Be as specific as possible to attract the best freelancers for your needs.</li>
                <li>Use a descriptive job title and include background, deliverables, and requirements.</li>
                <li>Set a realistic budget and timeline.</li>
              </ul>
              <div className="mb-2">
                <h4 className="font-semibold text-orange-500 mb-0.5">Quick Tips</h4>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Review your job post for clarity and completeness before submitting.</li>
                  <li>2-5 milestones is typical. Each should represent a meaningful project phase.</li>
                  <li>Estimate your budget based on similar projects or ask for freelancer input.</li>
                </ul>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                <strong>Example:</strong> <br />
                <span className="block mt-0.5 mb-0.5">"Build a responsive landing page for our new crypto wallet. The page should include a hero section, features, testimonials, and a contact form. Use React and Tailwind CSS. Deliver Figma designs and deployed site."</span>
                <span className="block">Milestone 1: Figma design delivery (20%)<br/>Milestone 2: Initial React implementation (40%)<br/>Milestone 3: Final deployment and bug fixes (40%)</span>
              </div>
            </div>
          </div>
          {/* Right Column: Job Details + Milestones */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Job Details Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 flex flex-col justify-between min-h-[320px]">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Job Details</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      placeholder="e.g., Full Stack Developer for Web3 Project"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={8}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      placeholder="Describe the job requirements and responsibilities..."
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">Budget (USDC)</label>
                      <input
                        type="number"
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                        placeholder="e.g., 5000"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration (weeks)</label>
                      <input
                        type="number"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                        placeholder="e.g., 4"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
                    <input
                      type="text"
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      placeholder="e.g., React, TypeScript, Solidity"
                      required
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="mt-8 w-full py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl text-lg"
              >
                Post Job
              </button>
            </div>
            {/* Milestones Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 flex flex-col min-h-[220px]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Milestones</h2>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all text-sm"
                >
                  Add Milestone
                </button>
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto">
                {milestones.map((milestone, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-xl bg-orange-50/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-800">Milestone {index + 1}</span>
                      {milestones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMilestone(index)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={milestone.title}
                          onChange={e => updateMilestone(index, 'title', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                          placeholder="e.g., Design Phase"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Percentage</label>
                        <input
                          type="number"
                          value={milestone.percentage}
                          onChange={e => updateMilestone(index, 'percentage', parseInt(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                          min="0"
                          max="100"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={milestone.description}
                        onChange={e => updateMilestone(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                        placeholder="Describe the milestone deliverables..."
                        required
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Due Date</label>
                      <input
                        type="date"
                        value={milestone.dueDate}
                        onChange={e => updateMilestone(index, 'dueDate', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
        <div className="mt-10 w-full">
          <Footer />
        </div>
      </div>
    </PageTransition>
  );
};

export default CreateJob; 