# NullClaw, 작은 런타임으로 다시 짜는 AI 에이전트 인프라

최근 AI agent 런타임을 보면 기능은 풍부하지만, 그만큼 무겁고 복잡해진 경우가 많다. NullClaw는 이 흐름과 꽤 반대편에 서 있다. 공식 README는 이 프로젝트를 Zig로 작성된 “fully autonomous AI assistant infrastructure”라고 소개하고, 678 KB 바이너리, 약 1 MB RAM, 2 ms 미만 부팅, 50개 이상 provider, 19개 channel, 35개 이상 tool, 10개 memory engine을 전면에 내세운다. 공식 사이트도 이를 단일 바이너리 기반의 autonomous agent runtime으로 설명한다.

이 리포지토리는 단순한 “터미널 챗봇” 저장소가 아니다. 저장소 루트에는 `docs`, `examples`, `src`, `spec`, `vendor/sqlite3`가 있고, `src/` 아래에는 `agent`, `channels`, `memory`, `providers`, `security`, `tools` 같은 디렉터리가 분리돼 있다. 즉 모델 호출 하나만 감싼 래퍼가 아니라, 모델·채널·도구·메모리·보안·게이트웨이를 한 런타임으로 묶으려는 구조다.

2026년 3월 18일 기준으로 저장소는 약 6.5k stars, 772 forks, 1,689 commits를 기록하고 있고, 최신 릴리스는 `v2026.3.17`이다. 해당 릴리스에는 runtime observability와 OTLP 지원, hardened external channel plugins, per-agent workspace isolation, email channel, secret key rotation, persisted API key encryption 같은 변화가 포함돼 있다. 이 숫자와 릴리스 노트를 보면, NullClaw는 “작은 데모”라기보다 꽤 활발하게 확장 중인 런타임 프로젝트에 가깝다.

## 왜 이 프로젝트가 흥미로운가

NullClaw가 눈에 띄는 이유는 “작다”는 말이 단순 마케팅 문구에 그치지 않기 때문이다. README의 benchmark snapshot은 macOS arm64 환경에서 측정한 로컬 수치를 바탕으로, NullClaw가 자체적으로 매우 작은 바이너리와 메모리 사용량, 빠른 시작 시간을 목표로 삼고 있음을 보여준다. 중요한 점은 이 수치가 제3자 독립 벤치마크가 아니라 프로젝트가 공개한 benchmark snapshot이라는 점이고, 그래서 읽을 때도 “프로젝트가 어떤 방향으로 최적화하고 있는가”를 보여주는 자료로 받아들이는 편이 정확하다.

또 하나 흥미로운 점은, 가벼움을 추구하면서도 기능 폭을 줄이지 않았다는 점이다. 공식 사이트는 provider abstraction, tool execution engine, multi-channel gateway, context & memory를 핵심 capability로 설명하고, README는 streaming, voice, MCP, subagents, tunnels, hardware peripherals까지 언급한다. 즉 NullClaw의 메시지는 “기능을 덜어내서 가벼워진 런타임”이 아니라 “전체 agent 인프라를 더 작은 비용으로 다시 설계한 런타임”에 가깝다.

## 아키텍처는 어떻게 짜였나

문서에서 가장 중요한 키워드는 *vtable-driven pluggable architecture*다. 아키텍처 문서는 NullClaw가 `ptr: *anyopaque + vtable` 방식의 인터페이스와 factory 기반 선택 구조를 사용한다고 설명한다. 그래서 provider, channel, tool, memory, runtime, sandbox, tunnel, peripheral 같은 주요 서브시스템을 코어 오케스트레이션 전체를 뒤엎지 않고도 교체하거나 확장할 수 있게 설계했다.

구체적으로 보면 provider 쪽에는 OpenRouter, Anthropic, OpenAI, Azure OpenAI, Gemini, Vertex AI, Ollama, Groq, Mistral, xAI, DeepSeek 등과 41개 이상의 OpenAI-compatible endpoint가 있고, channel 쪽에는 CLI, Telegram, Signal, Discord, Slack, Matrix, WhatsApp, Nostr, IRC, Email, Web, Teams 등이 올라가 있다. memory는 SQLite, Markdown, ClickHouse, PostgreSQL, Redis, LanceDB, Lucid, LRU, API, None을 지원하고, tool은 shell, file_read, file_write, http_request, web_fetch, web_search, delegate, screenshot, browser_open 등을 포함한다. 이 문서만 봐도 NullClaw가 “모델 추상화 라이브러리”가 아니라 “확장 가능한 agent runtime”에 가깝다는 게 분명하다.

## 메모리 계층도 꽤 실전적이다

