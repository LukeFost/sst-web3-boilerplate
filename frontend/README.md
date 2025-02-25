# Web3 Boilerplate Frontend

This is the frontend part of the SST Web3 Boilerplate. It's built with Next.js, Reown AppKit, and shadcn/ui.

## Getting Started

### 1. Set up SST Secrets

The project uses SST's secret management system to securely store sensitive information like your Reown Project ID.

```bash
# From the root directory of the project
npx sst secrets set REOWN_PROJECT_ID your_project_id_here
```

This secret is automatically linked to your Next.js application in the `sst.config.ts` file and exposed as `NEXT_PUBLIC_REOWN_PROJECT_ID`.

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

First, start the SST development environment from the root directory:

```bash
# From the root directory
npx sst dev
```

Then, in a separate terminal, start the Next.js development server:

```bash
# From the frontend directory
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## How to Get a Reown Project ID

1. Go to [Reown Cloud Dashboard](https://cloud.reown.com)
2. Sign in or create an account
3. Create a new project:
   - Click on "Create Project" button
   - Enter a name for your project
   - Select the networks you want to support
   - Click "Create"
4. Once your project is created, you'll be taken to the project dashboard
5. Copy your Project ID from the dashboard

## Project Structure

```
/
├── app/                # Next.js App Router
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout component
│   └── page.tsx        # Home page component
├── components/         # React components
│   ├── ui/             # shadcn/ui components
│   │   └── button.tsx  # Button component
│   └── navbar.tsx      # Navbar with wallet connect button
├── config/             # Configuration files
│   └── index.tsx       # Reown and Wagmi configuration
├── context/            # React context providers
│   └── index.tsx       # AppKit context provider
├── lib/                # Utility functions
│   └── utils.ts        # Utility functions
└── public/             # Static assets
```

## Web3 Integration

### Configuration

The web3 integration is configured in the `config/index.tsx` file. This file sets up the Wagmi adapter and exports the configuration for use in the application.

```typescript
// config/index.tsx
import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum } from '@reown/appkit/networks'

// Get projectId from the environment variable
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [mainnet, arbitrum]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig
```

### Context Provider

The context provider is set up in the `context/index.tsx` file. This file creates the AppKit modal and sets up the Wagmi provider.

```typescript
// context/index.tsx
'use client'

import { wagmiAdapter, projectId } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react' 
import { mainnet, arbitrum, avalanche, base, optimism, polygon } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()

// Create the AppKit modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum, avalanche, base, optimism, polygon],
  defaultNetwork: mainnet,
  metadata: {
    name: 'SST Web3 Boilerplate',
    description: 'Web3 Boilerplate for SST v3',
    url: 'https://example.com',
    icons: ['https://assets.reown.com/reown-profile-pic.png']
  },
  features: {
    analytics: true,
  }
})

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider
```

### Navbar with Wallet Connect Button

The navbar component includes a wallet connect button that uses the Reown hooks to connect to a wallet. When connected, it displays the connected address and provides a way to disconnect.

```typescript
// components/navbar.tsx
'use client'

import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function Navbar() {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const { disconnect } = useDisconnect()
  const [showDisconnectModal, setShowDisconnectModal] = useState(false)

  // Format address for display (e.g., 0x1234...5678)
  const formatAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Handle wallet connection
  const handleConnect = () => {
    open()
  }

  // Handle disconnect confirmation
  const handleDisconnectClick = () => {
    setShowDisconnectModal(true)
  }

  // Handle disconnect cancellation
  const handleCancelDisconnect = () => {
    setShowDisconnectModal(false)
  }

  // Handle disconnect confirmation
  const handleConfirmDisconnect = async () => {
    try {
      await disconnect()
    } catch (error) {
      console.error('Failed to disconnect:', error)
    } finally {
      setShowDisconnectModal(false)
    }
  }

  return (
    <nav className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">Web3 Boilerplate</h1>
      </div>
      <div>
        {isConnected ? (
          <div className="relative">
            <Button 
              variant="outline"
              className="transition-colors hover:bg-red-500 hover:text-white hover:border-red-500"
              onClick={handleDisconnectClick}
            >
              {formatAddress(address || '')}
            </Button>
            
            {/* Disconnect confirmation modal */}
            {showDisconnectModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">Disconnect Wallet</h2>
                  <p className="mb-6">Are you sure you want to disconnect your wallet?</p>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancelDisconnect}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleConfirmDisconnect}>
                      Disconnect
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Button onClick={handleConnect}>Connect Wallet</Button>
        )}
      </div>
    </nav>
  )
}
```

## Available Hooks

The Reown AppKit provides several hooks that you can use in your application:

- `useAppKit`: Hook for controlling the modal
- `useAppKitAccount`: Hook for accessing account data and connection status
- `useAppKitNetwork`: Hook for accessing network data and methods
- `useAppKitState`: Hook for getting the current value of the modal's state
- `useAppKitTheme`: Hook for controlling the modal's theme
- `useAppKitEvents`: Hook for subscribing to modal events
- `useDisconnect`: Hook for disconnecting the session
- `useWalletInfo`: Hook for accessing wallet information

For more information, see the [Reown AppKit documentation](https://docs.reown.com).

## Customization

### Adding More Networks

To add more networks, update the `networks` array in `context/index.tsx`:

```typescript
import { mainnet, arbitrum, avalanche, base, optimism, polygon, bsc } from '@reown/appkit/networks'

// ...

createAppKit({
  // ...
  networks: [mainnet, arbitrum, avalanche, base, optimism, polygon, bsc],
  // ...
})
```

### Styling

The boilerplate uses Tailwind CSS for styling. You can customize the theme in `tailwind.config.ts`.

### Components

The boilerplate uses shadcn/ui components. You can add more components as needed.

## SST Integration

This frontend is part of an SST application. The SST configuration in the root directory's `sst.config.ts` file links the Reown Project ID secret to this Next.js application:

```typescript
// sst.config.ts
const REOWN_PROJECT_ID = new sst.Secret("REOWN_PROJECT_ID")

new sst.aws.Nextjs("Frontend", {
  path: "frontend",
  link: [REOWN_PROJECT_ID],
  environment: {
    NEXT_PUBLIC_APP_REGION: aws.getRegionOutput().name,
    NEXT_PUBLIC_REOWN_PROJECT_ID: REOWN_PROJECT_ID.value,
  }
});
```

This makes the secret available to the Next.js application as an environment variable.
