export type TemplateLanguage = "ko" | "en";
export type TemplateAutoMode = "on" | "off";
export type TemplateTeamsMode = "on" | "off";
export type TemplateProvider = "codex";
export interface TemplateInput {
    language: TemplateLanguage;
    autoMode: TemplateAutoMode;
    teamsMode: TemplateTeamsMode;
    provider: TemplateProvider;
    version: string;
}
export interface GeneratedFileTemplate {
    path: string;
    content: string;
    executable?: boolean;
    preserveExistingContent?: boolean;
}
export declare function buildGeneratedFiles(input: TemplateInput): GeneratedFileTemplate[];
