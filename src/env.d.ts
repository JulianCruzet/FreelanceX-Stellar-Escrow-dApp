/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly PUBLIC_RPC_URL: string
    readonly PUBLIC_NETWORK_PASSPHRASE: string
    readonly PUBLIC_WALLET_WASM_HASH: string
    readonly PUBLIC_LAUNCHTUBE_URL: string
    readonly PUBLIC_LAUNCHTUBE_JWT: string
    readonly PUBLIC_CHAT_CONTRACT_ID: string
    readonly PUBLIC_CHAT_CONTRACT_ID_TESTNET: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare namespace NodeJS {
    interface ProcessEnv {
        readonly PUBLIC_RPC_URL: string
        readonly PUBLIC_NETWORK_PASSPHRASE: string
        readonly PUBLIC_WALLET_WASM_HASH: string
        readonly PUBLIC_LAUNCHTUBE_URL: string
        readonly PUBLIC_LAUNCHTUBE_JWT: string
    }
}