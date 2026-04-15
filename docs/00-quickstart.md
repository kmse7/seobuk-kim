# Claude Code 빠른 시작

Claude Code는 AI 코딩 어시스턴트입니다. 설치 후 5분 안에 첫 대화를 시작할 수 있습니다.

## 설치

### macOS / Linux (Homebrew)

```bash
brew install anthropic/claude/claude
```

### 모든 플랫폼 (npm)

```bash
npm install -g @anthropic-ai/claude
```

설치 확인:

```bash
claude --version
```

## 로그인

처음 실행할 때 로그인이 필요합니다.

```bash
claude
```

다음을 볼 것입니다:

```
Claude Code v0.x
Type /login to authenticate
```

`/login` 입력 후 엔터를 누르면 브라우저가 자동으로 열립니다. Anthropic 계정으로 로그인하면 완료입니다.

## 첫 실행: 프로젝트 구조 분석

프로젝트 디렉토리로 이동합니다.

```bash
cd ~/my-project
claude
```

첫 메시지를 작성합니다:

```
이 프로젝트 구조 설명해줄래?
```

Claude Code가:
- 프로젝트 디렉토리의 파일과 폴더를 읽음
- 패턴을 분석하여 구조 설명
- 주요 파일 목적 설명
- 추천 사항 제시

## 왜 프로젝트 디렉토리에서 실행해야 할까?

Claude Code는 **현재 디렉토리가 프로젝트 루트**라고 가정합니다.

```bash
cd ~/my-project
claude                    # 올바름
```

다른 위치에서 실행하면:

```bash
cd ~
claude                    # 프로젝트 파일에 접근 불가
```

프로젝트 루트에 `package.json`, `src/`, `.git/` 등이 있는 위치에서 실행하세요.

## 기본 모드

Claude Code는 4가지 모드로 동작합니다. 프롬프트로 모드를 지정합니다.

| 모드 | 설명 | 사용 시기 |
|------|------|----------|
| **default** | AI가 파일 읽기/수정 권한 요청 | 일반적인 코딩 작업 |
| **plan** | AI가 명시적 승인 없이 파일 읽기만 함 | 설계 단계, 분석 |
| **acceptEdits** | AI가 자동으로 변경사항 적용 (승인 생략) | 자동 리팩토링, 대량 변경 |
| **bypassPermissions** | 모든 권한 자동 부여 | 신뢰하는 작업만 |

모드 지정:

```bash
claude --mode plan
claude -m acceptEdits
```

## 기본 명령어

세션 중 슬래시 명령어(slash commands)로 제어합니다.

| 명령어 | 설명 |
|--------|------|
| `/help` | 사용 가능한 명령어 목록 |
| `/status` | 현재 세션 상태 |
| `/clear` | 대화 히스토리 초기화 (컨텍스트 리셋) |
| `/config` | 현재 설정 보기 |
| `/model` | 사용 중인 AI 모델 변경 |
| `/exit` | Claude Code 종료 |

## 다음 단계

기본 명령어를 알았으니, [01-basic-usage.md](01-basic-usage.md)에서:
- 파일 읽기 / 수정 / 생성
- 코드 질문 / 버그 찾기
- 터미널 명령어 실행
- 웹 검색 활용

을 배우세요.
