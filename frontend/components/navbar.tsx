'use client'

import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Image from 'next/image'

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
