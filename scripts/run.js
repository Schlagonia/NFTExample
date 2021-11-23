

const main = async () => {

    const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();

    console.log("NFT Contract deplyed to: ", nftContract.address);

    let txn = await nftContract.makeAnEpicNFT();

    await txn.wait()

    let txn2 = await nftContract.makeAnEpicNFT();

    await txn2.wait()

    let bal = await nftContract.bal('0xbACe4786dc66623bc7506FF85Dc0a5E6466EB74D')
    console.log(bal.toNumber())


}

const runMain = async () => {
    try {
        await main();
        process.exit(0)
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();