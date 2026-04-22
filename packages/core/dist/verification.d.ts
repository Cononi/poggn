export type ProjectVerificationMode = "manual" | "declared";
export type ProjectVerificationStatus = "ready" | "manual_verification_required" | "blocked";
export type ProjectVerificationPreset = "spring-boot-gradle" | "spring-boot-maven";
export interface ProjectVerificationCommand {
    cwd: string;
    argv: string[];
    timeoutMs: number;
    env?: Record<string, string>;
}
export interface ProjectVerificationConfig {
    mode: ProjectVerificationMode;
    preset?: ProjectVerificationPreset | null;
    commands: ProjectVerificationCommand[];
    manualReason?: string | null;
}
export interface ResolvedProjectVerificationCommand extends ProjectVerificationCommand {
    absoluteCwd: string;
}
export interface ResolvedProjectVerification {
    mode: ProjectVerificationMode;
    status: ProjectVerificationStatus;
    preset: ProjectVerificationPreset | null;
    reason: string | null;
    commands: ResolvedProjectVerificationCommand[];
}
export declare function createProjectVerificationPreset(preset: ProjectVerificationPreset): ProjectVerificationCommand[];
export declare function normalizeProjectVerification(value: unknown): ProjectVerificationConfig;
export declare function resolveProjectVerification(rootDir: string, value: unknown): ResolvedProjectVerification;
