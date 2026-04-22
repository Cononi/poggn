---
pgg:
  topic: "pgg-major-bump-fix"
  stage: "review"
  status: "reviewed"
  score: 97
  updated_at: "2026-04-22T12:04:59Z"
---

# proposal.review

## Experts

- 프로덕트 매니저
- UX/UI 전문가
- 도메인 전문가

## Score

- 97

## Notes

- `major` 산술은 이미 helper와 테스트에 존재하므로, proposal이 겨냥해야 할 결함은 계산식보다 `pgg-add`의 선택 계약과 handoff 일관성이다.
- workflow/readme는 proposal 단계에서 사실상 `archive_type`만 강하게 설명하고 있어, 사용자가 semver impact를 별도 결정해야 한다는 점이 흐려진다.
- `STATE-CONTRACT`와 `pgg-state-pack.sh`의 불일치는 teams handoff나 후속 stage 판단에서 `version_bump` 근거를 잃게 만드는 실제 결함이다.
- `pgg-new-topic.sh`의 frontmatter 후처리 들여쓰기 손상은 지금은 shell helper가 견디더라도 이후 YAML 소비 surface를 불안정하게 만들 수 있으므로 같은 topic에서 다루는 것이 맞다.
- `0.x -> 1.0.0` 회귀 테스트를 명시적으로 추가해야 사용자가 제기한 "죽어도 major가 안 오른다"는 불신을 해소할 수 있다.
