import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Job } from '../services/contract';

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // TODO: Implement job fetching logic using the id
        const mockJob: Job = {
          id: id || '',
          title: 'Sample Job',
          description: 'This is a sample job description.',
          budget: 1000,
          milestones: [
            {
              id: '1',
              title: 'Initial Setup',
              description: 'Set up project structure and environment',
              amount: 300,
              dueDate: '2024-04-01',
              status: 'pending',
              percentage: 30
            }
          ],
          status: 'open',
          clientId: 'client123'
        };
        setJob(mockJob);
      } catch (err) {
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Job not found'}</p>
          <button
            onClick={() => navigate('/jobs')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                {job.status}
              </span>
              <span className="text-gray-600">Budget: {job.budget} XLM</span>
            </div>
            <button
              onClick={() => navigate('/jobs')}
              className="text-indigo-600 hover:text-indigo-800"
            >
              Back to Jobs
            </button>
          </div>

          <div className="prose max-w-none mb-8">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{job.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Milestones</h2>
            <div className="space-y-4">
              {job.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium">{milestone.title}</h3>
                    <span className="px-2 py-1 bg-gray-200 rounded text-sm">
                      {milestone.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{milestone.description}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Amount: {milestone.amount} XLM</span>
                    <span>Due: {milestone.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => navigate('/jobs')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {/* TODO: Implement apply logic */}}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JobDetails; 