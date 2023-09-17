import { useState, useEffect } from "react"
import { ethers } from 'ethers'



const App = () => {
  const [greetingValue, setGreetingValue] = useState('')
  const [depositValue, setDepositValue] = useState('')
  const [greet, setGreet] = useState('')
  const [contractBalance, setContractBalance] = useState('')
  const [isGreetButtonActive, setIsGreetButtonActive] = useState(false)
  const [isDepositButtonActive, setIsDepositButtonActive] = useState(false)

  

  /*---Connecting-To-MetaMask---*/
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()


  /*---Contract-Address---*/
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"


  /*---Contract-ABI---*/
  const contractABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_greeting",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "greet",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_greetingText",
          "type": "string"
        }
      ],
      "name": "setGreeting",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]


  /*---Contract-Instance---*/
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

 
  
  useEffect(() => {

    /*---ConnectToWallet---*/
    const connectToWallet = async () => {
      await provider.send("eth_requestAccounts", [])
    }

    /*---GetBalance---*/
    const getBalance = async () => {
      const balance = await provider.getBalance(contractAddress)
      const balanceInEther = ethers.utils.formatEther(balance)
      setContractBalance(balanceInEther)
    }

    /*---GetGreeting---*/
    const getGreeting = async () => {
      const greeting = await contract.greet()
      setGreet(greeting)
    }

    connectToWallet()
      .catch(console.error)

    getBalance()
      .catch(console.error)

    getGreeting()
      .catch(console.error)
  }, [])

  
  /*-------HandleGreetingSubmit-------*/
  const handleGreetingSubmit = async (e) => {
    e.preventDefault()

    if (greetingValue === '') {
      alert('Please fill the input!')
      return
    }

    setIsGreetButtonActive(true)

    const greetingUpdate = await contract.setGreeting(greetingValue)
    await greetingUpdate.wait()
    
    // const greetingText = await contract.greet()
    // setGreet(greetingText)

    setGreet(greetingValue)
    setGreetingValue('')
    setIsGreetButtonActive(false)
  }


  /*-------HandleDepositSubmit-------*/
  const handleDepositSubmit = async (e) => {
    e.preventDefault()

    if (depositValue === '') {
      alert('Please fill the input!')
      return
    }

    setIsDepositButtonActive(true)
    
    const ethValue = ethers.utils.parseEther(depositValue)
    const depositEth = await contract.deposit({ value: ethValue })
    await depositEth.wait()

    const balance = await provider.getBalance(contractAddress)
    const balanceInEther = ethers.utils.formatEther(balance)
    setContractBalance(balanceInEther)

    setDepositValue('')
    setIsDepositButtonActive(false)
  }


  return (
    <main className="w-full h-screen max-w-[1000px] mx-auto px-2 py-5 flex justify-between items-center">

      {/*-------Left-Side-------*/}
      <div className="pr-4">
        <h2 className="text-xl mb-2">
          Greeting: <span className="text-green-500 font-semibold">{greet}</span>
        </h2>
        <h2 className="text-xl">
          Contract Balance: <span className="text-blue-500 font-semibold">${contractBalance} ETH</span>
        </h2>
      </div>

      {/*-------Right-Side-------*/}
      <div className="w-full max-w-[500px]">
        <form onSubmit={handleGreetingSubmit} className="flex flex-col items-start">
          <input 
            type='text' 
            placeholder="greeting..." 
            value={greetingValue} 
            onChange={(e) => setGreetingValue(e.target.value)} 
            className="w-full border-none outline-none px-2 py-3 rounded-sm text-black"
          />
          <button type="submit" disabled={isGreetButtonActive} className={`${isGreetButtonActive ? 'bg-green-400 p-2 w-[80px] rounded-md mb-7 mt-2' : 'bg-green-700 p-2 w-[80px] rounded-md transition-colors hover:bg-green-800 mb-7 mt-2'}`}>
            { isGreetButtonActive ? "waiting" : "Greet"}
          </button>
        </form>

        <form onSubmit={handleDepositSubmit} className="flex flex-col items-start">
          <input 
            type='text' 
            placeholder="deposit value..." 
            value={depositValue} 
            onChange={(e) => setDepositValue(e.target.value)}
            className="w-full border-none outline-none px-2 py-3 rounded-sm text-black"
          />
          <button type="submit" disabled={isDepositButtonActive} className={`${isDepositButtonActive ? 'bg-blue-400 p-2 w-[80px] rounded-md mb-7 mt-2' : 'bg-blue-700 p-2 w-[80px] rounded-md transition-colors hover:bg-blue-800 mb-7 mt-2'}`}>
            {isDepositButtonActive ? "waiting" : "Deposit"}
          </button>
        </form>
      </div>

    </main>
  )
}

export default App
