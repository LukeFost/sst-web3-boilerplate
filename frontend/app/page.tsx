import { Navbar } from "@/components/navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-3xl w-full space-y-8 text-center">
          <h1 className="text-4xl font-bold">Web3 Boilerplate</h1>
          <p className="text-xl">
            A simple boilerplate for building web3 applications with Next.js, SST, and Reown.
          </p>
          
          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <ol className="text-left list-decimal list-inside space-y-2">
              <li>Create a project on <a href="https://cloud.reown.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">cloud.reown.com</a></li>
              <li>Copy your Project ID from the dashboard</li>
              <li>Set your Project ID as an SST secret: <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-mono">npx sst secrets set REOWN_PROJECT_ID your_project_id_here</code></li>
              <li>Run <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-mono">npx sst dev</code> to start the SST development environment</li>
              <li>Click the "Connect Wallet" button in the navbar to get started!</li>
            </ol>
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center border-t">
        <p>Built with Next.js, SST, and Reown</p>
      </footer>
    </div>
  );
}
