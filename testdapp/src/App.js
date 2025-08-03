import React, { useState, useEffect } from 'react';
import { ethers, Contract } from "ethers";
import './App.css';
// Import the ABI

import contractAbi from './abi.json'

const contractAddress = '0xEf3B4eF7B6a3F5791503A1026dB23BA99d42B584';  // Replace with your contract address



function App() {

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [polBalance, setPolBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [buttonText, setButtonText] = useState("Connect Wallet");

  const connectWallet = async () => {
    setLoading(true);
    
    if (window.ethereum) {
      try {
        const _provider = new ethers.BrowserProvider(window.ethereum)
        const _signer = await _provider.getSigner()

        // Create a contract
        const _contract = new Contract(contractAddress, contractAbi.abi, _signer)

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        setProvider(_provider);
        setSigner(_signer);
        setContract(_contract);
        setAccount(accounts[0]);
        setIsConnected(true);
        setLoading(false);
        setButtonText("Connected");


        // Fetch  Token balance
        const _tokenBalance = await _contract.balanceOf(accounts[0]);
        setTokenBalance(ethers.formatUnits(_tokenBalance, 18));
        console.log("token balance", tokenBalance);

        
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        setLoading(false);
      }
    } else {
      alert("Please install MetaMask");
    }
  };

  // fetch POL balance

  const fetchBalance = async () => {

    if (account) {
       // const provider = new ethers.providers.Web3Provider(window.ethereum);
        const _balance = await provider.getBalance(account);
        setPolBalance(ethers.formatEther(_balance)); // Convert balance to ether
        console.log("pol balance", polBalance);
    }
  }
  const fetchTokenBalance = async () => {

    if (account) {
       // Fetch  Token balance
        const _tokenBalance = await contract.balanceOf(accounts[0]);
        setTokenBalance(ethers.formatUnits(_tokenBalance, 18));
        console.log("token balance", tokenBalance);
    }
  }

  
  useEffect(() => {
      if (account) {
          fetchBalance();
      }
  }, [account, fetchBalance]);
  
  const mintTokens = async () => {
    setLoading(true);
    if (contract) {
      try {
        const tx = await contract.buyTokens({ value: ethers.parseEther("0.001") });
        // 4. Get the transaction hash immediately (before waiting for confirmation)
        const txHash = tx.hash;
        console.log('Transaction hash:', txHash);
        setTxHash(txHash); // Show user the hash right away
        await tx.wait();
        alert("Tokens minted successfully!");
        setTimeout(async () => {
          await fetchBalance();
          await fetchTokenBalance();
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error minting tokens:", error);
        setLoading(false);
      }
    }
  };

  const transferTokens = async (to, amount) => {
    if (!recipient || !amount) {
      alert('Please fill all fields');
      return;
    }
    
    setLoading(true);
    if (contract) {
      try {
        const tx = await contract.transfer(to, ethers.parseUnits(amount, 18));
        // 4. Get the transaction hash immediately (before waiting for confirmation)
        const txHash = tx.hash;
        console.log('Transaction hash:', txHash);
        setTxHash(txHash); // Show user the hash right away
        await tx.wait();
        alert("Tokens transferred successfully!");
        setTimeout(async () => {
          await fetchBalance();
          await fetchTokenBalance();
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error("Error transferring tokens:", error);
        setLoading(false);
      }
    }
  };
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">My Token dApp</h1>
        <div className="wallet-section">
          {!isConnected ? (
            <button 
              className="connect-button"
              onClick={connectWallet}
              disabled={loading}
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : (
            <div className="account-info">
              <span className="account-address">{`${account.substring(0, 6)}...${account.substring(38)}`}</span>
              <div className="balance-display">
                <div className="balance-item">
                  <span className="balance-label">POL Balance:</span>
                  <span className="balance-value">{polBalance} POL</span>
                </div>
                <div className="balance-item">
                  <span className="balance-label">Token Balance:</span>
                  <span className="balance-value token-highlight">{tokenBalance} MTK</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        <section className="action-card mint-section">
          <h2>Mint Test Tokens</h2>
          <p className="mint-description">Get 100 MTK for testing (0.001 POL fee)</p>
          <button 
            className="action-button mint-button"
            onClick={mintTokens}
            disabled={!isConnected || loading}
          >
            {loading ? 'Minting...' : 'Mint Tokens'}
          </button>
        </section>

        <section className="action-card transfer-section">
          <h2>Transfer Tokens</h2>
          <div className="transfer-form">
            <div className="form-group">
              <label htmlFor="recipient">Recipient Address</label>
              <input
                type="text"
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
              />
            </div>
            <div className="form-group">
              <label htmlFor="amount">Amount to Transfer</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="MTK amount"
              />
            </div>
            <button
              className="action-button transfer-button"
              onClick={transferTokens}
              disabled={!isConnected || loading}
            >
              {loading ? 'Transferring...' : 'Transfer Tokens'}
            </button>
          </div>
          {txHash && (
            <div className="tx-success">
              <p>Transaction successful!</p>
              <a href="#" className="tx-link">View on explorer</a>
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>My Token dApp © 2023</p>
      </footer>
    </div>
  );
}

export default App;
