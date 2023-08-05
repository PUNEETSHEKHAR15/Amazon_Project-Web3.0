const { expect } = require("chai")

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
  let deployer
  beforeEach(async () => {
    // there are total 20 accounts and depoyer and buyer are entered inside the array 
    // at 1st and 2nd positions it will fetch starting 2 accounts
    [deployer] = await ethers.getSigners()
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