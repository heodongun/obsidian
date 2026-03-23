---
title: "이더리움의 Solidity를 알아보자"
description: "Solidity는 이더리움 블록체인에서 스마트 계약을 작성하기 위해 특별히 설계된 프로그래밍 언어입니다. 2014년 이더리움 팀에 의해 개발된 이 언어는 JavaScript, Python, C++의 문법적 영향을 받았으며, 정적 타입 지정과 객체 지향 프로그래밍을 지원"
source: "https://velog.io/@pobi/%EC%9D%B4%EB%8D%94%EB%A6%AC%EC%9B%80%EC%9D%98-Solidity%EB%A5%BC-%EC%95%8C%EC%95%84%EB%B3%B4%EC%9E%90"
source_slug: "이더리움의-Solidity를-알아보자"
author: "pobi"
author_display_name: "포비"
released_at: "2025-11-24T10:50:00.279Z"
updated_at: "2026-03-22T05:29:31.608Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/4c3dac0e-dd2b-4544-ac59-08995c7b3237/image.png"
tags: []
---# 이더리움의 Solidity를 알아보자

**Solidity**는 이더리움 블록체인에서 스마트 계약을 작성하기 위해 특별히 설계된 프로그래밍 언어입니다. 2014년 이더리움 팀에 의해 개발된 이 언어는 JavaScript, Python, C++의 문법적 영향을 받았으며, 정적 타입 지정과 객체 지향 프로그래밍을 지원하는 강력한 도구입니다. 본 글에서는 Solidity의 기본 개념부터 고급 기능까지 상세히 살펴보겠습니다.

## Solidity란 무엇인가

### Solidity의 탄생 배경과 목적

**Solidity**는 이더리움 가상 머신(EVM: Ethereum Virtual Machine) 위에서 실행되도록 특별히 설계된 컴퓨터 언어입니다. 기존의 일반적인 프로그래밍 언어들과 달리, Solidity는 스마트 계약의 독특한 요구사항을 충족시키기 위해 개발되었습니다. 특히 보안성과 검증 가능성이 중요한 역할을 합니다. 개발자들이 쉽게 학습할 수 있도록 JavaScript, Python, C++와 같은 기존 프로그래밍 언어에서 영감을 받았지만, 동시에 블록체인의 특수한 요구사항에 맞게 엄격하게 적응되어 있습니다.

### Solidity의 핵심 특징

Solidity는 객체 지향적이고, 정적으로 타입이 지정되며, 계약 지향적 프로그래밍 모델을 따르는 고급 언어입니다. 이 언어는 값 타입과 참조 타입 데이터를 모두 지원하며, 가시성 지정자(visibility specifiers)를 가진 함수들을 제공합니다. Solidity가 가진 주요 특징은 다음과 같습니다:

- **정적 타입 지정**: 모든 데이터 타입이 사전에 정의되어야 하며, 이는 계약의 안정성과 보안을 증진시킵니다.
- **상속 및 다중 상속 지원**: 복잡한 프로젝트의 구조화와 코드 재사용을 용이하게 합니다.
- **이벤트 메커니즘**: 블록체인에 저장되는 이벤트를 통해 계약과의 상호작용을 추적할 수 있습니다.
- **인터페이스 및 라이브러리 지원**: 코드의 모듈화와 유지보수성을 향상시킵니다.
- **예외 처리**: require, assert 등의 키워드를 사용하여 에러 처리를 정의할 수 있습니다.

## Solidity의 기본 구조

### 스마트 계약의 구성 요소

Solidity 스마트 계약의 기본 구조는 크게 세 가지 요소로 구성됩니다. 첫째는 **함수(Functions)**로, 계약의 동작을 정의합니다. 둘째는 **상태 변수(State Variables)**로, 계약에 필요한 필수 데이터를 저장합니다. 예를 들어, 사용자의 잔액 정보가 여기에 해당합니다. 셋째는 **수정자(Modifiers)**로, 특정 함수의 실행 조건을 제어하는 데 사용됩니다. 예를 들어, 특정 주소로부터의 접근만을 제한할 수 있습니다.

### 첫 번째 Solidity 계약 작성