아키텍처 문서는 메모리 스택을 단순 저장소가 아니라 retrieval 시스템으로 설명한다. 기본 계층은 SQLite 기반 hybrid retrieval이며, embeddings BLOB + cosine similarity로 벡터 검색을 하고, SQLite FTS5 + BM25로 키워드 검색을 수행한 뒤, weighted merge로 결합한다. 여기에 automatic archive / purge와 export / import migration path도 포함된다. 이 정도면 NullClaw의 memory는 “채팅 기록 보관”을 넘어서, 장기 컨텍스트와 검색 가능한 작업 상태를 함께 다루는 런타임 계층이라고 보는 편이 맞다.

## 설치와 첫 실행은 어떻게 시작하나

공식 문서는 설치 경로를 꽤 명확하게 제공한다. 가장 쉬운 경로는 Homebrew 설치이고, 그다음 `onboard --interactive`로 초기 설정을 만든 뒤 `agent`와 `gateway`로 검증하는 흐름이다. 소스에서 빌드할 수도 있고, 공식 OCI 이미지 `ghcr.io/nullclaw/nullclaw`와 Docker Compose 예제도 제공된다. Android/Termux 경로도 별도로 설명돼 있고, 최신 릴리스 자산에는 Android, Linux, macOS용 바이너리들이 함께 올라와 있다.

```bash
brew install nullclaw
nullclaw onboard --interactive
nullclaw agent -m "hello nullclaw"
nullclaw gateway
```

여기서 꼭 짚어야 할 점은 Zig 버전이다. 설치 문서, 기여 가이드, 개발용 `CLAUDE.md`까지 모두 *Zig 0.15.2 정확히 그 버전*을 요구한다. 그래서 NullClaw를 읽거나 빌드할 때는 “최신 Zig면 되겠지”라고 생각하기보다, 먼저 toolchain 버전부터 맞추는 게 안전하다.

## 설정 철학은 단순하지 않지만 방향은 명확하다

설정 문서는 NullClaw가 OpenClaw 호환 config structure와 `snake_case` 키를 사용한다고 설명한다. 기본 설정 파일은 `~/.nullclaw/config.json`이고, `nullclaw onboard --interactive`가 이 파일을 생성한다. 최소 working config만 봐도 provider, default model, CLI channel, SQLite memory, gateway host/port, autonomy level, sandbox, audit까지 한 번에 다룬다. 즉 NullClaw의 config는 “API 키 하나 넣는 파일”이 아니라, 런타임 정책 자체를 정의하는 문서에 가깝다.

특히 눈에 띄는 것은 `model_routes`와 `agents.list`다. 문서 기준으로 `fast`, `balanced`, `deep`, `reasoning`, `vision` 같은 route hint를 둘 수 있고, 세션이 특정 모델에 고정되지 않았을 때 프롬프트 성격에 맞춰 모델을 자동 선택한다. 또 named agent profile을 `agents.list`에 정의하고, `delegate` 도구나 `/subagents spawn --agent`, `bindings`와 연결할 수 있다. 최신 릴리스가 per-agent workspace isolation을 강조한 것도 같은 맥락이다.

문서상 `workspace_path`를 지정하면 각 agent는 자기 전용 workspace와 durable memory namespace를 갖고, 첫 사용 시 `AGENTS.md`, `SOUL.md`, `IDENTITY.md`, `MEMORY.md` 같은 파일도 scaffold된다. 이 부분은 NullClaw가 “여러 모델을 번갈아 호출하는 CLI”보다 “역할이 분리된 여러 agent를 운영하는 런타임”을 더 강하게 염두에 두고 있음을 보여준다.

## 채널과 플러그인 계층이 특히 흥미롭다

NullClaw의 채널 계층은 내장 채널 숫자가 많다는 데서 끝나지 않는다. 설정 문서는 external channel plugin을 stdio 기반 line-delimited JSON-RPC로 연결하는 방식을 정의하고, `get_manifest`, `start`, `send`, `stop`, `health` 같은 생명주기 계약을 설명한다. 다시 말해 “저장소 안에 없는 채널도 런타임 밖에서 붙일 수 있는 구조”를 공식적으로 열어 둔 셈이다.

이 점은 examples 디렉터리에서도 드러난다. 예제 폴더에는 `external-channel-template`, `whatsapp-web`, `email`, `edge/cloudflare-worker`, `meshrelay`, `modal-matrix` 등이 있다. 문서에는 WhatsApp 관련 companion repository도 out-of-tree로 분리돼 있다고 적혀 있다. 그래서 NullClaw의 channel layer는 단순 기능 번들이 아니라, 바깥 확장을 염두에 둔 인터페이스 계층으로 읽는 편이 더 정확하다.

## 운영 명령어를 보면 “런타임”이라는 말이 더 잘 이해된다

Commands 문서를 보면 NullClaw는 `onboard`, `agent`, `gateway`만 제공하는 도구가 아니다. `service`, `status`, `doctor`, `update`, `auth`, `channel`, `cron`, `skills`, `history`, `memory`, `workspace`, `capabilities`, `models`, `migrate`, `hardware` 같은 상위 명령이 따로 정리돼 있다. 공식 사이트도 이를 19개의 top-level CLI command와 terminal + web dual operator surface로 요약한다.

