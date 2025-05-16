# 🌍 FreelanceX – Trustless Escrow Platform

FreelanceX is a decentralized escrow platform built on Stellar Soroban smart contracts that automates freelance payments based on verifiable work milestones.

## 📺 Demo Video

[![FreelanceX Demo Video](https://img.youtube.com/vi/brHOdnTERXA/0.jpg)](https://youtu.be/brHOdnTERXA)

Watch our demo video to see FreelanceX in action! The video demonstrates:
- Creating and funding escrow contracts
- Managing milestones and payments
- Handling disputes and resolutions
- Cross-border payments with Stellar stablecoins

## 🖼️ Screenshots

### Main Dashboard
![Dashboard](/public/MainDashboard.png)

### Contract Creation
![Contract Creation](/public/JobCreation.png)

### Milestone Management
![Milestone Management](/public/MilestoneManagement.png)

### Payment Processing
![Payment Processing](/public/PaymentProcessing.png)

## 🔗 Blockchain Integration

FreelanceX leverages Stellar Soroban smart contracts for secure and transparent escrow management:

1. **Smart Contract Architecture**
   - Escrow contracts are deployed on Stellar's Soroban network
   - Each contract is uniquely identified by a contract ID
   - Funds are locked in the contract until milestone completion

2. **Payment Flow**
   - Clients fund escrow contracts using Stellar stablecoins
   - Smart contracts verify milestone completion
   - Automatic payment release upon milestone approval
   - Dispute resolution through on-chain voting

3. **Security Features**
   - Multi-signature requirements for large transactions
   - Time-locked releases for dispute resolution
   - Transparent transaction history on Stellar blockchain

## 🎥 Project Walkthrough

[![Project Walkthrough](https://img.youtube.com/vi/Yb-Z5llxOk0/0.jpg)](https://www.youtube.com/watch?v=Yb-Z5llxOk0)

In this comprehensive walkthrough, we cover:
- Project architecture and codebase structure
- Smart contract implementation details
- Frontend development and UI/UX decisions
- Testing and deployment process
- Future roadmap and improvements
- Passkey kit integration and smart wallet features

## 🚀 Features

- **Smart Contract Escrow**: Secure funds in Stellar Soroban smart contracts
- **Milestone-based Payments**: Automate payments based on work completion
- **Multicurrency Support**: Use Stellar stablecoins for cross-border payments
- **Identity & Reputation**: Optional KYC and on-chain ratings
- **Modern UI/UX**: Clean, intuitive interface built with React and Tailwind CSS
- **Passkey Authentication**: Secure and convenient login using passkeys
- **Smart Wallet Integration**: Enhanced wallet functionality with smart contract capabilities

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Smart Contracts**: Rust on Stellar Soroban
- **Wallet Integration**: Freighter (Stellar browser wallet)
- **UI Components**: Headless UI + Heroicons
- **Routing**: React Router

## 🏗️ Project Structure

```
FreelanceX-Stellar-Escrow-dApp/
├── new_build/                 # Rust-based Soroban smart contracts
│   ├── Cargo.toml
│   └── src/
├── frontend/                  # React + TypeScript frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
├── scripts/                   # Deployment and utility scripts
├── .gitignore
├── README.md
└── LICENSE
```

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/JulianCruzet/FreelanceX-Stellar-Escrow-dApp
   cd freelancex
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Development

### Prerequisites

- Node.js 16+
- npm 7+
- Freighter wallet extension

### Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm lint`: Run linter

## 📝 Smart Contract Integration

The platform uses Stellar Soroban smart contracts for escrow functionality. Key features:

- Funds are locked in escrow until milestone completion
- Automatic payment release upon milestone approval
- Dispute resolution mechanism (coming in v2)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Stellar Development Foundation
- Soroban Team
- Freighter Wallet Team 
