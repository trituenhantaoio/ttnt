const abi = [
  "event Airdrop(address indexed _user, uint256 quantity)",
  "function airdrop() external returns (bool success)"
];

const ttnt_abi = [
  "function approve(address spender, uint256 tokens) external returns (bool success)"
];

const TTNTAdress="0xdb7ae90f2666a6c2f9a43cf37b7633fda5c2a882";
const deployedNetwork = 56;
let signer;
let provider;
let accounts;
let account;
var contractAddress = "0x03b95d19236fa63301fa689c27da0c46d0fb0d81";

$(".afterLoadWeb3").attr('disabled', 'disabled');

$("#contractAddress").click(function(){
	var url="https://bscscan.com/address/"+contractAddress;
	window.open(url, '_blank').focus();
    loadBlockchainData();
});

$("#loadWeb3").click(loadWeb3);
$("#claimAirdrop").click(airdrop);


//Load web3 interface or get read access via Infura
async function loadWeb3() {
  // Connect to the network
  // Modern dapp browsers...
  if (window.ethereum) {
    try {
      // Request account access if needed
      await ethereum.enable();//If this doesn't work an error is thrown
      console.log("User has a MODERN dapp browser!");
      alert("Kết nối MetaMask thành công!");
      provider = new ethers.providers.Web3Provider(ethereum);
      loadBlockchainData();
      
    } catch (error) {
      console.log("There was and error: ", error.message);//In case user denied access
      alert("Kết nối tài khoản thất bại.");
    }
  }
  // Legacy dapp browsers (acccounts always exposed)...
  else if (window.web3) {
    provider = new ethers.providers.Web3Provider(web3.currentProvider);
    console.log("User has a LEGACY dapp browser!");
    alert("Kết nối MetaMask thành công!");
    loadBlockchainData();
  }
  // Non-dapp browsers...
  else {
    //Load blockchain and contract data (jackpot, last games) via ethers default provider (Infura, Etherscan)
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    alert("Chưa cài MetaMask hoặc Trình duyệt không hỗ trợ MetaMask!");
  }
  
}

async function loadBlockchainData() {
  //First check if contract is deployed to the network
  let activeNetwork = await provider.getNetwork(provider);
  // console.log(activeNetwork);
  accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  account = accounts[0];

  if (activeNetwork.chainId === deployedNetwork) {
    //When connected via Metamask (i.e. "provider.connection" defined) define a signer (for read-write access),
    //else (i.e. non-ethereum browser) use provider (read access only)
    if (provider.connection) signer = provider.getSigner(); else signer = provider;
  airdropContract = new ethers.Contract(contractAddress, abi, signer);
  ttnt = new ethers.Contract(TTNTAdress, ttnt_abi, signer);
  $(".afterLoadWeb3").removeAttr('disabled');
  } else {
    //Ethereum enabled browser, but wrong network selected.
    alert("Lỗi! Vui lòng chuyển sang chuỗi Binance Smart Chain (BNB) để tiếp tục.");
  }
}


async function airdrop(){
  try {
    await airdropContract.airdrop();
  } catch (err) {
    alert("Đã có lỗi, vui lòng thử lại. Bạn còn phiếu mua hàng không?");
  }
}