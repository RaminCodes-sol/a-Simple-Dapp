
// <!-- npm install ethers@5.7.2 -->

/*-----First-Way-To-Connect-Wallet-----*/
const connectToWallet = async () => {
  try {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // Further logic or state updates with the provider or signer
    } else {
      throw new Error('MetaMask extension not detected');
    }
  } catch (error) {
    console.log(error.message);
  }
};

useEffect(() => {
  connectToWallet()
}, [])


/*-----Second-Way-To-Connect-Wallet-----*/
const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

useEffect(() => {
  const connectToWallet = async () => {
    await provider.send("eth_requestAccounts", [])
  }
  connectToWallet()
  .catch(console.error)
}, [])

