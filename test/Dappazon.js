const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}
// global constants for listing on itenm 
const ID = 7;
const NAME = "shoes";
const CATEGORY = "Clothing";
const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg";
const COST = tokens(1);
// above token function is converting the ether into wei (smaller unit having 18 zero at last )
const RATING = 4;
const STOCK = 5;

describe('Dappazon', async () => {
  let dappazon
  let deployer, buyer
  beforeEach(async () => {
    // there are total 20 accounts and depoyer and buyer are entered inside the array 
    // at 1st and 2nd positions it will fetch starting 2 accounts
    [deployer, buyer] = await ethers.getSigners()
    // console.log(deployer, buyer.address)
    // console.log((await ethers.getSigners()).length)
    // Deploy the smart contract 
    const Dappazon = await ethers.getContractFactory("Dappazon");
    dappazon = await Dappazon.deploy();

  })



  describe("Deployments", () => {
    it("Sets the owner", async () => {
      expect(await dappazon.owner()).to.equal(deployer.address)
    })
  })

  describe("Listing ", () => {
    let transcations

    beforeEach(async () => {
      transcations = await dappazon.connect(deployer).listProduct(
        ID,
        NAME,
        CATEGORY,
        IMAGE,
        COST,
        RATING,
        STOCK
      )
      await transcations.wait()
    })
    it("Return item attribute", async () => {
      const item = await dappazon.items(ID)
      // items mapping is not like an array it , id you enter
      // the place it takes  id = 3 , items(3)
      expect(item.id).to.equal(ID);
      expect(item.name).to.equal(NAME);
      expect(item.category).to.equal(CATEGORY);
      expect(item.image).to.equal(IMAGE);
      expect(item.cost).to.equal(COST);
      expect(item.rating).to.equal(RATING);
      expect(item.stock).to.equal(STOCK)
    })
    it("Emits List event", async () => {
      expect(transcations).to.emit(dappazon, 'list');
    })


  })



  describe("Listing ", () => {
    let transcationList
    let transcationBuy

    beforeEach(async () => {
      //connecting the listproduct function to the deployer account for trans.
      transcationList = await dappazon.connect(deployer).listProduct(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
      await transcationList.wait()

      // {value:COST} is function meta data we are able to put because we added payable to the function 
      transcationBuy = await dappazon.connect(buyer).buy(ID, { value: COST });
      await transcationBuy.wait()
    })

    it("update buyer orderCount", async () => {
      const result = await dappazon.orderCount(buyer.address)
      expect(result).to.equal(1);
    })
    it("Add the order", async () => {
      const order = await dappazon.orders(buyer.address, 1)
      expect(order.time).to.be.greaterThan(0);
      expect(order.item.name).to.equal(NAME);
    })
    it("updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(dappazon.address);
      console.log(result)
      expect(result).to.equal(COST);
    })
    it("Emit the buy event", async () => {
      expect(transcationBuy).to.emit(dappazon, "Buy")
    })


  })

  describe("Withdrawing", () => {
    let balanceBefore
    beforeEach(async () => {
      let transactionDeploy = await dappazon.connect(deployer).listProduct(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
      await transactionDeploy.wait()
      // buy an itme 
      let transactionBuy = await dappazon.connect(buyer).buy(ID, { value: COST })
      await transactionBuy.wait()

      // deployer balnace before
      balanceBefore = await ethers.provider.getBalance(deployer.address)
      // withdraw amount
      let transaction = await dappazon.connect(deployer).withdraw()
      await transaction.wait(1)
    })

    it("UPpdates the owner balance", async () => {
      // balance after will be 0 
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })
    it("updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(dappazon.address);
      expect(result).to.equal(0);
    })
  })
})


/**
 * insert Await keyword in all the places which has to be must  exexuted which 
 * deploy the contrct 
 * getSigners
 * deploy 
 * get contratfactoy 
 * checking it functions
 */

/**
 * Error Number 1
 * [
  Dappazon
    Deployments
      1) Sets the owner


  0 passing (1s)
  1 failing

  1) Dappazon
       Deployments
         Sets the owner:
     TypeError: dappazon.owner is not a function
      at Context.<anonymous> (test/Dappazon.js:24:29)
      at processImmediate (node:internal/timers:466:21)
 ]
  this is due to the visibilty of th eowner is not set (public)

 */