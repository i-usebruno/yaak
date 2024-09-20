// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { CookieJar } from "./models";
import type { Environment } from "./models";
import type { Folder } from "./models";
import type { GrpcConnection } from "./models";
import type { GrpcEvent } from "./models";
import type { GrpcRequest } from "./models";
import type { HttpRequest } from "./models";
import type { HttpResponse } from "./models";
import type { KeyValue } from "./models";
import type { Plugin } from "./models";
import type { Settings } from "./models";
import type { Workspace } from "./models";

export type BootRequest = { dir: string, };

export type BootResponse = { name: string, version: string, capabilities: Array<string>, };

export type CallHttpRequestActionArgs = { httpRequest: HttpRequest, };

export type CallHttpRequestActionRequest = { key: string, pluginRefId: string, args: CallHttpRequestActionArgs, };

export type CallTemplateFunctionArgs = { purpose: RenderPurpose, values: { [key in string]?: string }, };

export type CallTemplateFunctionRequest = { name: string, args: CallTemplateFunctionArgs, };

export type CallTemplateFunctionResponse = { value: string | null, };

export type Color = "custom" | "default" | "primary" | "secondary" | "info" | "success" | "notice" | "warning" | "danger";

export type CopyTextRequest = { text: string, };

export type ExportHttpRequestRequest = { httpRequest: HttpRequest, };

export type ExportHttpRequestResponse = { content: string, };

export type FilterRequest = { content: string, filter: string, };

export type FilterResponse = { content: string, };

export type FindHttpResponsesRequest = { requestId: string, limit: number | null, };

export type FindHttpResponsesResponse = { httpResponses: Array<HttpResponse>, };

export type GetHttpRequestActionsRequest = Record<string, never>;

export type GetHttpRequestActionsResponse = { actions: Array<HttpRequestAction>, pluginRefId: string, };

export type GetHttpRequestByIdRequest = { id: string, };

export type GetHttpRequestByIdResponse = { httpRequest: HttpRequest | null, };

export type GetTemplateFunctionsResponse = { functions: Array<TemplateFunction>, pluginRefId: string, };

export type HttpRequestAction = { key: string, label: string, icon: string | null, };

export type Icon = "copy" | "info" | "check_circle" | "alert_triangle";

export type ImportRequest = { content: string, };

export type ImportResources = { workspaces: Array<Workspace>, environments: Array<Environment>, folders: Array<Folder>, httpRequests: Array<HttpRequest>, grpcRequests: Array<GrpcRequest>, };

export type ImportResponse = { resources: ImportResources, };

export type InternalEvent = { id: string, pluginRefId: string, replyId: string | null, payload: InternalEventPayload, };

export type InternalEventPayload = { "type": "boot_request" } & BootRequest | { "type": "boot_response" } & BootResponse | { "type": "reload_request" } | { "type": "reload_response" } | { "type": "terminate_request" } | { "type": "terminate_response" } | { "type": "import_request" } & ImportRequest | { "type": "import_response" } & ImportResponse | { "type": "filter_request" } & FilterRequest | { "type": "filter_response" } & FilterResponse | { "type": "export_http_request_request" } & ExportHttpRequestRequest | { "type": "export_http_request_response" } & ExportHttpRequestResponse | { "type": "send_http_request_request" } & SendHttpRequestRequest | { "type": "send_http_request_response" } & SendHttpRequestResponse | { "type": "get_http_request_actions_request" } & GetHttpRequestActionsRequest | { "type": "get_http_request_actions_response" } & GetHttpRequestActionsResponse | { "type": "call_http_request_action_request" } & CallHttpRequestActionRequest | { "type": "get_template_functions_request" } | { "type": "get_template_functions_response" } & GetTemplateFunctionsResponse | { "type": "call_template_function_request" } & CallTemplateFunctionRequest | { "type": "call_template_function_response" } & CallTemplateFunctionResponse | { "type": "copy_text_request" } & CopyTextRequest | { "type": "render_http_request_request" } & RenderHttpRequestRequest | { "type": "render_http_request_response" } & RenderHttpRequestResponse | { "type": "show_toast_request" } & ShowToastRequest | { "type": "get_http_request_by_id_request" } & GetHttpRequestByIdRequest | { "type": "get_http_request_by_id_response" } & GetHttpRequestByIdResponse | { "type": "find_http_responses_request" } & FindHttpResponsesRequest | { "type": "find_http_responses_response" } & FindHttpResponsesResponse | { "type": "empty_response" };

export type Model = Environment | Folder | GrpcConnection | GrpcEvent | GrpcRequest | HttpRequest | HttpResponse | KeyValue | Workspace | CookieJar | Settings | Plugin;

export type RenderHttpRequestRequest = { httpRequest: HttpRequest, purpose: RenderPurpose, };

export type RenderHttpRequestResponse = { httpRequest: HttpRequest, };

export type RenderPurpose = "send" | "preview";

export type SendHttpRequestRequest = { httpRequest: HttpRequest, };

export type SendHttpRequestResponse = { httpResponse: HttpResponse, };

export type ShowToastRequest = { message: string, color?: Color | null, icon?: Icon | null, };

export type TemplateFunction = { name: string, args: Array<TemplateFunctionArg>, };

export type TemplateFunctionArg = { "type": "text" } & TemplateFunctionTextArg | { "type": "select" } & TemplateFunctionSelectArg | { "type": "checkbox" } & TemplateFunctionCheckboxArg | { "type": "http_request" } & TemplateFunctionHttpRequestArg;

export type TemplateFunctionBaseArg = { name: string, optional?: boolean | null, label?: string | null, defaultValue?: string | null, };

export type TemplateFunctionCheckboxArg = { name: string, optional?: boolean | null, label?: string | null, defaultValue?: string | null, };

export type TemplateFunctionHttpRequestArg = { name: string, optional?: boolean | null, label?: string | null, defaultValue?: string | null, };

export type TemplateFunctionSelectArg = { options: Array<TemplateFunctionSelectOption>, name: string, optional?: boolean | null, label?: string | null, defaultValue?: string | null, };

export type TemplateFunctionSelectOption = { name: string, value: string, };

export type TemplateFunctionTextArg = { placeholder?: string | null, name: string, optional?: boolean | null, label?: string | null, defaultValue?: string | null, };
