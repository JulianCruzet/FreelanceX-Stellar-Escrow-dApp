# 🌍 FreelanceX – Trustless Escrow Platform

FreelanceX is a decentralized escrow platform built on Stellar Soroban smart contracts that automates freelance payments based on verifiable work milestones.

## 🚀 Features

- **Smart Contract Escrow**: Secure funds in Stellar Soroban smart contracts
- **Milestone-based Payments**: Automate payments based on work completion
- **Multicurrency Support**: Use Stellar stablecoins for cross-border payments
- **Identity & Reputation**: Optional KYC and on-chain ratings
- **Modern UI/UX**: Clean, intuitive interface built with React and Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Smart Contracts**: Rust on Stellar Soroban
- **Wallet Integration**: Freighter (Stellar browser wallet)
- **UI Components**: Headless UI + Heroicons
- **Routing**: React Router

## 🏗️ Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── contracts/     # Smart contract code
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
└── types/         # TypeScript type definitions
```

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/freelancex.git
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