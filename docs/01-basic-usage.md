# Claude Code 기본 사용법

Claude Code를 이용한 실무 작업 방법을 배웁니다. 각 섹션은 실제 예시와 함께 제시됩니다.

## 파일 작업

### 파일 읽기

Claude Code에 파일을 읽도록 요청합니다.

```
Read src/utils/auth.js
```

또는:

```
This file is confusing - src/components/Button.tsx - explain what it does
```

Claude Code가:
- 파일 내용 읽음 (권한 요청 → 승인)
- 요청에 맞게 응답

### 파일 수정

수정 요청:

```
Fix the bug in src/api/users.js line 45. The password validation is wrong.
```

또는:

```
Add TypeScript types to src/utils/helpers.js
```

변경 시 Claude Code가:
- 변경사항 요약 표시
- 승인 대기 (default 모드)
- `y` 입력으로 적용, `n`으로 거절

### 파일 생성

새 파일 생성:

```
Create src/config/constants.ts with these values:
- API_BASE_URL = "https://api.example.com"
- MAX_RETRIES = 3
- TIMEOUT_MS = 5000
```

또는:

```
Generate a test file for src/utils/math.js. Use Jest syntax.
```

## 코드 질문

### 함수 설명 요청

```
What does this function do? src/lib/parseCSV.js
```

Claude Code가:
- 파일 읽음
- 목적, 입력값, 출력값 설명
- 사용 예시 제시

### 버그 찾기

```
Review src/components/Form.tsx for bugs
```

또는:

```
Why is this API call failing? Check src/services/api.js
```

Claude Code가:
- 코드 분석
- 잠재 문제 지적
- 해결책 제안

### 성능 개선

```
Optimize src/utils/database.js - it's running slow
```

또는:

```
This function is doing N+1 queries. Fix it: src/models/User.js
```

## 터미널 명령어

프로젝트 루트에서 실행할 명령어를 물어봅니다.

```
How do I run tests?
```

```
Run npm test and show me the results
```

```
What does this git command do? git rebase -i HEAD~3
```

Claude Code가:
- 명령어 실행
- 결과 표시
- 필요시 설명

## 검색 기능

### Glob 패턴으로 파일 찾기

```
Find all test files in src/ (*.test.js, *.spec.ts)
```

Claude Code는 glob 패턴을 사용하여:
- 매칭되는 모든 파일 나열
- 찾은 파일 개수 표시

### Grep으로 코드 검색

```
Where is the API_KEY constant defined? Search in src/
```

또는:

```
Find all TODO comments in the project
```

Claude Code가:
- 정규표현식으로 검색
- 파일 위치와 줄 번호 표시
- 관련 코드 스니펫 보여줌

## 웹 검색 및 문서 참조

### 웹 검색

```
How do I implement OAuth 2.0 in Node.js?
```

```
What's the latest version of React and what changed?
```

Claude Code가:
- 인터넷 검색 수행
- 신뢰할 만한 출처 참조
- 최신 정보 제공

### 라이브러리 문서

```
Show me the latest Express.js routing documentation
```

```
How do I use Prisma's transactions?
```

Claude Code가:
- 공식 문서 조회
- 최신 API 참조
- 코드 예시 제시

## 컨텍스트 관리

긴 세션에서는 대화 히스토리가 쌓입니다. 컨텍스트를 관리하세요.

### 컨텍스트 초기화

```
/clear
```

- 모든 대화 히스토리 삭제
- 새로운 세션으로 시작
- 메모리 절약

언제 사용:
- 다른 주제로 전환할 때
- 매우 긴 대화 후
- 이전 파일들이 더 이상 필요 없을 때

### 컨텍스트 압축

```
/compact
```

- 대화를 요약하여 메모리 절약
- 히스토리 유지
- 성능 개선

언제 사용:
- 한 기능 구현을 마친 후
- 다른 기능으로 넘어가기 전

## 슬래시 명령어 목록

세션 중 사용 가능한 모든 명령어:

| 명령어 | 설명 |
|--------|------|
| `/help` | 사용 가능한 모든 명령어 보기 |
| `/status` | 현재 프로젝트, 모드, AI 모델 확인 |
| `/config` | 설정 값 보기 |
| `/model` | 사용할 AI 모델 변경 |
| `/clear` | 대화 히스토리 완전 삭제 |
| `/compact` | 대화 요약 (히스토리 유지) |
| `/exit` 또는 `Ctrl+D` | Claude Code 종료 |
| `/login` | 인증 정보 갱신 |

더 자세한 내용:

```
/help
```

## 실용 예시

### 예시 1: 버그 수정

상황: 로그인이 작동하지 않음

```
로그인이 안 돼. src/auth/login.js 확인해줄래?
```

→ Claude Code가 파일 읽음 → 문제 발견 (예: 잘못된 에러 처리) → 수정안 제시 → 승인 후 적용

### 예시 2: 기능 추가

상황: 사용자 검색 기능 추가 필요

```
src/models/User.js에서 username으로 검색하는 메서드 추가해줄래?
```

→ Claude Code가 기존 코드 패턴 분석 → 새 메서드 작성 → 테스트 제안 → 적용

### 예시 3: 리팩토링

상황: 중복 코드 정리 필요

```
src/utils/ 폴더에 중복된 함수들이 있어. 리팩토링해줄래?
```

→ Claude Code가 모든 util 파일 검사 → 중복 함수 식별 → 공통 모듈로 통합 → 변경사항 적용

## 다음 단계

- [00-quickstart.md](00-quickstart.md)로 돌아가서 기본 설정 확인
- [02-keyboard-shortcuts.md](02-keyboard-shortcuts.md)에서 생산성 향상 팁 학습
