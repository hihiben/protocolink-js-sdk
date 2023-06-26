import { Router, Router__factory, calcAccountAgent, setContractAddress } from 'src';
import * as common from '@protocolink/common';
import { expect } from 'chai';
import { getChainId, snapshotAndRevertOnce } from '@protocolink/test-helpers';
import hre from 'hardhat';

describe('Test calcAccountAgent', function () {
  let chainId: number;
  let router: Router;

  snapshotAndRevertOnce();

  before(async function () {
    chainId = await getChainId();
    const [deployer] = await hre.ethers.getSigners();

    router = await (
      await new Router__factory()
        .connect(deployer)
        .deploy(common.getWrappedNativeToken(chainId).address, deployer.address, deployer.address, deployer.address)
    ).deployed();
    setContractAddress(chainId, 'Router', router.address);
    const agentImplementation = await router.agentImplementation();
    setContractAddress(chainId, 'AgentImplementation', agentImplementation);
  });

  const testCases = [
    { account: '0x5cb738DAe833Ec21fe65ae1719fAd8ab8cE7f23D' },
    { account: '0xa3C1C91403F0026b9dd086882aDbC8Cdbc3b3cfB' },
  ];

  testCases.forEach(({ account }, i) => {
    it(`case ${i + 1}`, async function () {
      const accountAgent = calcAccountAgent(chainId, account);
      const accountAgentFromRouter = await router.calcAgent(account);
      expect(accountAgent).to.eq(accountAgentFromRouter);
    });
  });
});