가장 기본적인 Solidity 계약을 살펴보겠습니다. 아래는 데이터를 저장하고 검색할 수 있는 간단한 Storage 계약입니다:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract Storage {
    uint data;
    
    function set(uint x) public {
        data = x;
    }
    
    function get() public view returns (uint) {
        return data;
    }
}
```

이 계약을 분석하면:

- `// SPDX-License-Identifier: MIT`: 라이선스 정보를 명시합니다
- `pragma solidity >=0.8.2 <0.9.0;`: 이 계약이 사용하는 Solidity 버전의 범위를 지정합니다
- `contract Storage`: 스마트 계약을 정의합니다
- `uint data;`: 부호 없는 정수를 저장하는 상태 변수입니다
- `set` 함수: 데이터를 수정하는 함수입니다
- `get` 함수: `view` 수정자를 사용하여 데이터만 조회하고 상태를 변경하지 않습니다

## 데이터 타입과 변수

### 기본 데이터 타입

Solidity는 블록체인의 필요에 맞춰 최적화된 다양한 데이터 타입을 지원합니다. 가장 일반적으로 사용되는 기본 타입들은 다음과 같습니다:

**정수(Integers)**는 부호 있는 정수(int)와 부호 없는 정수(uint)로 나뉩니다. uint는 uint256의 축약형이며, 0부터 2^256-1까지의 값을 저장할 수 있습니다. `int8`부터 `int256`까지 8비트 단위로 다양한 크기를 지정할 수 있습니다.

**불린(Boolean)**은 true 또는 false의 두 가지 값만을 가질 수 있는 논리 타입입니다.

**주소(Address)**는 이더리움 네트워크의 계정과 계약을 식별하는 20바이트 값입니다. `address` 타입의 변수는 이더리움 주소를 저장하며, `address payable`은 이더를 받을 수 있는 주소를 나타냅니다.

**바이트(Bytes)**는 고정 크기의 바이트 배열을 표현합니다. `bytes1`부터 `bytes32`까지 1바이트에서 32바이트까지의 다양한 크기를 지정할 수 있습니다.

**문자열(String)**은 동적 크기의 UTF-8 인코딩 텍스트를 저장합니다. 하지만 Solidity에서 문자열의 비교나 연결 작업은 비용이 많이 들기 때문에 주의해서 사용해야 합니다.

### 복합 데이터 타입

Solidity는 더 복잡한 데이터 구조를 만들 수 있는 참조 타입들을 제공합니다.

**배열(Arrays)**은 같은 데이터 타입의 여러 변수를 하나로 묶은 자료구조입니다. 고정 크기 배열은 선언할 때 크기가 정해지며, 동적 배열은 런타임에 크기가 변할 수 있습니다. 고정 크기 배열의 예는 `uint[6] arrayName;`이고, 동적 배열의 예는 `uint[] dynamicArray;`입니다.

**구조체(Structs)**는 여러 다른 데이터 타입을 하나로 묶어 새로운 사용자 정의 데이터 타입을 만드는 방법입니다. 예를 들어:

```solidity
struct User {
    string name;
    uint age;
    address walletAddress;
    bool isActive;
}
```

구조체를 사용하면 코드의 복잡성을 줄이고, "Stack too deep" 오류를 피할 수 있습니다.

**매핑(Mapping)**은 키-값 쌍으로 데이터를 저장하는 해시 테이블 같은 자료구조입니다. 다른 언어의 딕셔너리나 맵과 유사합니다. `mapping(uint => address)` 형태로 선언하며, 배열보다 효율적이고 정확한 데이터 관리를 가능하게 합니다.

**열거형(Enums)**은 사용자가 정의한 사용자 정의 데이터 타입으로, 특정한 상수 값들만을 가질 수 있습니다. 예를 들어, 주문 상태를 나타내는 열거형은 다음과 같습니다:

```solidity
enum OrderStatus {
    Pending,
    Processing,
    Shipped,
    Delivered,
    Cancelled
}
```

열거형은 코드를 더 읽기 쉽게 만들고, 버그를 줄이는 데 도움이 됩니다.

## 함수와 가시성 수정자

### 함수의 기본 구조

Solidity에서 함수는 특정 작업을 수행하는 코드 조각입니다. 함수는 다른 계약이나 외부 애플리케이션으로부터 호출될 수 있습니다. 함수의 기본 선언 형식은 다음과 같습니다:

