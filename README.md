## AMM - Automated Market Maker DApp application

DEX - Decentralized application allows users to swap tokens, currently it supports 2 tokens DAPP/USD. Improving to support multiple chains selection as well

### End-to-End technology stack
1. FrontEnd: NextJS (UI and user interactions), web3-react (interact with smart contract deployed in blockchain), zustand (state management), ChakraUI (css styling)
2. BackEnd: Solidity (Implement smart contracts), Hardhat (deploy, run and test), ethers


### Steps
1. npx create-next-app@13.4.19 (name: nextjs-hardhat template)
2. Accept all defaults to create project, TailwindCSS - No
3. cd nextjs-hardhat-template/
4. npm run dev
5. npm i -D hardhat@2.15.0
6. npx hardhat test
7. npx hardhat node
8. npx hardhat run scripts/deploy.js --network localhost
9. 