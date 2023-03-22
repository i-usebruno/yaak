import classnames from 'classnames';
import { useCallback, useMemo } from 'react';
import { useActiveRequest } from '../hooks/useActiveRequest';
import { useKeyValue } from '../hooks/useKeyValue';
import { useUpdateRequest } from '../hooks/useUpdateRequest';
import { tryFormatJson } from '../lib/formatters';
import type { HttpHeader, HttpRequest } from '../lib/models';
import { HttpRequestBodyType } from '../lib/models';
import { Editor } from './core/Editor';
import type { TabItem } from './core/Tabs/Tabs';
import { TabContent, Tabs } from './core/Tabs/Tabs';
import { GraphQLEditor } from './GraphQLEditor';
import { HeaderEditor } from './HeaderEditor';
import { ParametersEditor } from './ParameterEditor';
import { UrlBar } from './UrlBar';

interface Props {
  fullHeight: boolean;
  className?: string;
}

export function RequestPane({ fullHeight, className }: Props) {
  const activeRequest = useActiveRequest();
  const activeRequestId = activeRequest?.id ?? null;
  const updateRequest = useUpdateRequest(activeRequestId);
  const activeTab = useKeyValue<string>({
    key: ['active_request_body_tab'],
    defaultValue: 'body',
  });

  const tabs: TabItem<HttpRequest['bodyType']>[] = useMemo(
    () => [
      {
        value: 'body',
        label: activeRequest?.bodyType ?? 'No Body',
        options: {
          onChange: (bodyType: HttpRequest['bodyType']) => {
            const patch: Partial<HttpRequest> = { bodyType };
            if (bodyType == HttpRequestBodyType.GraphQL) {
              patch.method = 'POST';
            }
            updateRequest.mutate(patch);
          },
          value: activeRequest?.bodyType ?? null,
          items: [
            { label: 'No Body', value: null },
            { label: 'JSON', value: HttpRequestBodyType.JSON },
            { label: 'XML', value: HttpRequestBodyType.XML },
            { label: 'GraphQL', value: HttpRequestBodyType.GraphQL },
          ],
        },
      },
      { value: 'params', label: 'Params' },
      { value: 'headers', label: 'Headers' },
      { value: 'auth', label: 'Auth' },
    ],
    [activeRequest?.bodyType ?? 'n/a'],
  );

  const handleBodyChange = useCallback((body: string) => updateRequest.mutate({ body }), []);
  const handleHeadersChange = useCallback(
    (headers: HttpHeader[]) => updateRequest.mutate({ headers }),
    [],
  );

  return (
    <div className={classnames(className, 'py-3 grid grid-rows-[auto_minmax(0,1fr)] grid-cols-1')}>
      {activeRequest && (
        <>
          <UrlBar
            className="pl-3"
            id={activeRequest.id}
            url={activeRequest.url}
            method={activeRequest.method}
          />
          <Tabs
            value={activeTab.value}
            onChangeValue={activeTab.set}
            tabs={tabs}
            className="mt-2"
            tabListClassName="pl-3"
            label="Request body"
          >
            <TabContent value="auth">
              <div className="flex items-center justify-center min-h-[5rem]">
                <header>Hello</header>
              </div>
            </TabContent>
            <TabContent value="headers">
              <HeaderEditor
                key={activeRequestId}
                headers={activeRequest.headers}
                onChange={handleHeadersChange}
              />
            </TabContent>
            <TabContent value="params">
              <ParametersEditor key={activeRequestId} parameters={[]} onChange={() => null} />
            </TabContent>
            <TabContent value="body" className="pl-3 mt-1">
              {activeRequest.bodyType === HttpRequestBodyType.JSON ? (
                <Editor
                  key={activeRequest.id}
                  useTemplating
                  placeholder="..."
                  className="!bg-gray-50"
                  heightMode={fullHeight ? 'full' : 'auto'}
                  defaultValue={activeRequest.body ?? ''}
                  contentType="application/json"
                  onChange={handleBodyChange}
                  format={(v) => tryFormatJson(v)}
                />
              ) : activeRequest.bodyType === HttpRequestBodyType.XML ? (
                <Editor
                  key={activeRequest.id}
                  useTemplating
                  placeholder="..."
                  className="!bg-gray-50"
                  heightMode={fullHeight ? 'full' : 'auto'}
                  defaultValue={activeRequest.body ?? ''}
                  contentType="text/xml"
                  onChange={handleBodyChange}
                />
              ) : activeRequest.bodyType === HttpRequestBodyType.GraphQL ? (
                <GraphQLEditor
                  key={activeRequest.id}
                  className="!bg-gray-50"
                  defaultValue={activeRequest?.body ?? ''}
                  onChange={handleBodyChange}
                />
              ) : (
                <div className="h-full text-gray-400 flex items-center justify-center">No Body</div>
              )}
            </TabContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
