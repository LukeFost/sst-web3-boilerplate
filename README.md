# SST Web3 Boilerplate

A boilerplate for building web3 applications with Next.js, SST v3, and Reown.

## Features

- Next.js 15 with App Router
- SST v3 for infrastructure
- Reown AppKit for web3 functionality
- Wallet connection with disconnect confirmation
- TypeScript support
- Tailwind CSS for styling
- shadcn/ui components

## Prerequisites

- Node.js 18+ and npm
- An account on [Reown Cloud](https://cloud.reown.com)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/sst-web3-boilerplate.git
cd sst-web3-boilerplate
```

### 2. Install dependencies

```bash
npm install
cd frontend
npm install
```

### 3. Create a Reown Project

1. Go to [Reown Cloud Dashboard](https://cloud.reown.com)
2. Sign in or create an account
3. Create a new project
   - Click on "Create Project" button
   - Enter a name for your project
   - Select the networks you want to support (the boilerplate is configured for Ethereum Mainnet and Arbitrum by default)
   - Click "Create"
4. Once your project is created, you'll be taken to the project dashboard
5. Copy your Project ID from the dashboard (it should be displayed prominently)

### 4. Configure SST Secrets

Set your Reown Project ID as an SST secret:

```bash
npx sst secrets set REOWN_PROJECT_ID your_project_id_here
```

This secret is automatically linked to your Next.js application in the `sst.config.ts` file:

```typescript
// sst.config.ts
new sst.aws.Nextjs("Frontend", {
  path: "frontend",
  link: [REOWN_PROJECT_ID],
  environment: {
    NEXT_PUBLIC_APP_REGION: aws.getRegionOutput().name,
    NEXT_PUBLIC_REOWN_PROJECT_ID: REOWN_PROJECT_ID.value,
  }
});
```

The secret is exposed to your Next.js application as `NEXT_PUBLIC_REOWN_PROJECT_ID`, which is already configured in `frontend/config/index.tsx`.

### 5. Run the Development Server

```bash
npx sst dev
```

This will start the SST development environment and make your secrets available to the Next.js application.

In a separate terminal:

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
/
├── frontend/               # Next.js frontend application
│   ├── app/                # Next.js App Router
│   ├── components/         # React components
│   │   ├── ui/             # shadcn/ui components
│   │   └── navbar.tsx      # Navbar with wallet connect button
│   ├── config/             # Configuration files
│   ├── context/            # React context providers
│   ├── lib/                # Utility functions
│   └── public/             # Static assets
└── sst.config.ts           # SST configuration
```

## Web3 Features

### Wallet Connection

The boilerplate includes a navbar with a wallet connect button. When clicked, it opens the Reown modal that allows users to connect their wallet. Once connected, the button displays the connected address.

### Disconnect Confirmation

When hovering over the connected address button, it turns red to indicate that clicking it will disconnect the wallet. When clicked, a confirmation modal appears to prevent accidental disconnections.

### Supported Networks

The boilerplate is configured to support the following networks by default:

- Ethereum Mainnet
- Arbitrum
- Avalanche
- Base
- Optimism
- Polygon

You can modify the supported networks in the `frontend/context/index.tsx` file.

## Customization

### Adding More Networks

To add more networks, update the `networks` array in `frontend/context/index.tsx`:

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

The boilerplate uses Tailwind CSS for styling. You can customize the theme in `frontend/tailwind.config.ts`.

### Components

The boilerplate uses shadcn/ui components. You can add more components as needed.

## Deployment

### Deploy with SST

```bash
npx sst deploy --stage prod
```

This will deploy your application to AWS using SST.

## How SST Secrets Work

SST provides a secure way to manage secrets for your application:

1. Secrets are stored securely in SST's Parameter Store
2. When you run `npx sst dev`, SST creates a local environment with these secrets
3. In the `sst.config.ts` file, secrets are linked to your Next.js application
4. The secrets are exposed as environment variables with the `NEXT_PUBLIC_` prefix
5. Your application can access these variables via `process.env.NEXT_PUBLIC_REOWN_PROJECT_ID`

This approach is more secure than using `.env` files, especially for production deployments.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [SST Documentation](https://docs.sst.dev)
- [SST Secrets Management](https://docs.sst.dev/config/secrets)
- [Reown Documentation](https://docs.reown.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
