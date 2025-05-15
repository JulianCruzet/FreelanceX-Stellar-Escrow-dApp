import { Contract, Networks, TransactionBuilder, xdr, Address, scValToNative, nativeToScVal } from '@stellar/stellar-sdk';
import axios, { AxiosError } from 'axios';

// Custom error class for contract errors
export class ContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContractError';
  }
}

// Contract interface types
export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  percentage: number;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  milestones: Milestone[];
  status: 'open' | 'in_progress' | 'completed';
  clientId: string;
  freelancerId?: string;
}

export class ContractService {
  private readonly serverUrl: string;
  private readonly networkPassphrase: string;
  private readonly axiosInstance;
  private readonly contract: Contract;

  constructor(contractId: string, serverUrl: string = 'https://horizon-testnet.stellar.org', networkPassphrase: string = Networks.TESTNET) {
    this.serverUrl = serverUrl;
    this.networkPassphrase = networkPassphrase;
    this.contract = new Contract(contractId);
    this.axiosInstance = axios.create({
      baseURL: serverUrl,
      timeout: 10000,
    });
  }

  async getAccount(accountId: string) {
    try {
      const response = await this.axiosInstance.get(`/accounts/${accountId}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ContractError(`Failed to get account: ${error.message}`);
      }
      throw new ContractError('Unknown error occurred while getting account');
    }
  }

  async sendTransaction(transaction: string) {
    try {
      const response = await this.axiosInstance.post('/transactions', {
        tx: transaction
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ContractError(`Failed to send transaction: ${error.message}`);
      }
      throw new ContractError('Unknown error occurred while sending transaction');
    }
  }

  private async submitTransaction(operation: xdr.Operation): Promise<any> {
    try {
      const sourceAccount = operation.sourceAccount?.toString();
      if (!sourceAccount) {
        throw new ContractError('Source account is required');
      }

      const account = await this.getAccount(sourceAccount);
      const transaction = new TransactionBuilder(account, {
        fee: '100',
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(operation)
        .setTimeout(30)
        .build();

      return await this.sendTransaction(transaction.toXDR());
    } catch (error) {
      if (error instanceof ContractError) throw error;
      throw new ContractError('Failed to submit transaction');
    }
  }

  // Initialize contract with USDC token
  async initialize(usdcTokenAddress: string): Promise<void> {
    try {
      const operation = this.contract.call(
        'initialize',
        nativeToScVal(usdcTokenAddress)
      );
      await this.submitTransaction(operation as xdr.Operation);
    } catch (error) {
      if (error instanceof ContractError) throw error;
      throw new ContractError('Failed to initialize contract');
    }
  }

  // Create a new job
  async createJob(
    client: string,
    budget: number,
    milestones: Omit<Milestone, 'id' | 'status'>[]
  ): Promise<number> {
    try {
      if (budget <= 0) {
        throw new ContractError('Budget must be greater than 0');
      }

      const totalPercentage = milestones.reduce((sum, m) => sum + m.percentage, 0);
      if (totalPercentage !== 100) {
        throw new ContractError('Total milestone percentage must equal 100');
      }

      const operation = this.contract.call(
        'create_job',
        nativeToScVal(client),
        nativeToScVal(budget),
        nativeToScVal(milestones)
      );
      const result = await this.submitTransaction(operation as xdr.Operation);
      return scValToNative(result);
    } catch (error) {
      if (error instanceof ContractError) throw error;
      throw new ContractError('Failed to create job');
    }
  }

  // Accept a job
  async acceptJob(jobId: number, freelancer: string): Promise<void> {
    try {
      const operation = this.contract.call(
        'accept_job',
        nativeToScVal(jobId),
        nativeToScVal(freelancer)
      );
      await this.submitTransaction(operation as xdr.Operation);
    } catch (error) {
      if (error instanceof ContractError) throw error;
      throw new ContractError('Failed to accept job');
    }
  }

  // Deposit funds into escrow
  async depositFunds(jobId: number, amount: number): Promise<void> {
    try {
      if (amount <= 0) {
        throw new ContractError('Amount must be greater than 0');
      }

      const operation = this.contract.call(
        'deposit_funds',
        nativeToScVal(jobId),
        nativeToScVal(amount)
      );
      await this.submitTransaction(operation as xdr.Operation);
    } catch (error) {
      if (error instanceof ContractError) throw error;
      throw new ContractError('Failed to deposit funds');
    }
  }

  // Complete a milestone
  async completeMilestone(jobId: number, milestoneId: number): Promise<void> {
    try {
      const operation = this.contract.call(
        'complete_milestone',
        nativeToScVal(jobId),
        nativeToScVal(milestoneId)
      );
      await this.submitTransaction(operation as xdr.Operation);
    } catch (error) {
      if (error instanceof ContractError) throw error;
      throw new ContractError('Failed to complete milestone');
    }
  }

  // Approve a milestone and release payment
  async approveMilestone(jobId: number, milestoneId: number): Promise<void> {
    try {
      const operation = this.contract.call(
        'approve_milestone',
        nativeToScVal(jobId),
        nativeToScVal(milestoneId)
      );
      await this.submitTransaction(operation as xdr.Operation);
    } catch (error) {
      if (error instanceof ContractError) throw error;
      throw new ContractError('Failed to approve milestone');
    }
  }

  // Get job details
  async getJob(jobId: number): Promise<Job> {
    try {
      const operation = this.contract.call(
        'get_job',
        nativeToScVal(jobId)
      );
      const result = await this.submitTransaction(operation as xdr.Operation);
      return scValToNative(result);
    } catch (error) {
      if (error instanceof ContractError) throw error;
      throw new ContractError('Failed to get job details');
    }
  }

  // Initiate a dispute
  async initiateDispute(jobId: number, reason: string): Promise<void> {
    try {
      if (!reason.trim()) {
        throw new ContractError('Dispute reason cannot be empty');
      }

      const operation = this.contract.call(
        'initiate_dispute',
        nativeToScVal(jobId),
        nativeToScVal(reason)
      );
      await this.submitTransaction(operation as xdr.Operation);
    } catch (error) {
      if (error instanceof ContractError) throw error;
      throw new ContractError('Failed to initiate dispute');
    }
  }

  // Cancel a job
  async cancelJob(jobId: number): Promise<void> {
    try {
      const operation = this.contract.call(
        'cancel_job',
        nativeToScVal(jobId)
      );
      await this.submitTransaction(operation as xdr.Operation);
    } catch (error) {
      if (error instanceof ContractError) throw error;
      throw new ContractError('Failed to cancel job');
    }
  }
} 