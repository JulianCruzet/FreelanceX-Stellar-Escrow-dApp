import { useCallback, useMemo } from 'react';
import { ContractService } from '../services/contract';
import { Networks } from '@stellar/stellar-sdk';

const CONTRACT_ID = process.env.REACT_APP_CONTRACT_ID || '';
const RPC_URL = process.env.REACT_APP_RPC_URL || 'https://soroban-testnet.stellar.org';
const NETWORK_PASSPHRASE = process.env.REACT_APP_NETWORK_PASSPHRASE || Networks.TESTNET;

export function useContract() {
  const contractService = useMemo(
    () => new ContractService(CONTRACT_ID, RPC_URL, NETWORK_PASSPHRASE),
    []
  );

  const createJob = useCallback(
    async (client: string, budget: number, milestones: any[]) => {
      try {
        return await contractService.createJob(client, budget, milestones);
      } catch (error) {
        console.error('Error creating job:', error);
        throw error;
      }
    },
    [contractService]
  );

  const acceptJob = useCallback(
    async (jobId: number, freelancer: string) => {
      try {
        await contractService.acceptJob(jobId, freelancer);
      } catch (error) {
        console.error('Error accepting job:', error);
        throw error;
      }
    },
    [contractService]
  );

  const depositFunds = useCallback(
    async (jobId: number, amount: number) => {
      try {
        await contractService.depositFunds(jobId, amount);
      } catch (error) {
        console.error('Error depositing funds:', error);
        throw error;
      }
    },
    [contractService]
  );

  const completeMilestone = useCallback(
    async (jobId: number, milestoneId: number) => {
      try {
        await contractService.completeMilestone(jobId, milestoneId);
      } catch (error) {
        console.error('Error completing milestone:', error);
        throw error;
      }
    },
    [contractService]
  );

  const approveMilestone = useCallback(
    async (jobId: number, milestoneId: number) => {
      try {
        await contractService.approveMilestone(jobId, milestoneId);
      } catch (error) {
        console.error('Error approving milestone:', error);
        throw error;
      }
    },
    [contractService]
  );

  const getJob = useCallback(
    async (jobId: number) => {
      try {
        return await contractService.getJob(jobId);
      } catch (error) {
        console.error('Error getting job:', error);
        throw error;
      }
    },
    [contractService]
  );

  const initiateDispute = useCallback(
    async (jobId: number, reason: string) => {
      try {
        await contractService.initiateDispute(jobId, reason);
      } catch (error) {
        console.error('Error initiating dispute:', error);
        throw error;
      }
    },
    [contractService]
  );

  const cancelJob = useCallback(
    async (jobId: number) => {
      try {
        await contractService.cancelJob(jobId);
      } catch (error) {
        console.error('Error cancelling job:', error);
        throw error;
      }
    },
    [contractService]
  );

  return {
    createJob,
    acceptJob,
    depositFunds,
    completeMilestone,
    approveMilestone,
    getJob,
    initiateDispute,
    cancelJob,
  };
} 