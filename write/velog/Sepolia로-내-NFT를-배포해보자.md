---
title: "Sepolia로 내 NFT를 배포해보자"
description: "Ethereum의 Sepolia 테스트넷은 실제 자금을 사용하지 않고 스마트 계약을 테스트하기 위한 완벽한 환경입니다. 이 글에서는 Solidity로 NFT(ERC-721) 스마트 계약을 작성하고, Hardhat 개발 프레임워크를 사용해 Sepolia에 배포하는 전체 "
source: "https://velog.io/@pobi/Sepolia%EB%A1%9C-%EB%82%B4-NFT%EB%A5%BC-%EB%B0%B0%ED%8F%AC%ED%95%B4%EB%B3%B4%EC%9E%90"
source_slug: "Sepolia로-내-NFT를-배포해보자"
author: "pobi"
author_display_name: "포비"
released_at: "2025-11-24T10:56:36.901Z"
updated_at: "2026-03-22T19:26:24.908Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/55cfb5d6-e4fd-418c-974e-7c3586c5e113/image.png"
tags: []
---# Sepolia로 내 NFT를 배포해보자

Ethereum의 Sepolia 테스트넷은 **실제 자금을 사용하지 않고 스마트 계약을 테스트하기 위한 완벽한 환경**입니다. 이 글에서는 Solidity로 NFT(ERC-721) 스마트 계약을 작성하고, Hardhat 개발 프레임워크를 사용해 Sepolia에 배포하는 전체 과정을 자세히 다루겠습니다. 실제 동작하는 프로젝트([heodongun/ethereumERC721](https://github.com/heodongun/ethereumERC721))를 기반으로 설명하므로, 코드를 그대로 활용할 수 있습니다.

## 목차

1. [준비 단계: 개발 환경 구축](#1-준비-단계-개발-환경-구축)
2. [MetaMask 설정: Sepolia 테스트넷 연결](#2-metamask-설정-sepolia-테스트넷-연결)
3. [Hardhat 프로젝트 초기화](#3-hardhat-프로젝트-초기화)
4. [NFT 스마트 계약 작성](#4-nft-스마트-계약-작성)
5. [배포 스크립트 작성](#5-배포-스크립트-작성)
6. [Sepolia 테스트넷에 배포](#6-sepolia-테스트넷에-배포)
7. [계약 검증 (Etherscan Verification)](#7-계약-검증-etherscan-verification)
8. [NFT 민팅 및 상호작용](#8-nft-민팅-및-상호작용)
9. [메타데이터와 IPFS](#9-메타데이터와-ipfs)
10. [프론트엔드 대시보드 구축](#10-프론트엔드-대시보드-구축)
11. [문제 해결 및 팁](#11-문제-해결-및-팁)

---

## 1. 준비 단계: 개발 환경 구축

### 1.1 필수 소프트웨어 설치

NFT 배포를 위해서는 Node.js 환경이 필요합니다. **Node.js 20.x LTS 버전을 권장**합니다. Node.js 25는 일부 패키지와 호환성 문제가 있을 수 있습니다.

```bash
# Node.js 버전 확인
node --version  # v20.x.x 권장
npm --version
```

Node.js가 설치되지 않았다면 [공식 웹사이트](https://nodejs.org)에서 LTS 버전을 다운로드하세요.

### 1.2 프로젝트 디렉토리 생성

새로운 프로젝트 디렉토리를 생성하고 npm 프로젝트를 초기화합니다.

```bash
mkdir my-nft-project
cd my-nft-project
npm init -y
```

### 1.3 필수 패키지 설치

Hardhat과 필요한 의존성을 설치합니다.

```bash
# Hardhat 및 핵심 도구
npm install --save-dev hardhat
npm install --save-dev @nomicfoundation/hardhat-toolbox
npm install --save-dev @nomicfoundation/hardhat-verify

# Ethers.js v6 (최신 버전)
npm install --save-dev ethers

# TypeScript 지원 (선택사항이지만 권장)
npm install --save-dev typescript
npm install --save-dev ts-node
npm install --save-dev @types/node

# OpenZeppelin Contracts (검증된 ERC-721 구현)
npm install @openzeppelin/contracts

# 환경 변수 관리
npm install dotenv
```

**각 패키지의 역할:**
- `hardhat`: Ethereum 개발 프레임워크
- `@nomicfoundation/hardhat-toolbox`: 통합 플러그인 모음
- `ethers`: 블록체인 상호작용 라이브러리
- `@openzeppelin/contracts`: 안전하고 검증된 스마트 계약 라이브러리
- `dotenv`: 민감한 정보를 환경 변수로 관리

---

## 2. MetaMask 설정: Sepolia 테스트넷 연결

### 2.1 MetaMask 설치

**MetaMask는 브라우저 기반 Ethereum 지갑**으로, NFT 배포와 트랜잭션 서명에 필수적입니다.

1. Chrome, Firefox, Edge 등의 브라우저에서 [MetaMask 공식 사이트](https://metamask.io)에 접속
2. 확장 프로그램 설치
3. 지갑 생성 또는 복구 (시드 구문을 안전하게 보관하세요!)

### 2.2 Sepolia 테스트넷 추가

MetaMask에 Sepolia 네트워크를 추가합니다.

**자동 추가 방법:**
1. MetaMask 상단의 네트워크 선택 드롭다운 클릭
2. "테스트 네트워크 표시" 토글을 활성화
3. 목록에서 "Sepolia" 선택

**수동 추가 방법 (자동으로 나타나지 않는 경우):**
1. 네트워크 드롭다운 → "네트워크 추가"
2. 다음 정보 입력:

| 항목 | 값 |
|------|-----|
| 네트워크 이름 | Sepolia Testnet |
| RPC URL | https://rpc.sepolia.org |
| 체인 ID | 11155111 |
| 통화 기호 | SepoliaETH |
| 블록 탐색기 | https://sepolia.etherscan.io |

### 2.3 Sepolia 테스트 ETH 획득

NFT 배포에는 가스비가 필요합니다. 다행히 무료 faucet에서 테스트 ETH를 받을 수 있습니다.

**주요 Sepolia Faucet:**
- **Alchemy Faucet**: https://sepoliafaucet.com
- **Chainlink Faucet**: https://faucets.chain.link/sepolia
- **Google Cloud Faucet**: https://cloud.google.com/application/web3/faucet/ethereum/sepolia
- **pk910 Faucet**: https://sepolia-faucet.pk910.de

**사용 방법:**
1. MetaMask에서 계정 주소 복사 (클릭하면 자동 복사됨)
2. Faucet 사이트 방문
3. 주소 붙여넣기 → "Send" 또는 "Request" 클릭
4. 1~2분 후 MetaMask에서 잔액 확인

💡 **Tip**: 배포에는 보통 0.1~0.5 Sepolia ETH면 충분합니다.

---

## 3. Hardhat 프로젝트 초기화

### 3.1 Hardhat 초기화

프로젝트 디렉토리에서 Hardhat을 초기화합니다.

```bash
npx hardhat init
```

다음 옵션 중 선택:
- **"Create a TypeScript project"** (권장) - 타입 안정성 제공
- "Create a JavaScript project" - JavaScript로 작성

프롬프트에서 `.gitignore` 생성 여부를 물으면 "Yes"를 선택합니다.

### 3.2 프로젝트 구조

초기화 후 다음과 같은 구조가 생성됩니다.

```
my-nft-project/
├── contracts/          # 스마트 계약 파일
├── scripts/           # 배포 및 상호작용 스크립트
├── test/              # 테스트 파일
├── hardhat.config.ts  # Hardhat 설정
├── .env               # 환경 변수 (직접 생성)
├── .gitignore
└── package.json
```

### 3.3 환경 변수 파일 생성

프로젝트 루트에 `.env` 파일을 생성합니다.

```bash
touch .env
```

`.env` 파일 내용:

```env
# Sepolia RPC URL (Infura 또는 Alchemy)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# MetaMask 프라이빗 키 (0x로 시작)
PRIVATE_KEY=0x1234567890abcdef...

# Etherscan API 키 (계약 검증용)
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

**⚠️ 보안 주의사항:**
- `.env` 파일은 절대 Git에 커밋하지 마세요!
- `.gitignore`에 `.env`가 포함되어 있는지 확인하세요.

**RPC URL 얻는 방법:**
- **Infura**: https://infura.io → 프로젝트 생성 → Sepolia 엔드포인트 복사
- **Alchemy**: https://alchemy.com → 앱 생성 → Sepolia 엔드포인트 복사

**MetaMask 프라이빗 키 추출:**
1. MetaMask → 계정 메뉴 (우측 상단 점 3개)
2. "계정 세부 정보" → "프라이빗 키 내보내기"
3. 비밀번호 입력 후 키 복사
4. **이 키는 절대 공유하지 마세요!**

### 3.4 Hardhat 설정 파일 작성

`hardhat.config.ts` (TypeScript) 또는 `hardhat.config.js` (JavaScript)를 다음과 같이 작성합니다.

**TypeScript 버전 (hardhat.config.ts):**

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // 로컬 Hardhat 네트워크 (테스트용)
    hardhat: {
      chainId: 31337,
    },
    // Sepolia 테스트넷
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
    },
  },
};

export default config;
```

**JavaScript 버전 (hardhat.config.js):**

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
    },
  },
};
```

---

## 4. NFT 스마트 계약 작성

### 4.1 ERC-721 표준 이해

**ERC-721은 대체 불가능 토큰(Non-Fungible Token)을 위한 Ethereum 표준**입니다. 각 토큰은 고유한 ID를 가지며, 다음 특징을 가집니다.

- 각 토큰은 고유하며 교환 불가능
- 소유권 추적 가능
- 메타데이터(이미지, 설명 등) 연결 가능
- 안전한 전송 메커니즘 제공

### 4.2 MyNFT 스마트 계약 작성

`contracts` 디렉토리에 `MyNft.sol` 파일을 생성합니다.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyNft
 * @dev 간단한 ERC-721 NFT 구현
 * 
 * 특징:
 * - 배포 시 배포자에게 자동으로 tokenId 1 민팅
 * - 이후 민팅은 오너만 가능 (onlyOwner)
 * - 메타데이터 Base URI 설정 가능
 */
contract MyNft is ERC721, Ownable {
    uint256 private _nextTokenId;
    string private _baseTokenURI;

    /**
     * @dev 생성자 - 이름과 심볼 설정 후 배포자에게 첫 NFT 민팅
     */
    constructor() ERC721("My NFT", "MYNFT") Ownable(msg.sender) {
        _nextTokenId = 2; // 첫 번째 토큰은 1번, 이후부터 2번부터 시작
        _safeMint(msg.sender, 1); // 배포자에게 tokenId 1 민팅
    }

    /**
     * @dev 새로운 NFT를 민팅합니다 (오너만 가능)
     * @param to 토큰을 받을 주소
     */
    function mint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    /**
     * @dev 메타데이터 Base URI 설정 (오너만 가능)
     * @param newBaseURI 새로운 Base URI
     */
    function setBaseURI(string memory newBaseURI) public onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    /**
     * @dev Base URI 반환
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev 특정 토큰의 URI 반환
     * 예: baseURI가 "https://api.example.com/metadata/"이면
     * tokenId 1의 URI는 "https://api.example.com/metadata/1"
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
```

**계약 상세 설명:**

1. **상속 구조:**
   - `ERC721`: OpenZeppelin의 표준 ERC-721 구현
   - `Ownable`: 소유자 전용 함수 제한 기능

2. **생성자 (constructor):**
   - 배포 시 자동으로 배포자에게 tokenId 1을 민팅
   - `_nextTokenId`를 2로 설정하여 이후 민팅은 2번부터 시작

3. **mint 함수:**
   - `onlyOwner` 수정자로 계약 소유자만 호출 가능
   - 새로운 NFT를 지정된 주소로 민팅
   - tokenId는 자동으로 증가

4. **setBaseURI 함수:**
   - 메타데이터의 기본 URI 설정
   - 예: `https://api.example.com/metadata/`로 설정하면
   - tokenId 1의 메타데이터는 `https://api.example.com/metadata/1`

### 4.3 온라인 명함 NFT (DongunCoin) - 고급 예제

더 복잡한 예제로 **명함 NFT**를 만들어봅시다. 이 계약은 각 토큰마다 개별적인 URI를 설정할 수 있습니다.

`contracts/DongunCoin.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DongunCoin
 * @dev 온라인 명함 NFT - 각 토큰마다 개별 메타데이터 URI 설정 가능
 * 
 * 특징:
 * - ERC721URIStorage 사용으로 각 토큰의 URI 독립적 관리
 * - mintCard: 오너가 새 명함 발행
 * - updateCardURI: 토큰 소유자가 명함 정보 업데이트
 */
contract DongunCoin is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    constructor() ERC721("DongunCoin Business Card", "DGC") Ownable(msg.sender) {
        _nextTokenId = 1;
    }

    /**
     * @dev 새로운 명함 NFT 발행 (오너만 가능)
     * @param to 명함을 받을 주소
     * @param cardURI 명함 메타데이터 URI (IPFS 또는 HTTPS)
     */
    function mintCard(address to, string memory cardURI) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, cardURI);
    }

    /**
     * @dev 명함 정보 업데이트 (토큰 소유자 또는 승인된 주소만 가능)
     * @param tokenId 업데이트할 토큰 ID
     * @param newCardURI 새로운 메타데이터 URI
     */
    function updateCardURI(uint256 tokenId, string memory newCardURI) public {
        require(
            ownerOf(tokenId) == msg.sender || getApproved(tokenId) == msg.sender,
            "Not owner or approved"
        );
        _setTokenURI(tokenId, newCardURI);
    }

    /**
     * @dev 다음에 발행될 토큰 ID 조회
     */
    function getNextTokenId() public view returns (uint256) {
        return _nextTokenId;
    }
}
```

**DongunCoin 계약 특징:**
- **개별 URI**: 각 토큰이 고유한 메타데이터 URI를 가짐
- **업데이트 가능**: 소유자가 명함 정보를 업데이트할 수 있음
- **사용 예시**: 개인 명함, 프로필 카드, 자격증 등

### 4.4 스마트 계약 컴파일

작성한 계약을 컴파일하여 문법 오류를 확인합니다.

```bash
npx hardhat compile
```

성공하면 다음과 같은 메시지가 나타납니다:

```
Compiled 2 Solidity files successfully (evm target: paris).
```

컴파일 후 `artifacts/` 디렉토리에 ABI와 바이트코드가 생성됩니다.

---

## 5. 배포 스크립트 작성

### 5.1 MyNFT 배포 스크립트

`scripts` 디렉토리에 `deploy.ts` (TypeScript) 또는 `deploy.js` (JavaScript) 파일을 생성합니다.

**TypeScript 버전 (scripts/deploy.ts):**

```typescript
import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Starting MyNft deployment to Sepolia...\n");

  // 배포자 계정 가져오기
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  // 배포 전 잔액 확인
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

  // MyNft 컨트랙트 팩토리 가져오기
  const MyNft = await ethers.getContractFactory("MyNft");
  
  // 배포
  console.log("⏳ Deploying MyNft contract...");
  const myNft = await MyNft.deploy();
  
  // 배포 완료 대기
  await myNft.waitForDeployment();
  
  const contractAddress = await myNft.getAddress();
  console.log("✅ MyNft deployed to:", contractAddress);

  // tokenId 1의 소유자 확인 (배포자에게 자동 민팅됨)
  const owner = await myNft.ownerOf(1);
  console.log("🎨 TokenId 1 owner:", owner);
  console.log("✨ Initial NFT minted to deployer!\n");

  // 배포 정보 출력
  console.log("📋 Deployment Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Contract Address:", contractAddress);
  console.log("Deployer Address:", deployer.address);
  console.log("Network:", "Sepolia Testnet");
  console.log("Chain ID:", 11155111);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("🔍 Verify on Etherscan:");
  console.log(`https://sepolia.etherscan.io/address/${contractAddress}\n`);

  console.log("📝 Next steps:");
  console.log("1. Verify contract: npx hardhat verify --network sepolia", contractAddress);
  console.log("2. Set base URI: myNft.setBaseURI('your-base-uri')");
  console.log("3. Mint more NFTs: myNft.mint('recipient-address')");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
```

**JavaScript 버전 (scripts/deploy.js):**

```javascript
const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting MyNft deployment to Sepolia...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  const MyNft = await hre.ethers.getContractFactory("MyNft");
  console.log("⏳ Deploying MyNft contract...");
  
  const myNft = await MyNft.deploy();
  await myNft.waitForDeployment();
  
  const contractAddress = await myNft.getAddress();
  console.log("✅ MyNft deployed to:", contractAddress);

  const owner = await myNft.ownerOf(1);
  console.log("🎨 TokenId 1 owner:", owner);
  console.log("✨ Initial NFT minted to deployer!\n");

  console.log("📋 Deployment Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Contract Address:", contractAddress);
  console.log("Deployer Address:", deployer.address);
  console.log("Network:", "Sepolia Testnet");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("🔍 Verify on Etherscan:");
  console.log(`https://sepolia.etherscan.io/address/${contractAddress}\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
```

### 5.2 DongunCoin 배포 스크립트 (명함 NFT)

`scripts/deploy-donguncoin.ts`:

```typescript
import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Starting DongunCoin deployment...\n");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  const DongunCoin = await ethers.getContractFactory("DongunCoin");
  console.log("⏳ Deploying DongunCoin...");
  
  const dongunCoin = await DongunCoin.deploy();
  await dongunCoin.waitForDeployment();
  
  const contractAddress = await dongunCoin.getAddress();
  console.log("✅ DongunCoin deployed to:", contractAddress);

  // 샘플 명함 민팅
  console.log("\n🎴 Minting sample business card...");
  const sampleCardURI = "https://example.com/metadata/sample-card.json";
  const tx = await dongunCoin.mintCard(deployer.address, sampleCardURI);
  await tx.wait();
  
  console.log("✨ Sample card minted to deployer!");
  console.log("🔗 Card URI:", sampleCardURI);

  console.log("\n📋 Deployment Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Contract:", contractAddress);
  console.log("Deployer:", deployer.address);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

---

## 6. Sepolia 테스트넷에 배포

### 6.1 로컬 테스트 (선택사항)

Sepolia에 배포하기 전에 로컬 Hardhat 네트워크에서 먼저 테스트할 수 있습니다.

**터미널 1 - 로컬 노드 실행:**

```bash
npx hardhat node
```

이 명령은 로컬 Ethereum 노드를 실행하고 테스트 계정 20개를 생성합니다.

**터미널 2 - 로컬 배포:**

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

로컬 테스트가 성공하면 Sepolia 배포로 진행합니다.

### 6.2 Sepolia 배포

`.env` 파일에 RPC URL과 프라이빗 키가 올바르게 설정되어 있는지 확인한 후 배포합니다.

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

**배포 프로세스:**
1. 배포자 계정과 잔액 확인
2. 스마트 계약 배포 트랜잭션 전송
3. 블록 확인 대기 (약 15초)
4. 계약 주소 반환
5. 자동으로 tokenId 1 민팅 확인

**성공 출력 예시:**

```
🚀 Starting MyNft deployment to Sepolia...

📝 Deploying contracts with account: 0x1234567890123456789012345678901234567890
💰 Account balance: 0.485 ETH

⏳ Deploying MyNft contract...
✅ MyNft deployed to: 0xabcdefabcdefabcdefabcdefabcdefabcdefabcd
🎨 TokenId 1 owner: 0x1234567890123456789012345678901234567890
✨ Initial NFT minted to deployer!

📋 Deployment Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Contract Address: 0xabcdefabcdefabcdefabcdefabcdefabcdefabcd
Deployer Address: 0x1234567890123456789012345678901234567890
Network: Sepolia Testnet
Chain ID: 11155111
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Verify on Etherscan:
https://sepolia.etherscan.io/address/0xabcdefabcdefabcdefabcdefabcdefabcdefabcd

📝 Next steps:
1. Verify contract: npx hardhat verify --network sepolia 0xabcdefabcdefabcdefabcdefabcdefabcdefabcd
2. Set base URI: myNft.setBaseURI('your-base-uri')
3. Mint more NFTs: myNft.mint('recipient-address')
```

**⚠️ 배포된 계약 주소를 반드시 기록하세요!** 이 주소는 이후 모든 상호작용에서 필요합니다.

### 6.3 Sepolia Etherscan에서 확인

배포가 완료되면 블록 탐색기에서 확인할 수 있습니다.

1. https://sepolia.etherscan.io 방문
2. 검색창에 계약 주소 입력
3. 다음 정보 확인:
   - **Transactions**: 배포 트랜잭션 내역
   - **Contract**: 계약 바이트코드
   - **Events**: Transfer 이벤트 (tokenId 1 민팅 확인)

---

## 7. 계약 검증 (Etherscan Verification)

### 7.1 계약 검증의 중요성

**계약 검증은 소스 코드를 Etherscan에 공개하여 투명성을 확보하는 과정**입니다. 검증 후에는:
- 누구나 소스 코드를 볼 수 있음
- Etherscan에서 직접 함수를 호출할 수 있음
- 신뢰성과 투명성 증가

### 7.2 자동 검증 (Hardhat Verify)

`.env`에 Etherscan API 키가 설정되어 있다면 자동으로 검증할 수 있습니다.

```bash
npx hardhat verify --network sepolia <계약_주소>
```

**예시:**

```bash
npx hardhat verify --network sepolia 0xabcdefabcdefabcdefabcdefabcdefabcdefabcd
```

**성공 출력:**

```
Successfully submitted source code for contract
contracts/MyNft.sol:MyNft at 0xabcdefabcdefabcdefabcdefabcdefabcdefabcd
for verification on the block explorer. Waiting for verification result...

Successfully verified contract MyNft on Etherscan.
https://sepolia.etherscan.io/address/0xabcdefabcdefabcdefabcdefabcdefabcdefabcd#code
```

### 7.3 생성자 인자가 있는 계약 검증

DongunCoin과 같이 생성자 인자가 없는 경우는 위 명령으로 충분합니다. 생성자 인자가 있다면 다음과 같이 추가합니다.

```bash
npx hardhat verify --network sepolia <계약_주소> "Constructor Arg 1" "Constructor Arg 2"
```

### 7.4 수동 검증 (Etherscan UI)

자동 검증이 실패한 경우 수동으로 검증할 수 있습니다.

1. Sepolia Etherscan에서 계약 주소 검색
2. "Contract" 탭 → "Verify and Publish" 클릭
3. 다음 정보 입력:
   - **Compiler Type**: Solidity (Single file)
   - **Compiler Version**: v0.8.20
   - **License**: MIT
4. 소스 코드 붙여넣기 (OpenZeppelin import 포함)
5. "Verify and Publish" 클릭

---

## 8. NFT 민팅 및 상호작용

### 8.1 Hardhat Console을 통한 민팅

배포 후 추가 NFT를 민팅하려면 Hardhat 콘솔을 사용합니다.

```bash
npx hardhat console --network sepolia
```

콘솔 내부에서:

```javascript
// 계약 팩토리 가져오기
const MyNft = await ethers.getContractFactory("MyNft");

// 배포된 계약에 연결 (계약 주소 입력)
const myNft = MyNft.attach("0xabcdefabcdefabcdefabcdefabcdefabcdefabcd");

// NFT 민팅 (받을 주소 입력)
const tx = await myNft.mint("0x수신자주소");
await tx.wait();

// 새로 민팅된 토큰 소유자 확인 (tokenId 2)
const owner = await myNft.ownerOf(2);
console.log("TokenId 2 owner:", owner);
```

### 8.2 민팅 스크립트 작성

반복적인 민팅을 위해 스크립트를 작성할 수 있습니다.

`scripts/mint.ts`:

```typescript
import { ethers } from "hardhat";

async function main() {
  // 배포된 계약 주소 입력
  const CONTRACT_ADDRESS = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd";
  
  // 받을 주소 입력
  const RECIPIENT_ADDRESS = "0x수신자주소";

  console.log("🎨 Minting NFT...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Minting with account:", deployer.address);

  // 계약 연결
  const MyNft = await ethers.getContractFactory("MyNft");
  const myNft = MyNft.attach(CONTRACT_ADDRESS);

  // 민팅
  console.log("⏳ Minting to:", RECIPIENT_ADDRESS);
  const tx = await myNft.mint(RECIPIENT_ADDRESS);
  console.log("Transaction hash:", tx.hash);

  // 트랜잭션 완료 대기
  const receipt = await tx.wait();
  console.log("✅ NFT minted successfully!");
  console.log("Block number:", receipt?.blockNumber);
  console.log("Gas used:", receipt?.gasUsed.toString());

  // Transfer 이벤트에서 tokenId 확인
  const event = receipt?.logs.find((log: any) => {
    try {
      return myNft.interface.parseLog(log)?.name === "Transfer";
    } catch {
      return false;
    }
  });

  if (event) {
    const parsedEvent = myNft.interface.parseLog(event);
    console.log("🆔 Token ID:", parsedEvent?.args.tokenId.toString());
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

**실행:**

```bash
npx hardhat run scripts/mint.ts --network sepolia
```

### 8.3 Base URI 설정

메타데이터 Base URI를 설정하여 tokenURI가 자동으로 생성되도록 합니다.

```javascript
// Hardhat console에서
const myNft = MyNft.attach("계약주소");
const tx = await myNft.setBaseURI("https://api.mynft.com/metadata/");
await tx.wait();

// tokenURI 확인
const uri = await myNft.tokenURI(1);
console.log(uri); // "https://api.mynft.com/metadata/1"
```

### 8.4 Etherscan에서 직접 상호작용

계약이 검증되면 Etherscan에서 직접 함수를 호출할 수 있습니다.

1. Sepolia Etherscan에서 계약 페이지 방문
2. "Contract" 탭 → "Write Contract" 클릭
3. "Connect to Web3" 버튼 클릭 (MetaMask 연결)
4. `mint` 함수 선택
5. `to` 파라미터에 수신자 주소 입력
6. "Write" 버튼 클릭
7. MetaMask에서 트랜잭션 승인

---

## 9. 메타데이터와 IPFS

### 9.1 NFT 메타데이터 표준

NFT 메타데이터는 **JSON 형식**으로 작성되며, OpenSea 등의 마켓플레이스가 인식할 수 있는 표준 구조를 따릅니다.

**기본 메타데이터 구조:**

```json
{
  "name": "My Awesome NFT #1",
  "description": "This is my first NFT deployed on Sepolia testnet",
  "image": "https://ipfs.io/ipfs/QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "external_url": "https://mynft.com",
  "attributes": [
    {
      "trait_type": "Rarity",
      "value": "Common"
    },
    {
      "trait_type": "Color",
      "value": "Blue"
    },
    {
      "trait_type": "Generation",
      "value": 1
    }
  ]
}
```

**필드 설명:**
- `name`: NFT의 이름 (보통 컬렉션명 + 번호)
- `description`: 상세한 설명
- `image`: 이미지 URL (IPFS 권장)
- `external_url`: 외부 링크 (프로젝트 웹사이트 등)
- `attributes`: 특성 배열 (OpenSea에서 필터링 기준으로 사용)

### 9.2 명함 NFT 메타데이터 예시

**DongunCoin (명함 NFT) 메타데이터:**

```json
{
  "name": "홍길동 | Business Card",
  "description": "웹3 개발자 명함",
  "image": "https://pbs.twimg.com/media/FrV6PijakAEExDY.png",
  "external_url": "https://github.com/heodongun",
  "attributes": [
    {
      "trait_type": "Company",
      "value": "ACME Web3"
    },
    {
      "trait_type": "Role",
      "value": "Blockchain Engineer"
    },
    {
      "trait_type": "Email",
      "value": "hello@example.com"
    },
    {
      "trait_type": "Website",
      "value": "https://example.com"
    },
    {
      "trait_type": "Location",
      "value": "Seoul, South Korea"
    }
  ]
}
```

### 9.3 IPFS에 메타데이터 업로드

**IPFS (InterPlanetary File System)는 분산형 파일 저장 시스템**으로, NFT 메타데이터와 이미지를 영구적으로 저장하기에 이상적입니다.

#### Pinata를 사용한 업로드

**Pinata**는 가장 인기 있는 IPFS 호스팅 서비스입니다.

1. **Pinata 가입**: https://pinata.cloud 방문 후 무료 계정 생성
2. **이미지 업로드**:
   - "Upload" → "File" 선택
   - NFT 이미지 파일 업로드
   - CID(Content Identifier) 복사 (예: `QmXXXXXX...`)
3. **메타데이터 JSON 생성**:
   - 위의 메타데이터 구조를 따라 JSON 파일 생성
   - `image` 필드에 `ipfs://QmXXXXXX...` 형식으로 입력
4. **메타데이터 업로드**:
   - JSON 파일을 Pinata에 업로드
   - 메타데이터 CID 복사

**최종 메타데이터 URI:**

```
ipfs://QmYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
```

#### web3.storage 사용

**web3.storage**는 무료로 대용량 저장 공간을 제공합니다.

1. https://web3.storage 방문
2. 계정 생성 및 API 토큰 발급
3. 파일 업로드 (웹 UI 또는 CLI)
4. CID 획득

### 9.4 메타데이터 URI 설정

IPFS에 업로드한 후 계약에 URI를 설정합니다.

**개별 토큰 URI 설정 (DongunCoin):**

```javascript
// Hardhat console
const DongunCoin = await ethers.getContractFactory("DongunCoin");
const dongunCoin = DongunCoin.attach("계약주소");

// 명함 민팅
const cardURI = "ipfs://QmYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY";
const tx = await dongunCoin.mintCard("수신자주소", cardURI);
await tx.wait();
```

**Base URI 설정 (MyNft):**

```javascript
// Base URI 설정
const tx = await myNft.setBaseURI("ipfs://QmBaseFolder/");
await tx.wait();

// tokenId 1의 URI는 "ipfs://QmBaseFolder/1"이 됨
```

---

## 10. 프론트엔드 대시보드 구축

### 10.1 웹 대시보드 개요

사용자가 브라우저에서 NFT와 상호작용할 수 있는 간단한 대시보드를 만들 수 있습니다.

**기능:**
- MetaMask 지갑 연결
- 계약 주소 입력 및 연결
- NFT 민팅 (DongunCoin)
- 명함 정보 업데이트
- 토큰 소유자 조회
- 메타데이터 URI 조회

### 10.2 HTML/JavaScript 대시보드

프로젝트 루트에 `frontend` 디렉토리를 생성하고 `index.html` 파일을 만듭니다.

`frontend/index.html`:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NFT 대시보드 - DongunCoin</title>
    <script src="https://cdn.ethers.io/lib/ethers-5.7.2.umd.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            color: #667eea;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
        }
        .section {
            margin-bottom: 30px;
            padding: 20px;
            background: #f7f7f7;
            border-radius: 10px;
        }
        h2 {
            color: #333;
            margin-bottom: 15px;
            font-size: 18px;
        }
        button {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s;
        }
        button:hover {
            background: #5568d3;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        button:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }
        input, textarea {
            width: 100%;
            padding: 10px;
            margin: 8px 0;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
            font-family: 'Courier New', monospace;
        }
        input:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
        }
        .status {
            padding: 12px;
            margin-top: 15px;
            border-radius: 8px;
            font-size: 14px;
        }
        .status.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .status.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .info-box {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin-top: 10px;
            border-left: 4px solid #667eea;
        }
        .info-box strong {
            color: #667eea;
        }
        label {
            display: block;
            margin-top: 10px;
            font-weight: 600;
            color: #333;
        }
        .network-info {
            background: #fff3cd;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #ffc107;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎴 DongunCoin NFT 대시보드</h1>
        <p class="subtitle">온라인 명함 NFT 발행 및 관리</p>

        <div id="networkInfo" class="network-info" style="display:none;">
            <strong>⚠️ 네트워크 확인:</strong> <span id="networkName"></span>
        </div>

        <!-- 지갑 연결 섹션 -->
        <div class="section">
            <h2>1️⃣ 지갑 연결</h2>
            <button id="connectBtn" onclick="connectWallet()">MetaMask 연결</button>
            <div id="walletStatus"></div>
        </div>

        <!-- 계약 연결 섹션 -->
        <div class="section">
            <h2>2️⃣ 계약 연결</h2>
            <label>DongunCoin 계약 주소:</label>
            <input type="text" id="contractAddress" placeholder="0x...">
            <button onclick="connectContract()" style="margin-top: 10px;">계약 연결</button>
            <div id="contractStatus"></div>
        </div>

        <!-- 명함 민팅 섹션 -->
        <div class="section">
            <h2>3️⃣ 명함 NFT 발행</h2>
            <label>받을 주소:</label>
            <input type="text" id="mintTo" placeholder="0x...">
            <label>메타데이터 URI (IPFS):</label>
            <input type="text" id="cardURI" placeholder="ipfs://QmXXXXXX...">
            <button onclick="mintCard()" style="margin-top: 10px;">명함 발행</button>
            <div id="mintStatus"></div>
        </div>

        <!-- 명함 업데이트 섹션 -->
        <div class="section">
            <h2>4️⃣ 명함 정보 업데이트</h2>
            <label>토큰 ID:</label>
            <input type="number" id="updateTokenId" placeholder="1">
            <label>새 메타데이터 URI:</label>
            <input type="text" id="newCardURI" placeholder="ipfs://QmYYYYYY...">
            <button onclick="updateCard()" style="margin-top: 10px;">정보 업데이트</button>
            <div id="updateStatus"></div>
        </div>

        <!-- 조회 섹션 -->
        <div class="section">
            <h2>5️⃣ NFT 정보 조회</h2>
            <label>토큰 ID:</label>
            <input type="number" id="queryTokenId" placeholder="1">
            <button onclick="queryNFT()" style="margin-top: 10px;">조회하기</button>
            <div id="queryResult"></div>
        </div>
    </div>

    <script>
        let provider;
        let signer;
        let contract;
        let userAddress;

        const DongunCoinABI = [
            "function mintCard(address to, string memory cardURI) public",
            "function updateCardURI(uint256 tokenId, string memory newCardURI) public",
            "function ownerOf(uint256 tokenId) public view returns (address)",
            "function tokenURI(uint256 tokenId) public view returns (string)",
            "function getNextTokenId() public view returns (uint256)",
            "function owner() public view returns (address)"
        ];

        async function connectWallet() {
            if (typeof window.ethereum === 'undefined') {
                showStatus('walletStatus', 'MetaMask가 설치되어 있지 않습니다!', 'error');
                return;
            }

            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                provider = new ethers.providers.Web3Provider(window.ethereum);
                signer = provider.getSigner();
                userAddress = accounts[0];

                const network = await provider.getNetwork();
                const networkName = network.chainId === 31337 ? 'Hardhat (로컬)' :
                                   network.chainId === 11155111 ? 'Sepolia Testnet' :
                                   `알 수 없음 (${network.chainId})`;

                document.getElementById('networkInfo').style.display = 'block';
                document.getElementById('networkName').textContent = networkName;

                showStatus('walletStatus', `✅ 연결됨: ${userAddress.slice(0,6)}...${userAddress.slice(-4)}`, 'success');

                // 네트워크 변경 감지
                window.ethereum.on('chainChanged', () => window.location.reload());
            } catch (error) {
                showStatus('walletStatus', `오류: ${error.message}`, 'error');
            }
        }

        async function connectContract() {
            const address = document.getElementById('contractAddress').value;
            if (!address || !signer) {
                showStatus('contractStatus', '먼저 지갑을 연결하고 계약 주소를 입력하세요.', 'error');
                return;
            }

            try {
                contract = new ethers.Contract(address, DongunCoinABI, signer);
                const owner = await contract.owner();
                const nextId = await contract.getNextTokenId();

                showStatus('contractStatus', 
                    `✅ 계약 연결 성공!<br>
                    오너: ${owner.slice(0,6)}...${owner.slice(-4)}<br>
                    다음 토큰 ID: ${nextId.toString()}`, 
                    'success'
                );
            } catch (error) {
                showStatus('contractStatus', `오류: ${error.message}`, 'error');
            }
        }

        async function mintCard() {
            const to = document.getElementById('mintTo').value;
            const uri = document.getElementById('cardURI').value;

            if (!contract || !to || !uri) {
                showStatus('mintStatus', '모든 필드를 입력하세요.', 'error');
                return;
            }

            try {
                showStatus('mintStatus', '⏳ 트랜잭션 처리 중...', 'success');
                const tx = await contract.mintCard(to, uri);
                showStatus('mintStatus', `⏳ 블록 확인 대기 중...<br>TX: ${tx.hash}`, 'success');
                
                const receipt = await tx.wait();
                showStatus('mintStatus', 
                    `✅ 명함 발행 완료!<br>
                    블록: ${receipt.blockNumber}<br>
                    가스 사용: ${receipt.gasUsed.toString()}`, 
                    'success'
                );
            } catch (error) {
                showStatus('mintStatus', `❌ 오류: ${error.message}`, 'error');
            }
        }

        async function updateCard() {
            const tokenId = document.getElementById('updateTokenId').value;
            const newURI = document.getElementById('newCardURI').value;

            if (!contract || !tokenId || !newURI) {
                showStatus('updateStatus', '모든 필드를 입력하세요.', 'error');
                return;
            }

            try {
                showStatus('updateStatus', '⏳ 업데이트 중...', 'success');
                const tx = await contract.updateCardURI(tokenId, newURI);
                const receipt = await tx.wait();
                
                showStatus('updateStatus', 
                    `✅ 업데이트 완료!<br>블록: ${receipt.blockNumber}`, 
                    'success'
                );
            } catch (error) {
                showStatus('updateStatus', `❌ 오류: ${error.message}`, 'error');
            }
        }

        async function queryNFT() {
            const tokenId = document.getElementById('queryTokenId').value;

            if (!contract || !tokenId) {
                showStatus('queryResult', '토큰 ID를 입력하세요.', 'error');
                return;
            }

            try {
                const owner = await contract.ownerOf(tokenId);
                const uri = await contract.tokenURI(tokenId);

                showStatus('queryResult', 
                    `<div class="info-box">
                        <strong>토큰 ID:</strong> ${tokenId}<br>
                        <strong>소유자:</strong> ${owner}<br>
                        <strong>메타데이터 URI:</strong> <a href="${uri.replace('ipfs://', 'https://ipfs.io/ipfs/')}" target="_blank">${uri}</a>
                    </div>`, 
                    'success'
                );
            } catch (error) {
                showStatus('queryResult', `❌ 오류: ${error.message}`, 'error');
            }
        }

        function showStatus(elementId, message, type) {
            const element = document.getElementById(elementId);
            element.innerHTML = `<div class="status ${type}">${message}</div>`;
        }
    </script>
</body>
</html>
```

### 10.3 대시보드 실행

**로컬 서버로 실행 (권장):**

```bash
# http-server 설치 (없는 경우)
npm install -g http-server

# 프론트엔드 서버 실행
http-server frontend -p 5173
```

브라우저에서 `http://localhost:5173` 접속

**또는 파일 직접 열기:**

```bash
# macOS/Linux
open frontend/index.html

# Windows
start frontend/index.html
```

### 10.4 대시보드 사용 방법

1. **MetaMask 네트워크 전환**:
   - 로컬 테스트: Hardhat (Chain ID: 31337)
   - 테스트넷: Sepolia (Chain ID: 11155111)

2. **지갑 연결**: "MetaMask 연결" 버튼 클릭

3. **계약 연결**: 배포한 DongunCoin 주소 입력

4. **명함 발행**: 받을 주소와 메타데이터 URI 입력

5. **정보 조회**: 토큰 ID로 소유자와 메타데이터 확인

---

## 11. 문제 해결 및 팁

### 11.1 일반적인 오류와 해결책

#### 오류 1: "Cannot find module 'dotenv'"

**원인**: dotenv 패키지가 설치되지 않음

**해결책**:
```bash
npm install dotenv
```

#### 오류 2: "insufficient funds for gas * price + value"

**원인**: 지갑에 Sepolia ETH가 부족함

**해결책**:
- Faucet에서 추가 테스트 ETH 받기
- 최소 0.1 Sepolia ETH 보유 권장

#### 오류 3: "Error: could not detect network"

**원인**: RPC URL이 잘못되었거나 네트워크 연결 문제

**해결책**:
- `.env`의 `SEPOLIA_RPC_URL` 확인
- Infura/Alchemy 대시보드에서 RPC URL 재확인
- 다른 RPC 제공자 시도

#### 오류 4: "nonce has already been used"

**원인**: 동일한 nonce로 여러 트랜잭션 전송 시도

**해결책**:
```bash
# Hardhat 캐시 삭제
npx hardhat clean

# 또는 MetaMask에서 계정 재설정
# MetaMask → 설정 → 고급 → 계정 재설정
```

#### 오류 5: Node 25 경고

**경고 메시지**: `(node:12345) [DEP0040] DeprecationWarning`

**해결책**:
- Node 20 LTS로 다운그레이드 (권장)
- 또는 경고 무시 (대부분 기능에 영향 없음)

```bash
# nvm으로 Node 버전 전환
nvm install 20
nvm use 20
```

### 11.2 MetaMask에서 NFT 확인

MetaMask는 NFT를 자동으로 표시하지 않습니다. 수동으로 추가해야 합니다.

**추가 방법:**
1. MetaMask 모바일 앱 사용 (NFT 탭 지원)
2. 또는 OpenSea에서 확인:
   - https://testnets.opensea.io
   - 지갑 주소로 검색
   - 메타데이터가 IPFS에 올바르게 업로드되어 있어야 표시됨

### 11.3 가스 최적화 팁

**1. Optimizer 활성화**

`hardhat.config.ts`에서:

```typescript
solidity: {
  version: "0.8.20",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200, // 낮을수록 배포 가스 절약, 높을수록 실행 가스 절약
    },
  },
},
```

**2. 불필요한 storage 읽기 줄이기**

로컬 변수를 사용하여 storage 읽기 최소화:

```solidity
// ❌ 비효율적
for (uint i = 0; i < array.length; i++) {
    // array.length를 반복마다 읽음
}

// ✅ 효율적
uint len = array.length;
for (uint i = 0; i < len; i++) {
    // 한 번만 읽음
}
```

**3. 배치 민팅**

여러 NFT를 한 번에 민팅하는 함수 추가:

```solidity
function batchMint(address[] memory recipients) public onlyOwner {
    for (uint i = 0; i < recipients.length; i++) {
        mint(recipients[i]);
    }
}
```

### 11.4 보안 권장사항

**1. 프라이빗 키 관리**
- `.env` 파일을 `.gitignore`에 추가
- GitHub, GitLab 등 공개 저장소에 절대 업로드하지 않기
- 메인넷 배포 시 하드웨어 지갑 사용 고려

**2. 스마트 계약 감사**
- 메인넷 배포 전 전문가 감사 받기
- OpenZeppelin의 검증된 계약 사용
- Slither, Mythril 등 자동화 도구로 취약점 점검

**3. Access Control**
- 중요한 함수에 `onlyOwner` 수정자 사용
- Role-based access control (RBAC) 고려
- 멀티시그 지갑으로 소유권 관리

### 11.5 유용한 명령어 모음

```bash
# 컴파일
npx hardhat compile

# 로컬 노드 실행
npx hardhat node

# 로컬 배포
npx hardhat run scripts/deploy.ts --network localhost

# Sepolia 배포
npx hardhat run scripts/deploy.ts --network sepolia

# 계약 검증
npx hardhat verify --network sepolia <주소>

# 콘솔 실행
npx hardhat console --network sepolia

# 캐시 삭제
npx hardhat clean

# 테스트 실행
npx hardhat test
```

### 11.6 추가 리소스

**공식 문서:**
- Hardhat: https://hardhat.org/docs
- OpenZeppelin: https://docs.openzeppelin.com
- Ethers.js: https://docs.ethers.org

**커뮤니티:**
- Ethereum Stack Exchange: https://ethereum.stackexchange.com
- Hardhat Discord: https://hardhat.org/discord
- OpenZeppelin Forum: https://forum.openzeppelin.com

**블록 탐색기:**
- Sepolia Etherscan: https://sepolia.etherscan.io
- Sepolia Blockscout: https://eth-sepolia.blockscout.com

---

## 결론

이 가이드에서는 **Sepolia 테스트넷에서 NFT를 처음부터 끝까지 배포하는 전체 과정**을 다루었습니다. 실제 작동하는 프로젝트([heodongun/ethereumERC721](https://github.com/heodongun/ethereumERC721))를 기반으로 하므로, 코드를 그대로 활용하여 빠르게 시작할 수 있습니다.

### 핵심 정리

1. **개발 환경 구축**: Node.js 20, Hardhat, OpenZeppelin 설치
2. **MetaMask 설정**: Sepolia 네트워크 추가 및 테스트 ETH 획득
3. **스마트 계약 작성**: ERC-721 표준 기반 NFT 계약 구현
4. **배포 및 검증**: Sepolia에 배포 후 Etherscan에서 검증
5. **민팅 및 상호작용**: Hardhat 콘솔, 스크립트, 웹 대시보드로 NFT 관리
6. **메타데이터**: IPFS로 영구 저장 및 표준 JSON 형식 사용

### 다음 단계

**초보자:**
- 더 많은 NFT 민팅 연습
- 메타데이터 구조 실험
- 다양한 속성(attributes) 추가

**중급자:**
- ERC-721 확장 (Enumerable, Pausable 등)
- 판매 기능 추가 (가격 설정, 구매)
- Royalty 표준 (EIP-2981) 구현

**고급자:**
- 메인넷 배포 준비 (감사, 가스 최적화)
- 고급 토큰경제학 설계
- Cross-chain NFT 브릿지 구현

### 마무리

Sepolia 테스트넷은 **실제 자금 없이 안전하게 실험할 수 있는 완벽한 환경**입니다. 이 가이드를 따라 NFT 배포에 성공했다면, 이제 블록체인 개발의 기초를 다진 것입니다. 

더 많은 실험과 학습을 통해 자신만의 독특한 NFT 프로젝트를 만들어보세요!

---

**참고 링크:**
- 프로젝트 저장소: https://github.com/heodongun/ethereumERC721
- Sepolia Faucet: https://sepoliafaucet.com
- OpenZeppelin Contracts: https://github.com/OpenZeppelin/openzeppelin-contracts
- Hardhat 공식 문서: https://hardhat.org

**작성자**: heodongun  
**최종 수정**: 2025년 11월
