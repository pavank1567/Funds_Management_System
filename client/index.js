
import {ethers} from "./ethers.js"
import { abi , contractAddress } from "./constants.js"

const connectButton = document.getElementById("connect");

const sendButton = document.getElementById("sendButton");

const metAlert=document.querySelector(".metAlert");

const paymentContainer=document.getElementsByClassName('payment');

const alert=document.querySelector('.enable-alert');


connectButton.onclick = connect
sendButton.onclick = transfer

var currentAccount;
async function connect() {
  
  if(typeof window.ethereum !== "undefined"){

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    // console.log(accounts);
    const account = accounts[0];
    currentAccount=ethers.utils.getAddress(account);

    for(let i=0;i<paymentContainer.length;i++)
      paymentContainer[i].style.display="none";
  
    const act=document.querySelector('.account');
    const actAddress=document.querySelector('.actAddress');
    actAddress.innerHTML=currentAccount;


    const walletAmt=document.querySelector(".wallet-amt");
    const balance = await provider.getBalance(currentAccount);
    walletAmt.innerHTML=ethers.utils.formatEther(balance);

    if (act.style.display === "none") {
      act.style.display = "";
    }
    alert.style.display="none";
  }
  else{
    metAlert.style.display="";
  }
}

const paymentButton=document.querySelector('.payment-btn');

paymentButton.addEventListener('click', () => {
  if(currentAccount){ 

    localStorage.setItem("currentAccount",currentAccount);
    // location.href="TransactionList.html";
    if(paymentContainer[0].style.display=="none"){
      for(let i=0;i<paymentContainer.length;i++)
        paymentContainer[i].style.display="";
    }
    else{
    for(let i=0;i<paymentContainer.length;i++)
      paymentContainer[i].style.display="none";
    }
  }
  else{
    alert.style.display="block";
  }
});


async function transfer() {
  const amount = document.querySelector(".amount").value;
  const receiver=document.querySelector(".rec").value;
  const message=document.querySelector(".message").value;
  console.log(`Transfering ${amount} ethers...`)
  if (typeof window.ethereum !== "undefined") {
    
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer);

    // console.log(contract);
    try {
      const parsedAmt=ethers.utils.parseEther(amount);
      await ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: currentAccount,
          to: receiver,
          value: parsedAmt._hex,
        }],
      });

      // const transactionHash = await contract.pay(receiver, parsedAmt, message,{value: parsedAmt});
      const transactionHash=await contract.pay(receiver,parsedAmt,message);

      var isLoading=true;
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      console.log(`Success - ${transactionHash.hash}`);
      isLoading=false;

    } catch (error) {
      console.log(error)
    }
  } else {
    
  }
}

const getTran=document.querySelector('.getTran');
getTran.addEventListener('click', () => {
  getAllTransactions();
  
});

async function getAllTransactions(){
  console.log('Getting all transactions')
  if (typeof window.ethereum !== "undefined") {

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      // await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer);

      // let userAddress = await signer.getAddress();
      // console.log(userAddress);

      const availableTransactions = await contract.getAllTransactions();
      console.log(availableTransactions);
      localStorage.setItem("availableTransactions",JSON.stringify(availableTransactions));
      location.href = "TransactionList.html";

      // const structuredTransactions = availableTransactions.map((transaction) => ({
      //   addressTo: transaction.receiver,
      //   addressFrom: transaction.sender,
      //   timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
      //   message: transaction.message,
      //   amount: parseInt(transaction.amt._hex) / (10 ** 18)
      // }));

    } catch (error) {
      console.log(error)
    }
  } else {
    
  }
}
