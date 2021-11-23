// Interact witht the sample front end @ https://nft-starter-project.schlagonia.repl.co/

import React, { useEffect, useState } from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import { ethers } from "ethers";
import myEpicNft from './utils/MyEpicNft.json';

// Constants
const CONTRACT_ADDRESS = "0xD0882fb65cF7Ce6168e6ff8dAe917f1483472616";
const TWITTER_HANDLE = 'schlagonia';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = `https://rinkeby.rarible.com/collection/${CONTRACT_ADDRESS}`;
const TOTAL_MINT_COUNT = 50;

const App = () => {
  // Render Methods
  const [ currentAccount, setCurrentAccount ] = useState("");
  const [ minted, setMinted ] = useState(0);
  const [ owned, setOwned ] = useState()
  let displayOwned;
  const [ balance, setBalance ] = useState(0)

  const checkIfWalletIsConnected = async () => {

    const { ethereum } = window;

    if(!ethereum){
      console.log("Hook up that MM bro");
      return
    } else {
      console.log("We have the eth object", ethereum)
    }

    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log('connected to ' + chainId);

    const rinkebyId = '0x4';
    if(chainId !== rinkebyId){
      alert('Please connect to Rinekby');
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if(accounts.length !== 0){
      const account = accounts[0];
      console.log("Found this guys account info: ", account);
      setCurrentAccount(account);
      
      setupEventListener()
    } else {
      console.log('Noones home')
    }


  };

  useEffect( async() => {
    console.log('loadingNFts')
    try {
    const { ethereum } = window
    console.log('ethereum')
      console.log('getting balance')
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

      const bal = await connectedContract.balanceOf(currentAccount);

      if(bal.toNumber() > 0 ) {
        console.log('bal > 0 setting owned')
        setBalance(bal.toNumber());
        setOwned('https://ipfs.io/ipfs/QmVinR5VDhjX9kRYiZkxU6GdgBQo7goY7NEARUMgrRVoL5/')
      
    }

    } catch (error){
      console.log(error)
    }

  }, [currentAccount])

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if(!ethereum) {
        console.log("GEt MM YOU FUCKTARD");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts"})

      console.log("connected to ", accounts[0]);
      setCurrentAccount(accounts[0])

      setupEventListener()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect( async () => {
    try{
    
    const { ethereum } = window;

    if(ethereum){
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

      const amount = await connectedContract.numberMinted()
      setMinted(amount.toNumber());

    }

    } catch (error) {
      console.log(error)
    }
  }, [])

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if(ethereum) {
         const provider = new ethers.providers.Web3Provider(ethereum);
         const signer = provider.getSigner();
         const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

         

         connectedContract.on('NewEpicNFTMinted', (from, tokenId) =>{
          console.log(from, tokenId.toNumber())
          alert(`THere was a new NFT minted and sent t your wallet! You can see it here https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}, It may take a few minutes to show up.`)
         });

         console.log('event listener setup')
      } else {
        console.log('No eth object detected')
      }
    } catch (error) {
      console.log(error);
    }

  }

  const askContractToMint = async () => {
    

    try {
      const { ethereum } = window;

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("Asking wallet to approve gas")
        let nftTxn = await connectedContract.makeAnEpicNFT()

        console.log("minting...")
        alert('Minting your NFT... This may take a few seconds')
        await nftTxn.wait();

        console.log(`Transaction mined. See the txn at https://rinkeby.etherscan.io/tx/${nftTxn.hash}`)

      } else {
        console.log("ethereum object es no bueno")
      }
    } catch (error){
      console.log(error)
    }
  }

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
            <p className="sub-text">Total NFTs Minted: {minted}/50</p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
           ) :
            (
              <button onClick={askContractToMint} className="cta-button connect-wallet-button">
                Mint NFT
              </button>
            )}  
            
        </div>
        <div>
          <p className='sub-text'>Your NFT's: {balance}</p>
          { owned ? <img style={{ width: '15%', height: '70%' }}src={owned} /> : <></> }
        </div>
        <a href={OPENSEA_LINK} target="_blank" className="sub-text">See collection on Rarible</a>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
          <p style={{ color: 'white', paddingLeft: '10px' }} >Check out the contract on Etherscan <a href={`https://rinkeby.etherscan.io/address/${CONTRACT_ADDRESS}`} target='_blank'>here!</a></p>
        </div>
      </div>
    </div>
  );
};

export default App;