이걸 운영 관점에서 바꿔 말하면, NullClaw는 “한 번 실행하고 끝나는 챗 인터페이스”보다 “서비스로 설치하고, 상태를 보고, 채널을 띄우고, cron 작업을 돌리고, memory를 검색하고, 필요하면 OpenClaw에서 마이그레이션하는 도구”에 더 가깝다. 특히 `doctor`, `status`, `channel status`, `history`, `memory search`, `models benchmark`, `migrate openclaw` 같은 명령어 구성은 실사용과 운영을 동시에 겨냥한다는 인상을 준다.

## 보안은 슬로건보다 기본값에서 더 잘 보인다

Security 문서를 보면 NullClaw는 secure-by-default를 꽤 진지하게 밀고 있다. gateway는 기본적으로 `127.0.0.1`에 바인딩되고, pairing auth가 기본 활성화되며, `workspace_only = true`, sandbox auto-selection, secret encryption, resource limit, audit logging 같은 항목이 기본 통제 장치로 정리돼 있다. 채널 allowlist도 기본적으로 보수적으로 다루고, wildcard allowlist는 high-risk로 설명한다.

이 부분이 흥미로운 이유는, README가 “fully autonomous”를 강조하면서도 실제 최소 설정과 권장 보안 설정은 `supervised`, `workspace_only`, `max_actions_per_hour` 같은 제한을 포함하고 있기 때문이다. 최신 릴리스에서도 non-loopback gateway에서 위험한 autonomy 모드를 막는 보안 수정, secret key rotation, config.json에 저장되는 API key 암호화 같은 변경이 포함됐다. 말 그대로 “자율성은 밀지만, 기본값은 보수적으로 둔다”는 태도다.

## 개발 문화도 꽤 잘 정리돼 있다

기여 문서와 개발 문서를 보면 NullClaw는 개발 프로세스도 꽤 체계적으로 정리해 둔 편이다. `CONTRIBUTING.md`와 `docs/en/development.md`는 모두 Zig 0.15.2를 강조하고, 최소 검증으로 `zig build test --summary all`을 요구한다. 개발 문서는 `pre-commit`에서 `zig fmt --check src/`, `pre-push`에서 전체 테스트를 실행하는 hook 흐름도 설명한다.

흥미로운 점은 저장소 루트에 `AGENTS.md`와 `CLAUDE.md`까지 있다는 점이다. `AGENTS.md`는 저장소 전체에 대한 agent engineering protocol을 정의하고, `CLAUDE.md`는 Claude Code가 이 저장소를 수정할 때 따라야 하는 가이드와 빌드·테스트 명령을 적어 둔다. 즉 이 프로젝트는 AI agent runtime을 만드는 데서 그치지 않고, *AI가 함께 수정할 수 있는 저장소 운영 방식*까지 문서화하고 있다.

## 누구에게 특히 잘 맞는 저장소인가

문서 구성과 기능 구성을 종합해 보면, NullClaw는 작은 머신이나 엣지 환경에서 agent를 돌리고 싶은 사람, 여러 메시징 채널을 직접 붙여 self-hosted assistant를 운영하고 싶은 사람, 그리고 “에이전트 앱”보다 “에이전트 런타임”이 필요한 사람에게 특히 잘 맞아 보인다. README와 공식 사이트가 작은 바이너리, 낮은 메모리 사용량, gateway, channel, tool, memory를 동시에 강조하고 있기 때문이다. 이건 엄밀히 말해 문서를 바탕으로 한 해석이지만, 프로젝트가 겨냥하는 사용자가 누구인지는 꽤 분명하게 읽힌다.

반대로, 아주 단순한 로컬 챗봇만 원하거나 Zig toolchain과 설정 면적이 부담스러운 사람에게는 다소 무겁게 느껴질 수도 있다. NullClaw의 장점은 기능이 넓고 구조가 분리돼 있다는 데 있는데, 그만큼 처음 들어갈 때 문서 왕복이 필요하다. 그래서 이 프로젝트는 “쉬운 첫 도구”보다 “제대로 운영할 수 있는 런타임”에 더 가깝다.

## 마무리

정리하면 NullClaw는 “Zig로 만든 작은 AI 툴”이 아니다. 이 저장소는 작은 바이너리와 낮은 런타임 비용을 유지하면서도, provider abstraction, multi-channel gateway, hybrid memory, tools, security, service mode, migration, subagent/workspace isolation까지 한데 묶어 *배포 가능한 agent infrastructure*를 만들려는 시도다. 라이선스도 MIT라서 실험과 확장 관점의 진입장벽이 낮다.

한 줄로 끝내면 이렇다. *NullClaw는 AI assistant를 “앱”이 아니라 “작고 빠르게 배포 가능한 런타임”으로 다시 정의하려는 프로젝트다.* 엣지 장비, 소형 VPS, 로컬 self-hosting, 멀티채널 bot 운영 같은 키워드에 관심이 있다면 충분히 깊게 읽어볼 가치가 있다.
