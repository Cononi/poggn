import { alpha, useTheme } from "@mui/material/styles";
import {
  Alert,
  Box,
  Button,
  ButtonBase,
  Divider,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import type { DashboardLocale, DashboardThemeMode, ProjectSnapshot } from "../../shared/model/dashboard";
import { normalizeDashboardTitleIconSvg, toSvgDataUrl } from "../../shared/utils/brand";

type SettingsWorkspaceProps = {
  project: ProjectSnapshot | null;
  panel: "main" | "refresh" | "git" | "system";
  dictionary: DashboardLocale;
  isLiveMode: boolean;
  themeMode: DashboardThemeMode;
  onApplyTitle: (title: string) => void;
  onApplyTitleIcon: (titleIconSvg: string) => void;
  onApplyRefreshInterval: (value: number) => void;
  onApplyGitPrefixes: (workingBranchPrefix: string, releaseBranchPrefix: string) => void;
  onUpdateLanguage: (language: "ko" | "en") => void;
  onUpdateThemeMode: (mode: DashboardThemeMode) => void;
  onUpdateSystem: (payload: Partial<{ autoMode: "on" | "off"; teamsMode: "on" | "off"; gitMode: "on" | "off" }>) => void;
};

export function SettingsWorkspace(props: SettingsWorkspaceProps) {
  const theme = useTheme();
  const [titleDraft, setTitleDraft] = useState(props.project?.dashboardTitle ?? "");
  const [titleIconDraft, setTitleIconDraft] = useState(props.project?.dashboardTitleIconSvg ?? "");
  const [refreshDraft, setRefreshDraft] = useState(String(props.project?.refreshIntervalMs ?? 10_000));
  const [workingDraft, setWorkingDraft] = useState(props.project?.workingBranchPrefix ?? "ai");
  const [releaseDraft, setReleaseDraft] = useState(props.project?.releaseBranchPrefix ?? "release");
  const [autoMode, setAutoMode] = useState<"on" | "off">(props.project?.autoMode ?? "on");
  const [teamsMode, setTeamsMode] = useState<"on" | "off">(props.project?.teamsMode ?? "off");
  const [gitMode, setGitMode] = useState<"on" | "off">(props.project?.gitMode ?? "off");

  useEffect(() => {
    setTitleDraft(props.project?.dashboardTitle ?? "");
    setTitleIconDraft(props.project?.dashboardTitleIconSvg ?? "");
    setRefreshDraft(String(props.project?.refreshIntervalMs ?? 10_000));
    setWorkingDraft(props.project?.workingBranchPrefix ?? "ai");
    setReleaseDraft(props.project?.releaseBranchPrefix ?? "release");
    setAutoMode(props.project?.autoMode ?? "on");
    setTeamsMode(props.project?.teamsMode ?? "off");
    setGitMode(props.project?.gitMode ?? "off");
  }, [props.project, props.panel]);

  if (!props.project) {
    return <Alert severity="info">{props.dictionary.empty}</Alert>;
  }

  const editingDisabled = !props.isLiveMode;
  const previewIconSvg = normalizeDashboardTitleIconSvg(titleIconDraft);

  return (
    <Paper
      sx={{
        p: 2.5,
        borderRadius: 1,
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.98)}, ${alpha(theme.palette.background.default, 0.84)})`
            : `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.98)}, ${alpha("#f3f7ff", 0.92)})`
      }}
    >
      <Stack spacing={2}>
        <Stack spacing={1}>
          <Typography variant="overline" color="primary.main">
            {props.dictionary.settings}
          </Typography>
          <Typography variant="h6">{props.dictionary.settingsTitle}</Typography>
          <Typography variant="body2" color="text.secondary">
            {props.dictionary.settingsHint}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {props.dictionary.settingsTarget}: {props.project.name}
          </Typography>
        </Stack>

        {editingDisabled ? <Alert severity="info">{props.dictionary.liveEditingDisabled}</Alert> : null}

        {props.panel === "main" ? (
          <Stack spacing={2}>
            <SettingsSection title={props.dictionary.dashboardTitle} helper={props.dictionary.dashboardTitleHint}>
              <Stack spacing={1.5}>
                <BrandPreviewCard
                  title={titleDraft || props.project.dashboardTitle}
                  iconSvg={previewIconSvg}
                  dictionary={props.dictionary}
                />
                <InlineApplyField
                  label={props.dictionary.dashboardTitle}
                  value={titleDraft}
                  disabled={editingDisabled}
                  onChange={setTitleDraft}
                  onApply={() => props.onApplyTitle(titleDraft)}
                  applyLabel={props.dictionary.applyChanges}
                />
              </Stack>
            </SettingsSection>

            <SettingsSection title={props.dictionary.titleIcon} helper={props.dictionary.titleIconHint}>
              <Stack spacing={1.5}>
                <TextField
                  multiline
                  minRows={6}
                  label={props.dictionary.titleIcon}
                  value={titleIconDraft}
                  disabled={editingDisabled}
                  onChange={(event) => setTitleIconDraft(event.target.value)}
                />
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="caption" color="text.secondary">
                    {props.dictionary.titleIconPreview}
                  </Typography>
                  <Button
                    variant="contained"
                    disabled={editingDisabled}
                    onClick={() => props.onApplyTitleIcon(titleIconDraft)}
                  >
                    {props.dictionary.applyChanges}
                  </Button>
                </Stack>
              </Stack>
            </SettingsSection>

            <SettingsSection title={props.dictionary.language} helper={props.dictionary.languageHint}>
              <InlineToggleGroup
                options={[
                  { value: "ko", label: "KO" },
                  { value: "en", label: "EN" }
                ]}
                value={props.project.language}
                disabled={editingDisabled}
                onChange={(value) => props.onUpdateLanguage(value as "ko" | "en")}
              />
            </SettingsSection>

            <SettingsSection title={props.dictionary.themeMode} helper={props.dictionary.themeModeHint}>
              <InlineToggleGroup
                options={[
                  { value: "light", label: props.dictionary.lightMode },
                  { value: "dark", label: props.dictionary.darkMode }
                ]}
                value={props.themeMode}
                disabled={false}
                onChange={(value) => props.onUpdateThemeMode(value as DashboardThemeMode)}
              />
            </SettingsSection>
          </Stack>
        ) : null}

        {props.panel === "refresh" ? (
          <SettingsSection title={props.dictionary.refresh} helper={props.dictionary.refreshIntervalHint}>
            <InlineApplyField
              label={props.dictionary.refreshInterval}
              value={refreshDraft}
              inputType="number"
              disabled={editingDisabled}
              onChange={setRefreshDraft}
              onApply={() => props.onApplyRefreshInterval(Number(refreshDraft))}
              applyLabel={props.dictionary.applyChanges}
            />
          </SettingsSection>
        ) : null}

        {props.panel === "git" ? (
          <SettingsSection title={props.dictionary.git} helper={props.dictionary.gitHint}>
            <Stack spacing={2}>
              {props.project.autoMode === "off" ? (
                <Alert severity="warning">{props.dictionary.autoModeRequired}</Alert>
              ) : null}
              <InlineApplyField
                label={props.dictionary.workingBranchPrefix}
                value={workingDraft}
                disabled={editingDisabled || props.project.autoMode === "off"}
                onChange={setWorkingDraft}
                onApply={() => props.onApplyGitPrefixes(workingDraft, releaseDraft)}
                applyLabel={props.dictionary.applyChanges}
              />
              <InlineApplyField
                label={props.dictionary.releaseBranchPrefix}
                value={releaseDraft}
                disabled={editingDisabled || props.project.autoMode === "off"}
                onChange={setReleaseDraft}
                onApply={() => props.onApplyGitPrefixes(workingDraft, releaseDraft)}
                applyLabel={props.dictionary.applyChanges}
              />
            </Stack>
          </SettingsSection>
        ) : null}

        {props.panel === "system" ? (
          <SettingsSection title={props.dictionary.system} helper={props.dictionary.systemHint}>
            <Stack spacing={2}>
              <SystemToggle
                label={props.dictionary.autoMode}
                checked={autoMode === "on"}
                disabled={editingDisabled}
                onChange={(checked) => {
                  const nextValue = checked ? "on" : "off";
                  setAutoMode(nextValue);
                  props.onUpdateSystem({ autoMode: nextValue });
                }}
              />
              <SystemToggle
                label={props.dictionary.teamsMode}
                checked={teamsMode === "on"}
                disabled={editingDisabled}
                onChange={(checked) => {
                  const nextValue = checked ? "on" : "off";
                  setTeamsMode(nextValue);
                  props.onUpdateSystem({ teamsMode: nextValue });
                }}
              />
              <SystemToggle
                label={props.dictionary.gitMode}
                checked={gitMode === "on"}
                disabled={editingDisabled}
                onChange={(checked) => {
                  const nextValue = checked ? "on" : "off";
                  setGitMode(nextValue);
                  props.onUpdateSystem({ gitMode: nextValue });
                }}
              />
            </Stack>
          </SettingsSection>
        ) : null}
      </Stack>
    </Paper>
  );
}

function SettingsSection(props: { title: string; helper: string; children: React.ReactNode }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
      <Stack spacing={1.5}>
        <Stack spacing={0.4}>
          <Typography variant="subtitle1">{props.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {props.helper}
          </Typography>
        </Stack>
        <Divider />
        {props.children}
      </Stack>
    </Paper>
  );
}

function BrandPreviewCard(props: { title: string; iconSvg: string; dictionary: DashboardLocale }) {
  const theme = useTheme();

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        borderRadius: 1,
        backgroundColor: alpha(theme.palette.background.default, 0.48)
      }}
    >
      <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
          <Box
            component="img"
            alt={`${props.title} icon`}
            src={toSvgDataUrl(props.iconSvg)}
            sx={{ width: 34, height: 34, borderRadius: 1 }}
          />
          <Stack spacing={0.2}>
            <Typography variant="subtitle2">{props.title}</Typography>
            <Typography variant="caption" color="text.secondary">
              {props.dictionary.titleIconPreview}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}

function InlineApplyField(props: {
  label: string;
  value: string;
  inputType?: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onApply: () => void;
  applyLabel: string;
}) {
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={1.25} sx={{ alignItems: { md: "flex-start" } }}>
      <TextField
        fullWidth
        type={props.inputType}
        label={props.label}
        value={props.value}
        disabled={props.disabled}
        onChange={(event) => props.onChange(event.target.value)}
      />
      <Button
        variant="contained"
        disabled={props.disabled}
        onClick={props.onApply}
        sx={{ minWidth: { md: 132 } }}
      >
        {props.applyLabel}
      </Button>
    </Stack>
  );
}

function InlineToggleGroup(props: {
  options: Array<{ value: string; label: string }>;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  const theme = useTheme();

  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
      {props.options.map((option) => {
        const active = props.value === option.value;

        return (
          <ButtonBase
            key={option.value}
            disabled={props.disabled}
            onClick={() => props.onChange(option.value)}
            sx={{
              px: 1.5,
              py: 1,
              borderRadius: 1,
              border: `1px solid ${alpha(theme.palette.text.primary, active ? 0.18 : 0.08)}`,
              bgcolor: active ? alpha(theme.palette.primary.main, 0.14) : alpha(theme.palette.background.default, 0.42),
              color: active ? "primary.light" : "text.secondary"
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {option.label}
            </Typography>
          </ButtonBase>
        );
      })}
    </Stack>
  );
}

function SystemToggle(props: {
  label: string;
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="body1">{props.label}</Typography>
        <Switch
          checked={props.checked}
          disabled={props.disabled}
          onChange={(event) => props.onChange(event.target.checked)}
        />
      </Stack>
    </Paper>
  );
}
