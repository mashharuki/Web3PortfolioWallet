/**
 * ======================================================================
 * The Test Code for WalletFactory Contract + MyToken Contract
 * ======================================================================
 */

const truffleAssert = require("truffle-assertions");
const DNS = artifacts.require("DNS");

/**
 * test
 */
contract("DNS Contract tests!!", accounts => {

      // variable for dns Contract
      var dns;
      // sample name
      var name = "test";
      // sample DID
      const did = "did:ion:er....rer";
      // sample VC name
      const vcName = "testVC";
      // sample DID
      const cid = "09i464xi6964wugjtioe";
      // NFT name
      const nftName = "DID Name Service";
      // NFT symbol
      const nftSymbol = "DNS";
      // VCs
      var vcs;

      /**
       * deploy contract method
       */
      beforeEach (async () => {
            dns = await DNS.new();
      });

      /**
       * init test 
       */
      describe ("initialization", () => {
            // check 
            it ("confirm owner address", async () => {
                  // check owner address
                  assert.equal(true, await dns.isOwner(), "owner address must be match!!");
            });
            it ("confirm NFT name", async () => {
                  // check owner address
                  assert.equal(nftName, await dns.name(), "NFT Name must be match!!");
            });
            it ("confirm NFT Symbol", async () => {
                  // check owner address
                  assert.equal(nftSymbol, await dns.symbol(), "NFT Symbol must be match!!");
            });
      });

      /**
       * transferOwnerShip test 
       */
      describe ("transferOwnerShip", () => {
            // check 
            it ("transferOwnerShip test", async () => {
                  // transferOwnerShip
                  await dns.transferOwnership(accounts[1]);
                  // check owner address
                  assert.equal(false, await dns.isOwner(), "owner address must not be match!!");
                  assert.equal(true, await dns.isOwner({from: accounts[1]}), "owner address must be match!!");
            });
            it ("【error】transferOwnerShip test", async () => {
                  // transferOwnerShip
                  await dns.transferOwnership(accounts[1]);
                  // check owner address
                  await truffleAssert.reverts(
                        dns.transferOwnership(accounts[2]),
                  );
            });
      });

      /**
       * register test code
       */
      describe ("register test", async () => { 
            it ("register", async () => {
                  // set
                  await dns.register(name, did, accounts[0]);
                  // get balance
                  const balanceOf = await dns.balanceOf(accounts[0]);
                  // check
                  assert.equal(1, balanceOf, "balanceOf must be match!!");
            });
            it ("register ✖️ 2", async () => {
                  // set
                  await dns.register(name, did, accounts[0]);
                  await dns.register(name, did, accounts[1]);
                  // get balance
                  const balanceOf = await dns.balanceOf(accounts[0]);
                  const balanceOf2 = await dns.balanceOf(accounts[1]);
                  // check
                  assert.equal(1, balanceOf, "balanceOf must be match!!");
                  assert.equal(1, balanceOf2, "balanceOf must be match!!");
            });
            it ("register ✖️ 3", async () => {
                  // set
                  await dns.register(name, did, accounts[0]);
                  await dns.register(name, did, accounts[1]);
                  await dns.register(name, did, accounts[2]);
                  // get balance
                  const balanceOf = await dns.balanceOf(accounts[0]);
                  const balanceOf2 = await dns.balanceOf(accounts[1]);
                  const balanceOf3 = await dns.balanceOf(accounts[2]);
                  // check
                  assert.equal(1, balanceOf, "balanceOf must be match!!");
                  assert.equal(1, balanceOf2, "balanceOf must be match!!");
                  assert.equal(1, balanceOf3, "balanceOf must be match!!");
            });
            it ("【error】register", async () => {
                  // set
                  await dns.register(name, did, accounts[0]);
                  // get balance
                  const balanceOf = await dns.balanceOf(accounts[0]);
                  // check
                  assert.equal(1, balanceOf, "balanceOf must be match!!");
                  // reverts
                  await truffleAssert.reverts(
                        dns.register(name, did, accounts[0]),
                  );
            });
      });

      /**
       * getDidInfo
       */
      describe ("gitDidInfo test", async () => { 
            it ("gitDidInfo", async () => {
                  // set
                  await dns.register(name, did, accounts[0]);
                  // get balance
                  const balanceOf = await dns.balanceOf(accounts[0]);
                  // get DID from name
                  const didInfo = await dns.getDidInfo(name);
                  // check
                  assert.equal(1, balanceOf, "balanceOf must be match!!");
                  assert.equal(did, didInfo, "did must be match!!");
            });
      });

      /**
       * get all names test code
       */
      describe ("get all names test", async () => { 
            it ("get all names", async () => {
                  // set
                  await dns.register(name, did, accounts[0]);
                  // get all name 
                  const allNames = await dns.getAllNames();
                  // check
                  assert.equal(1, allNames.length, "names length must be match!!");
            });
            it ("get all names ✖️ 2 ", async () => {
                  // set
                  await dns.register(name, did, accounts[0]);
                  await dns.register(name, did, accounts[1]);
                  // get all name 
                  const allNames = await dns.getAllNames();
                  // check
                  assert.equal(2, allNames.length, "names length must be match!!");
            });
      });
});