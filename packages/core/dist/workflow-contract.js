export const CORE_WORKFLOW_SKILLS = [
    "pgg-add",
    "pgg-plan",
    "pgg-code",
    "pgg-refactor",
    "pgg-qa"
];
export const OPTIONAL_AUDIT_SKILLS = ["pgg-token", "pgg-performance"];
export const WORKFLOW_SKILLS = [...CORE_WORKFLOW_SKILLS, ...OPTIONAL_AUDIT_SKILLS];
export const STANDALONE_SKILLS = ["pgg-status"];
export const GENERATED_SKILLS = [...WORKFLOW_SKILLS, ...STANDALONE_SKILLS];
export const WORKFLOW_FRONTMATTER_STAGES = "proposal | plan | task | implementation | refactor | token | performance | qa";
export const WORKFLOW_FRONTMATTER_SKILLS = WORKFLOW_SKILLS.join(" | ");
export const README_WORKFLOW_STAGE_SUMMARIES_KO = [
    "1. `pgg-add`: proposal, 사용자 질문 기록, 전문가 attribution review 생성",
    "2. `pgg-plan`: plan, task, spec, plan/task review 생성",
    "3. `pgg-code`: 구현과 diff, code review 기록",
    "4. `pgg-refactor`: 레거시 제거와 구조 개선, refactor review 기록",
    "5. `pgg-qa`: `qa/report.md` 검증과 archive 판정"
];
export const README_WORKFLOW_STAGE_SUMMARIES_EN = [
    "1. `pgg-add`: create the proposal, the user-question record, and the attributed proposal review",
    "2. `pgg-plan`: create the plan, task, spec, and plan/task reviews",
    "3. `pgg-code`: implement the change and record diffs plus the code review",
    "4. `pgg-refactor`: remove legacy code, improve structure, and record the refactor review",
    "5. `pgg-qa`: validate `qa/report.md` and decide archive readiness"
];
export const README_OPTIONAL_AUDIT_SUMMARIES_KO = [
    "- `pgg-token`: workflow 자산, handoff, helper, generated 문서의 token 비용을 점검할 때만 실행하는 optional audit",
    "- `pgg-performance`: 성능 민감 변경이나 선언된 verification contract가 있을 때만 실행하는 optional audit"
];
export const README_OPTIONAL_AUDIT_SUMMARIES_EN = [
    "- `pgg-token`: an optional audit used only when workflow assets, handoff, helpers, or generated docs need token-cost review",
    "- `pgg-performance`: an optional audit used only when the topic has performance-sensitive changes or a declared verification contract"
];
export const MANDATORY_IMPLEMENTATION_CRITERIA_KO = [
    "중복 제거",
    "단일 책임",
    "가독성",
    "추상화",
    "일관성",
    "테스트에 좋은 코드",
    "예외 처리 필수",
    "작은 단위 처리",
    "의존성 관리",
    "확장성",
    "네이밍"
];
export const MANDATORY_IMPLEMENTATION_CRITERIA_EN = [
    "remove duplication",
    "keep single responsibility",
    "optimize readability",
    "use clear abstraction boundaries",
    "preserve consistency",
    "keep the code test-friendly",
    "handle exceptions explicitly",
    "prefer small units with one purpose",
    "keep dependencies loosely coupled",
    "preserve extensibility under OCP",
    "use names that make responsibilities obvious"
];
//# sourceMappingURL=workflow-contract.js.map