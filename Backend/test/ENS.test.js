const Web3 = require("web3");
const { expect, assert } = require("chai");
const { constants: { ZERO_ADDRESS } } = require("@openzeppelin/test-helpers");

const ENS = artifacts.require("ENS");
const web3 = new Web3(
    new Web3.providers.HttpProvider("")
);

contract("Testing ENS Smart Contract Functionallity", ([ user1, user2, user3, user4 ]) => {
    before(async () => {
        this.ens = await ENS.new();
        expect(this.ens.address).to.not.be.equal(ZERO_ADDRESS);
        await this.ens.createDomain("User_4.eth", { from: user4 });
    });

    describe("Check create-domain function", () => {
        context("Check functionallity with passing true data", () => {
            it("User-1 must be able to create a domain successfully", async () => {
                try {
                    const DOMAIN_NAME = "User_1.eth";

                    let { logs } = await this.ens.createDomain(DOMAIN_NAME, { from: user1 });
                    let { args, event: eventName } = logs[0];
                    
                    assert.equal(
                        (await this.ens.domainCounter()).toString(),
                        "3"
                    );

                    assert.equal(eventName, "DomainCreated");
                    assert.equal(args.creator, user1);
                    assert.equal(args.domainName, DOMAIN_NAME);
                    assert.equal(
                        (args.domainId).toString(), "2"
                    );
                        
                    assert.equal(
                        await this.ens.userToDomain(user1),
                        DOMAIN_NAME
                    );
                    assert.equal(
                        await this.ens.domainToUser(DOMAIN_NAME),
                        user1
                    );
                    assert.equal(
                        await this.ens.hasDomain(user1),
                        true
                    );
                    assert.equal(
                        await this.ens.isExists(DOMAIN_NAME),
                        true
                    );
                } catch(err) {
                    console.log(err);
                    assert(false);
                };
            });
        });

        context("Check requires with passing false data", async () => {
            it("User-1 must not be able to create an other domain becuz he/she already owns a domain", async () => {
                try {
                    const DOMAIN_NAME = "User_1.eth";

                    await this.ens.createDomain(DOMAIN_NAME, { from: user1 });

                    assert(false);
                } catch(err) {
                    assert.equal(err.reason, "Recepient currently has a domain!");
                };
            });

            it("User-2 must not be able to create a domain with the same name as User-1's domain", async () => {
                try {
                    const DOMAIN_NAME = "User_1.eth";

                    await this.ens.createDomain(DOMAIN_NAME, { from: user2 });

                    assert(false);
                } catch(err) {
                    assert.equal(err.reason, "Domain exists!");
                };
            });
        });
    });

    describe("Check transfer-domain function", () => {
        context("Check functionallity with passing true data", () => {
            it("User-1 must be able to transfer his/her domain to User-3", async () => {
                try {
                    const DOMAIN_NAME = "User_1.eth";

                    const { logs } = await this.ens.transferDomain(
                        DOMAIN_NAME,
                        user2,
                        { from: user1 }
                    );
                    let { args, event: eventName } = logs[0];

                    assert.equal(eventName, "DomainTransfered");
                    assert.equal(args.from, user1);
                    assert.equal(args.to, user2);
                    assert.equal(args.domainName, DOMAIN_NAME);
                        
                    assert.equal(
                        await this.ens.userToDomain(user2),
                        DOMAIN_NAME
                    );
                    assert.equal(
                        await this.ens.domainToUser(DOMAIN_NAME),
                        user2
                    );
                    assert.equal(
                        await this.ens.hasDomain(user1),
                        false
                    );
                    assert.equal(
                        await this.ens.hasDomain(user2),
                        true
                    );
                } catch {
                    assert(false);
                };
            });
        });

        context("Check requires with passing false data", () => {
            it("User-2 must not be able to transfer non-exist domain", async () => {
                try {
                    const DOMAIN_NAME = "Not_Exist.eth";

                    await this.ens.transferDomain(
                        DOMAIN_NAME,
                        user3,
                        {
                            from: user2
                        }
                    );

                    assert(false);
                } catch(err) {
                    assert.equal(
                        err.reason, "Domain does not exists!"
                    );
                };
            });

            it("User-2 must not be able to transfer a domian to Zero-Address", async () => {
                try {
                    const DOMAIN_NAME = "User_1.eth";

                    await this.ens.transferDomain(
                        DOMAIN_NAME,
                        ZERO_ADDRESS,
                        {
                            from: user2
                        }
                    );

                    assert(false);
                } catch(err) {
                    assert.equal(
                        err.reason, "Invalid recepient address!"
                    );
                };
            });

            it("User-2 must not be able to transfeer a domain to User-4, becuz User-4 already owns a domain", async () => {
                try {
                    const DOMAIN_NAME = "User_1.eth";

                    await this.ens.transferDomain(
                        DOMAIN_NAME,
                        user4,
                        {
                            from: user2
                        }
                    );

                    assert(false);
                } catch(err) {
                    assert.equal(
                        err.reason, "Recepient currently has a domain!"
                    );
                };
            });

            it("User-3 must not be able to transfer the User-2's domain in term of privacy", async () => {
                try {
                    const DOMAIN_NAME = "User_1.eth";

                    await this.ens.transferDomain(
                        DOMAIN_NAME,
                        user3,
                        {
                            from: user3
                        }
                    );

                    assert(false);
                } catch(err) {
                    assert.equal(
                        err.reason, "Only domain owner."
                    );
                };
            });
        });
    });

    describe("Check destroy-domain function", () => {
        it("User-4 must be able to destroy his/her domain", async () => {
            try {
                const DOMAIN_NAME = "User_4.eth";

                const { logs } = await this.ens.destroyDomain(
                    DOMAIN_NAME,
                    {
                        from: user4
                    }
                );

                let { args, event: eventName } = logs[0];

                assert.equal(eventName, "DomainDestroyed");
                assert.equal(args.owner, user4);
                assert.equal(args.domainName, DOMAIN_NAME);
                assert.equal(
                    await this.ens.userToDomain(user4),
                    ""
                );
                assert.equal(
                    await this.ens.domainToUser(DOMAIN_NAME),
                    ZERO_ADDRESS
                );
                assert.equal(
                    await this.ens.hasDomain(user4),
                    false
                );
                assert.equal(
                    await this.ens.isExists(DOMAIN_NAME),
                    false
                );
            } catch {
                assert(false);
            };
        });
    });
});