import { expect } from "chai";
import { ethers } from "hardhat";

describe("Whitelist", function () {
  it("Should add new address to whitelist", async function (){
    const Whitelist = await ethers.getContractFactory("Whitelist");
    const whitelist = await Whitelist.deploy(10);
    await whitelist.deployed();

    const addAddressToWhitelistTx = await whitelist.addAddressToWhitelist();
    await addAddressToWhitelistTx.wait();

    expect(await whitelist.numOfAddressesWhitelisted()).to.equal(1);
  });

  it("Should add multiple new addresses to whitelist", async function (){
    const [owner, randomPerson] = await ethers.getSigners();
    const Whitelist = await ethers.getContractFactory("Whitelist");
    const whitelist = await Whitelist.deploy(10);
    await whitelist.deployed();

    const addAddressToWhitelistTx1 = await whitelist.addAddressToWhitelist();
    await addAddressToWhitelistTx1.wait();

    const addAddressToWhitelistTx2 = await whitelist.connect(randomPerson).addAddressToWhitelist();
    await addAddressToWhitelistTx2.wait();

    expect(await whitelist.numOfAddressesWhitelisted()).to.equal(2);
  });

  it("Should not add existing address to whitelist", async function (){
    const Whitelist = await ethers.getContractFactory("Whitelist");
    const whitelist = await Whitelist.deploy(10);
    await whitelist.deployed();

    const addAddressToWhitelistTx1 = await whitelist.addAddressToWhitelist();
    await addAddressToWhitelistTx1.wait();

    await expect(whitelist.addAddressToWhitelist()).to.be.revertedWith("Sender has already been whitelisted");
  });

  it("Should not add addresses to whitelist more than max limit", async function (){
    const [owner, randomPerson1, randomPerson2] = await ethers.getSigners();
    const Whitelist = await ethers.getContractFactory("Whitelist");
    const whitelist = await Whitelist.deploy(2);
    await whitelist.deployed();

    const addAddressToWhitelistTx1 = await whitelist.addAddressToWhitelist();
    await addAddressToWhitelistTx1.wait();

    const addAddressToWhitelistTx2 = await whitelist.connect(randomPerson1).addAddressToWhitelist();
    await addAddressToWhitelistTx2.wait();

    await expect(whitelist.connect(randomPerson2).addAddressToWhitelist()).to.be.revertedWith("More addresses cant be added, limit reached");
  });
});
