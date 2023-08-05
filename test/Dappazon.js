const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Dappazon', async () => {
  let dappazon
  let buyer
  beforeEach(async () => {
    // there are total 20 accounts and depoyer and buyer are entered inside the array 
    // at 1st and 2nd positions it will fetch starting 2 accounts
    [buyer] = await ethers.getSigners()
    // console.log(deployer, buyer.address)
    // console.log((await ethers.getSigners()).length)
    // Deploy the smart contract 
    const Dappazon = await ethers.getContractFactory("Dappazon");
    dappazon = await Dappazon.deploy();

  })

  describe("Deployments", () => {
    it("Sets the owner", async () => {
      expect(await dappazon.owner()).to.equal(buyer.address)
    })

    // it("has a name", async () => {
    //   const name = await dappazon.name()
    //   expect(name).to.equal("Dappazon")
    // })


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