```solidity
function myFunction(uint _param) public returns(uint) {
    // 함수 본문
    return _param * 2;
}
```

함수 선언에는 여러 중요한 요소가 포함됩니다: `function` 키워드로 함수를 선언하며, 함수 이름을 지정합니다. 괄호 안에 입력 매개변수를 정의하고, 가시성 키워드(public, private 등)를 명시합니다. 마지막으로 `returns` 키워드로 반환 타입을 지정합니다.

### 가시성 수정자의 이해

Solidity는 함수와 변수의 접근 범위를 제어하기 위해 네 가지 가시성 수정자를 제공합니다. 이는 계약의 보안을 강화하는 데 중요한 역할을 합니다.

**Public 수정자**는 계약 내부와 외부에서 모두 접근 가능합니다. 외부 트랜잭션과 파생된 계약에서도 호출할 수 있습니다. 상태 변수에 public을 붙이면 컴파일러가 자동으로 해당 변수를 반환하는 getter 함수를 생성합니다.

**Private 수정자**는 오직 같은 계약 내에서만 호출할 수 있습니다. 파생 계약이나 외부 엔티티에서는 접근할 수 없습니다. 다른 계약이나 외부에서 호출할 수 없으므로, 함수의 이름 앞에 언더스코어(_)를 붙이는 것이 관례입니다.

**Internal 수정자**는 private과 유사하지만, 상속한 자식 계약에서도 호출할 수 있습니다. 따라서 계약의 상속 구조에서 자식 계약들이 부모의 기능을 활용해야 할 때 유용합니다.

**External 수정자**는 함수에만 붙일 수 있습니다. public과 유사하지만, 외부에서만 호출 가능하며 자식 계약에서는 호출할 수 없습니다. 상태 변수에는 external을 붙일 수 없습니다.

### 함수의 두 가지 주요 타입

Solidity의 함수는 상태를 변경하는 방식에 따라 두 가지 주요 타입으로 나뉩니다.

**상태 변경 함수(State-Changing Functions)**는 계약의 상태를 수정하는 함수입니다. 예를 들어, 데이터를 저장하거나 토큰을 전송하는 함수가 이에 해당합니다. 이러한 함수는 블록체인에 트랜잭션을 기록하므로 가스 비용이 발생합니다.

**View 함수**는 계약의 상태를 읽기만 하고 수정하지 않는 함수입니다. `view` 수정자를 사용하여 선언하며, 이 함수들은 가스 비용을 소비하지 않습니다. 데이터를 조회하는 함수들이 이 카테고리에 속합니다.

### 함수 입출력

Solidity 함수의 입력은 일반 변수와 동일한 방식으로 선언됩니다. 여러 개의 입력을 원하는 만큼 추가할 수 있으며, 쉼표로 구분합니다.

```solidity
function transfer(address recipient, uint amount) public {
    // 전송 로직
}
```

복잡한 입력 타입(예: 배열, 문자열)은 데이터 위치를 명시해야 합니다. `memory` 또는 `storage`를 사용하여 변수가 메모리에 저장되는지 영속적 저장소에 저장되는지를 지정합니다.

## 고급 함수 기능

### Fallback과 Receive 함수

**receive()** 함수는 계약이 데이터 없이 순수한 이더를 받을 때 실행되는 특별한 함수입니다. 반드시 `external`과 `payable`로 표시되어야 하며, 간단한 이더 전송을 처리하기 때문에 fallback()보다 가스 효율이 높습니다.

```solidity
receive() external payable {
    emit Received(msg.sender, msg.value);
}
```

**fallback()** 함수는 보다 광범위한 캐치-올(catch-all) 함수입니다. 다음과 같은 상황에서 트리거됩니다:

- 계약에 존재하지 않는 함수가 호출될 때
- 데이터가 포함된 이더가 전송되고 receive() 함수가 없을 때

```solidity
fallback() external payable {
    emit FallbackCalled(msg.sender, msg.value, msg.data);
}
```

receive()와 fallback()의 결정 흐름은 다음과 같습니다:

1. 이더가 데이터와 함께 전송되었는가? → 예: fallback() 실행
2. 데이터 없이 순수 이더만 전송되었는가? → 예: receive() 실행 (존재하면), 없으면 fallback() 실행
3. 둘 다 없으면? → 트랜잭션 거부 및 이더 반환

