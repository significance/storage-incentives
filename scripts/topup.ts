//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const postageStampAddress = "0x6a1A21ECA3aB28BE85C7Ba22b2d6eAE5907c900E";
const bzzAddress = "0xdBF3Ea6F5beE45c02255B2c26a16F300502F68da";
const batchID = "0x94bc9bd00d3856031abd9f6dae07f68ab891dcc45e5dda46230e31158fdb2739";
const topUpAmount = 1000;

function resolveAfter10Seconds() {
 return new Promise(resolve => {
 setTimeout(() => {
 resolve();
 }, 10000);
 });
}

async function main() {
  const accounts = await hre.ethers.getSigners();

  const PostageStamp = await hre.ethers.getContractFactory("PostageStamp");
  const ps = await PostageStamp.attach(postageStampAddress);
  const balance = await ps.remainingBalance(batchID);

  console.log('remaining batch balance per chunk',balance.toString());

  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const tt = await TestToken.attach(bzzAddress);

  let batchDepth = 4
  let batchSize = 2 ** (batchDepth + 16);
  const transferAmount = topUpAmount * batchSize;

  console.log('price to be charged for batch in plur', transferAmount)

  let bal = await tt.balanceOf("0x6a1A21ECA3aB28BE85C7Ba22b2d6eAE5907c900E")
  console.log('balance in senders wallet', bal.toString())

	await tt.approve(bzzAddress, transferAmount)
	console.log('bzz transfer approved')

  resolveAfter10Seconds()

    await ps.topUp(batchID, topUpAmount)
    console.log(batchID, 'topped up by', topUpAmount, 'plur')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });