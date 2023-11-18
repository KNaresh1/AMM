## AMM - Automated Market Maker DApp application
1. FrontEnd: NextJS, web3-rect, ChakraUI
2. BackEnd: Solidity, Hardhat, ethers



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