### 이벤트와 로깅

이벤트는 스마트 계약에서 발생한 중요한 사건을 블록체인에 기록하는 메커니즘입니다. 이를 통해 계약과의 상호작용을 추적하고 쿼리할 수 있습니다.

```solidity
event Transfer(address indexed from, address indexed to, uint256 value);

function sendTokens(address recipient, uint256 amount) public {
    // 전송 로직
    emit Transfer(msg.sender, recipient, amount);
}
```

이벤트를 사용할 때는 indexed 키워드를 주의깊게 사용해야 합니다. Indexed 파라미터는 인덱싱되어 빠르게 검색할 수 있지만, 최대 3개까지만 지정할 수 있습니다.

## 상속과 인터페이스

### 계약 상속

Solidity는 객체 지향 프로그래밍의 상속 개념을 지원합니다. 부모 계약의 기능을 자식 계약에서 상속받아 코드 재사용성을 높일 수 있습니다.

```solidity
contract Base {
    function getValue() public pure returns (uint) {
        return 10;
    }
}

contract Derived is Base {
    function doubleValue() public pure returns (uint) {
        return getValue() * 2;
    }
}
```

### 인터페이스의 역할

Solidity 인터페이스는 계약이 구현해야 하는 함수들의 시그니처를 정의합니다. 인터페이스 특징은 다음과 같습니다:

- 다른 인터페이스를 상속할 수 있습니다.
- 계약은 다른 계약을 상속하듯이 인터페이스를 상속할 수 있습니다.
- 인터페이스의 함수를 구현하는 모든 함수는 `override` 수정자를 설정해야 합니다. 그렇지 않으면 Solidity 컴파일러가 오류를 발생시킵니다.

```solidity
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract Token is IERC20 {
    mapping(address => uint256) balances;
    
    function transfer(address to, uint256 amount) external override returns (bool) {
        // 전송 구현
        return true;
    }
    
    function balanceOf(address account) external view override returns (uint256) {
        return balances[account];
    }
}
```

## 보안과 최적화

### 일반적인 보안 취약점

**재진입(Reentrancy) 공격**은 Solidity의 가장 유명한 보안 취약점 중 하나입니다. 악의적인 계약이 같은 함수를 반복적으로 호출하여 계약의 상태를 악용할 수 있습니다. 이를 방지하려면 checks-effects-interactions 패턴을 따르거나 재진입 방지 수정자를 사용해야 합니다.

**정수 오버플로우/언더플로우**는 변수가 최대값을 초과하거나 최소값 이하가 될 때 발생합니다. Solidity 0.8.0 이상에서는 기본적으로 이 문제가 해결되었지만, 여전히 주의가 필요합니다.

**서비스 거부(DoS) 공격**은 계약의 기능을 마비시키려는 시도입니다. 무한 루프나 과도한 가스 소비를 초래하는 코드를 악용합니다. 이를 방지하려면:

- 함수에 가스 제한을 구현합니다
- 루프에서의 가스 소비를 최소화합니다
- 가능하면 루프를 피하는 설계를 고려합니다

**검증되지 않은 외부 호출**은 신뢰할 수 없는 외부 계약의 함수를 호출할 때 발생할 수 있습니다. 외부 계약 호출의 반환값을 항상 확인하고, 신뢰할 수 있는 계약인지 검증해야 합니다.

### 가시성 수정자를 통한 보안 강화

함수의 가시성을 적절하게 설정하는 것은 계약 보안의 기본입니다. 헬퍼 함수와 같이 계약 내부에서만 사용되어야 하는 함수들을 private으로 표시하면, 악의적인 사용자가 main 함수의 require 검사를 우회하여 이 함수를 직접 호출하는 공격을 방지할 수 있습니다.

필요한 변수와 함수를 식별한 후, 제한이 필요한 것들을 private(같은 계약 내에서만 호출 가능)이나 internal(파생 계약에서도 호출 가능)로 변경하는 것이 좋습니다. private 함수는 함수 이름 앞에 언더스코어를 붙이는 것이 관례입니다: `function _helperFunction() private { /*…*/ }`

## 배포와 테스트

### 개발 환경 설정

Solidity 계약을 배포하기 전에 적절한 개발 환경을 설정해야 합니다. Hardhat은 가장 인기 있는 선택지 중 하나입니다:

