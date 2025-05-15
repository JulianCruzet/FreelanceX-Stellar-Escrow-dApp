import React, { useState } from 'react';
import { useContract } from '../hooks/useContract';
import { useWallet } from '../hooks/useWallet';

interface Milestone {
  title: string;
  description: string;
  percentage: number;
  dueDate: string;
}

export const CreateJob: React.FC = () => {
  const { createJob } = useContract();
  const { isConnected, publicKey, error: walletError, connect } = useWallet();
  const [budget, setBudget] = useState('');
  const [milestones, setMilestones] = useState<Milestone[]>([
    { title: '', description: '', percentage: 0, dueDate: '' },
  ]);

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget(e.target.value);
  };

  const handleMilestoneChange = (
    index: number,
    field: keyof Milestone,
    value: string | number
  ) => {
    const newMilestones = [...milestones];
    newMilestones[index] = {
      ...newMilestones[index],
      [field]: value,
    };
    setMilestones(newMilestones);
  };

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      { title: '', description: '', percentage: 0, dueDate: '' },
    ]);
  };

  const removeMilestone = (index: number) => {
    const newMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(newMilestones);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const totalPercentage = milestones.reduce(
        (sum, milestone) => sum + milestone.percentage,
        0
      );

      if (totalPercentage !== 100) {
        throw new Error('Total milestone percentages must equal 100');
      }

      await createJob(
        publicKey,
        Number(budget),
        milestones.map((m) => ({
          title: m.title,
          description: m.description,
          percentage: m.percentage,
          dueDate: new Date(m.dueDate).getTime(),
        }))
      );

      // Reset form
      setBudget('');
      setMilestones([{ title: '', description: '', percentage: 0, dueDate: '' }]);
    } catch (err) {
      // Error is already handled by the contract hook
      console.error('Failed to create job:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Job</h2>
      
      {walletError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Error</p>
          <p>{walletError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Total Budget
          </label>
          <input
            type="number"
            value={budget}
            onChange={handleBudgetChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Milestones</h3>
            <button
              type="button"
              onClick={addMilestone}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add Milestone
            </button>
          </div>

          {milestones.map((milestone, index) => (
            <div key={index} className="p-4 border rounded-md space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Milestone {index + 1}</h4>
                {milestones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMilestone(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={milestone.title}
                  onChange={(e) =>
                    handleMilestoneChange(index, 'title', e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  value={milestone.description}
                  onChange={(e) =>
                    handleMilestoneChange(index, 'description', e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Percentage
                </label>
                <input
                  type="number"
                  value={milestone.percentage}
                  onChange={(e) =>
                    handleMilestoneChange(
                      index,
                      'percentage',
                      Number(e.target.value)
                    )
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                  min="0"
                  max="100"
                  step="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  value={milestone.dueDate}
                  onChange={(e) =>
                    handleMilestoneChange(index, 'dueDate', e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Job
        </button>
      </form>
    </div>
  );
}; 