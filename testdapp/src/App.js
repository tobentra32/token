import React, { useState, useEffect } from 'react';
import { ethers, Contract } from "ethers";

// Import the ABI

import contractAbi from './abi.json'

const contractAddress = '0xEf3B4eF7B6a3F5791503A1026dB23BA99d42B584';  // Replace with your contract address



function App() {

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [buttonText, setButtonText] = useState("Connect Wallet");

  const connectWallet = async () => {


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
        setWalletConnected(true);
        setButtonText("Connected");


        // Fetch  Token balance
        const _tokenBalance = await _contract.balanceOf(accounts[0]);
        setTokenBalance(ethers.formatUnits(_tokenBalance, 18));
        console.log("token balance", tokenBalance);

        
      } catch (error) {
        console.error("Error connecting to wallet:", error);
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
        setBalance(ethers.formatEther(_balance)); // Convert balance to ether
      console.log("pol balance", balance);
    }

    
    
   
    
  }
  useEffect(() => {
      if (account) {
          fetchBalance();
      }
  }, [account, fetchBalance]);
  
  

  



  const mintTokens = async () => {
    if (contract) {
      try {
        const tx = await contract.buyTokens({ value: ethers.parseEther("0.001") });
        await tx.wait();
        alert("Tokens minted successfully!");
      } catch (error) {
        console.error("Error minting tokens:", error);
      }
    }
  };

  const transferTokens = async (to, amount) => {
    if (contract) {
      try {
        const tx = await contract.transfer(to, ethers.parseUnits(amount, 18));
        await tx.wait();
        alert("Tokens transferred successfully!");
      } catch (error) {
        console.error("Error transferring tokens:", error);
      }
    }
  };
  return (
    <div className="App">
      <div>

        <button className = 'bg-indigo-500 text-white rounded-xl px-3 pb-1 my-2 ml-2' onClick={connectWallet} disabled={walletConnected}>
          {buttonText}
        </button>


        <h1 className="text-3xl font-bold">My Token dApp</h1>
        <p>Account: {account}</p>
        <p>Pol Balance: {balance} MTK</p>
        <p>Token Balance: {tokenBalance} MTK</p>

        <button onClick={mintTokens}>Mint Tokens (0.001 POL)</button>

        <div>
          <h2>Transfer Tokens</h2>
          <input type="text" id="recipient" placeholder="Recipient address" />
          <input type="number" id="amount" placeholder="Amount to transfer" />
          <button onClick={() => transferTokens(document.getElementById('recipient').value, document.getElementById('amount').value)}>
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