```bash
npx hardhat
npx hardhat compile
```

### 로컬에서 테스트

배포 전에 로컬 환경에서 충분한 테스트를 수행해야 합니다:

```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

로컬 Hardhat 노드에서 계약을 배포하고 철저하게 테스트한 후, 공개 네트워크로 이동하는 것이 좋습니다.

### 테스트넷 배포

로컬 배포가 작동함을 확인한 후, Goerli, Sepolia 또는 Mumbai(Polygon용)와 같은 테스트넷에 배포합니다. 테스트넷은 프로덕션 환경을 모방하지만 실제 자산이 아닌 테스트 토큰을 사용합니다.

먼저 `hardhat.config.js` 파일을 수정하여 네트워크 구성을 추가합니다. 테스트 토큰은 Moralis testnet faucet과 같은 서비스에서 무료로 얻을 수 있습니다.

### 계약 검증

배포 후 블록 익스플로러(Etherscan 등)에서 계약을 검증하면 투명성이 증가합니다:

```bash
npx hardhat verify --network goerli YOUR_CONTRACT_ADDRESS
```

검증된 계약은 다른 개발자들이 소스 코드를 볼 수 있게 되며, 이는 신뢰성을 높입니다.

## 실전 예제: 간단한 토큰 계약

지금까지 배운 개념들을 종합하여 간단한 ERC20 호환 토큰 계약을 작성해봅시다:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleToken {
    string public name = "Simple Token";
    string public symbol = "STK";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor(uint256 initialSupply) {
        totalSupply = initialSupply * 10 ** uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
    }
    
    function transfer(address to, uint256 value) public returns (bool) {
        require(to != address(0), "Invalid address");
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        
        emit Transfer(msg.sender, to, value);
        return true;
    }
    
    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(to != address(0), "Invalid address");
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Allowance exceeded");
        
        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        
        emit Transfer(from, to, value);
        return true;
    }
}
```

이 계약은 기본적인 토큰 기능을 제공하며, 다음을 포함합니다:

- **상태 변수**: 토큰의 이름, 심볼, 총 공급량을 저장합니다
- **매핑**: 사용자의 잔액과 허용량을 추적합니다
- **이벤트**: 토큰 전송과 승인을 기록합니다
- **함수**: 토큰 전송, 승인, 위임 전송 기능을 제공합니다

## Solidity 개발을 위한 도구와 리소스

### 주요 개발 도구

**Remix**는 웹 기반의 IDE로, Solidity를 배우기 시작하는 개발자들에게 이상적입니다. 복잡한 설정 없이 브라우저에서 계약을 작성하고 컴파일, 배포할 수 있습니다.

**Hardhat**은 전문적인 Solidity 개발을 위한 강력한 프레임워크입니다. 로컬 테스트넷, 컴파일, 배포, 검증 등 모든 기능을 제공합니다.

**MetaMask**는 이더리움과 상호작용하기 위한 브라우저 지갑입니다. 계약 배포와 상호작용을 위해 필수적입니다.

### 학습 리소스

공식 Solidity 문서는 언어의 모든 기능에 대한 포괄적인 정보를 제공합니다. OpenZeppelin의 계약 라이브러리는 검증된 보안 계약 템플릿을 제공하여 개발 시간을 단축할 수 있습니다.

## 결론

Solidity는 이더리움 블록체인에서 스마트 계약을 개발하기 위한 강력하고 안전한 언어입니다. 기본 데이터 타입과 함수부터 고급 기능인 상속, 인터페이스, 이벤트에 이르기까지 다양한 기능을 제공합니다. 보안은 Solidity 개발에서 가장 중요한 측면이므로, 일반적인 취약점을 이해하고 가시성 수정자와 같은 보안 도구를 적절하게 사용해야 합니다.

본 글에서 다룬 내용들을 바탕으로 Remix나 Hardhat 같은 도구를 사용하여 직접 Solidity 계약을 작성해보길 권장합니다. 처음에는 간단한 계약부터 시작하여 점진적으로 복잡한 기능을 추가해나가면서 언어의 특성을 이해하고 숙달할 수 있습니다. 이더리움 생태계에서 점점 더 중요해지는 스마트 계약 개발자로 성장하는 데 있어 Solidity의 마스터가 되는 것은 필수적인 과정입니다.
