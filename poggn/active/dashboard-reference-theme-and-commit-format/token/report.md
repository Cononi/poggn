---
pgg:
  topic: "dashboard-reference-theme-and-commit-format"
  stage: "token"
  status: "reviewed"
  skill: "pgg-token"
  score: 96
  updated_at: "2026-04-24T06:05:52Z"
state:
  summary: "`pgg-state-pack.sh` 중심 handoff가 현재 topic의 naive full-doc bundle 대비 약 88.3% token 절감을 만든다."
  next: "pgg-performance"
---

# token.report

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 테크 리드 | 96 | 가장 큰 token 비용은 version-dot commit contract를 생성하는 template/helper source와 stage 전환 때 topic 문서를 본문째 다시 넘기는 handoff 관행이다. `pgg-state-pack.sh`를 다음 stage handoff 기본값으로 유지하는 것이 가장 큰 절감 효과를 만든다. | 없음 |
| 시니어 백엔드 엔지니어 | 96 | `packages/core/src/templates.ts`, `pgg-git-publish.sh`, `pgg-stage-commit.sh`가 commit contract 변경의 핵심 source surface다. deep context가 필요할 때만 해당 파일을 선택적으로 열어야 한다. | 없음 |
| 코드 리뷰어 | 96 | `state/current.md`의 Changed Files 표가 길어졌지만, 다음 stage에는 file ref와 active spec/task만 전달하면 기능 보존 evidence를 유지하면서 token 비용을 통제할 수 있다. | 없음 |

## Measurement Method

- repo 안에 `tiktoken`, `gpt-tokenizer`, 별도 tokenizer 구현이 없어 `estimated tokens = ceil(characters / 4)` 규칙으로 측정했다.
- 측정 범위는 pgg workflow source-of-truth, helper/script, generated doc source, 현재 topic 문서 bundle, `pgg-state-pack.sh` 출력으로 제한했다.
- 외부 billing API, 모델별 가격표, dashboard runtime bundle size는 포함하지 않았다.

## Measured Contributors

| Surface | chars | estimated tokens | Note |
|---|---:|---:|---|
| `packages/core/src/templates.ts` | 153725 | 38432 | workflow/generated helper/doc source-of-truth라 가장 큰 single-file token surface |
| `.codex/sh/pgg-git-publish.sh` | 30445 | 7612 | publish title validation과 version-dot prefix extraction 포함 |
| `.codex/sh/pgg-stage-commit.sh` | 16083 | 4021 | stage commit title generation/validation 포함 |
| `packages/core/src/readme.ts` | 13448 | 3362 | generated README source |
| `README.md` | 11891 | 2973 | 사용자-facing workflow와 commit contract 설명 |
| `state/current.md` | 8244 | 2061 | 다음 stage handoff 기본 문서지만 Changed Files 표로 비대해짐 |
| `proposal.md` | 7372 | 1843 | 요구사항, acceptance, audit applicability 기록 |
| `implementation/index.md` | 6228 | 1557 | 25개 변경 파일 traceability 기록 |
| `plan.md` | 5246 | 1312 | spec/rollout/audit 조건 기록 |
| `.codex/add/WOKR-FLOW.md` | 4076 | 1019 | workflow stage와 publish contract 규칙 |
| `task.md` | 3692 | 923 | task/spec 매핑과 verification checklist |

## Handoff Comparison

| Bundle | chars | estimated tokens | Saving vs naive |
|---|---:|---:|---:|
| naive full-doc bundle (`proposal`, `plan`, `task`, `implementation/index`, `reviews/code.review`, `reviews/refactor.review`) | 25053 | 6264 | baseline |
| `state/current.md` only | 8244 | 2061 | 4203 tokens, 67.1% |
| `pgg-state-pack.sh` output | 2939 | 735 | 5529 tokens, 88.3% |

`pgg-state-pack.sh`는 `state/current.md` 단독 전달보다도 1326 estimated tokens, 64.3%를 추가로 줄인다.

## Bottlenecks

- `packages/core/src/templates.ts`가 38432 estimated tokens로 압도적으로 크다. generated helper/doc contract 문구를 중복 추가하면 비용이 전체 생성 surface로 증폭된다.
- commit contract 변경은 `.codex/sh/pgg-git-publish.sh`와 `.codex/sh/pgg-stage-commit.sh`까지 함께 확인해야 하지만, 두 helper를 매 stage handoff에 전문 포함하면 11633 estimated tokens가 추가된다.
- `state/current.md`는 2061 estimated tokens로 naive bundle보다 작지만 Changed Files 표가 길어져 과거 topic보다 크다. 다음 stage에서는 `pgg-state-pack.sh` output과 file ref를 우선해야 한다.
- `implementation/index.md`는 1557 estimated tokens다. QA나 audit에서 traceability가 필요하면 전체 본문보다 diff ref 목록과 relevant row만 선택적으로 열어야 한다.

## Optimization Actions

1. 다음 stage handoff는 `state/current.md` 전문보다 `pgg-state-pack.sh` output을 우선한다.
   - 현재 topic 기준 naive bundle 6264 estimated tokens 대비 `pgg-state-pack.sh` output은 735로 88.3% 절감된다.
2. `packages/core/src/templates.ts`는 contract source-of-truth 확인이 필요한 경우에만 열고, 일반 stage 전환에는 file ref만 전달한다.
   - 이 파일 하나가 38432 estimated tokens라서 full context에 포함하면 다른 topic 문서 전체보다 비용이 커진다.
3. helper 검토는 `pgg-stage-commit.sh`와 `pgg-git-publish.sh`의 relevant validation/generation block만 확인한다.
   - helper 전문 합산 11633 estimated tokens를 매번 싣는 대신, commit subject contract regression 단계에서만 선택적으로 열면 된다.
4. `state/current.md`의 Changed Files 표는 archive 전까지 유지하되, handoff에는 `refs`와 active task/spec 목록으로 축약한다.
   - `state/current.md` 단독 2061 estimated tokens보다 `pgg-state-pack.sh` output 735 estimated tokens가 더 적다.

## Post-Optimization Result

- 현재 topic은 workflow docs, helper, generated templates, state handoff commit contract를 함께 바꿨지만, 다음 stage가 `pgg-state-pack.sh` 중심으로 이어지면 naive full-doc handoff 대비 약 88.3% token 절감 기준선을 확보했다.
- 추가 코드 변경 없이 operational handoff 규율만으로 가장 큰 비용 병목을 줄일 수 있다.
- 다음 `pgg-performance`와 `pgg-qa`는 `state/current.md` 또는 `pgg-state-pack.sh`를 먼저 보고, 필요한 source file과 diff만 선택적으로 여는 방식이 가장 효율적이다.
