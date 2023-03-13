import classnames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { useDeleteAllResponses, useDeleteResponse, useResponses } from '../hooks/useResponses';
import { tryFormatJson } from '../lib/formatters';
import { Dropdown } from './Dropdown';
import { Editor } from './Editor';
import { Icon } from './Icon';
import { IconButton } from './IconButton';
import { HStack } from './Stacks';
import { StatusColor } from './StatusColor';
import { Webview } from './Webview';

interface Props {
  requestId: string;
  className?: string;
}

export function ResponsePane({ requestId, className }: Props) {
  const [activeResponseId, setActiveResponseId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'pretty' | 'raw'>('pretty');
  const responses = useResponses(requestId);
  const response = activeResponseId
    ? responses.data.find((r) => r.id === activeResponseId)
    : responses.data[responses.data.length - 1];
  const deleteResponse = useDeleteResponse(response);
  const deleteAllResponses = useDeleteAllResponses(response?.requestId);

  useEffect(() => {
    setActiveResponseId(null);
  }, [responses.data?.length]);

  const contentType = useMemo(
    () =>
      response?.headers.find((h) => h.name.toLowerCase() === 'content-type')?.value ?? 'text/plain',
    [response],
  );

  if (!response) {
    return null;
  }

  return (
    <div className="p-2">
      <div
        className={classnames(
          className,
          'max-h-full h-full grid grid-rows-[auto_minmax(0,1fr)] grid-cols-1 ',
          'dark:bg-gray-100 rounded-md overflow-hidden border border-gray-200',
          'shadow shadow-gray-100 dark:shadow-gray-0',
        )}
      >
        {/*<HStack as={WindowDragRegion} items="center" className="pl-1.5 pr-1">*/}
        {/*</HStack>*/}
        {response && (
          <>
            <HStack
              alignItems="center"
              className="italic text-gray-700 text-sm w-full mb-1 flex-shrink-0 pl-2"
            >
              {response.status > 0 && (
                <div className="whitespace-nowrap">
                  <StatusColor statusCode={response.status}>
                    {response.status}
                    {response.statusReason && ` ${response.statusReason}`}
                  </StatusColor>
                  &nbsp;&bull;&nbsp;
                  {response.elapsed}ms &nbsp;&bull;&nbsp;
                  {Math.round(response.body.length / 1000)} KB
                </div>
              )}

              <HStack alignItems="center" className="ml-auto h-8">
                <IconButton
                  icon={viewMode === 'pretty' ? 'eye' : 'code'}
                  size="sm"
                  className="ml-1"
                  onClick={() => setViewMode((m) => (m === 'pretty' ? 'raw' : 'pretty'))}
                />
                <Dropdown
                  items={[
                    {
                      label: 'Clear Response',
                      onSelect: deleteResponse.mutate,
                      disabled: responses.data.length === 0,
                    },
                    {
                      label: 'Clear All Responses',
                      onSelect: deleteAllResponses.mutate,
                      disabled: responses.data.length === 0,
                    },
                    '-----',
                    ...responses.data.slice(0, 10).map((r) => ({
                      label: r.status + ' - ' + r.elapsed + ' ms',
                      leftSlot: response?.id === r.id ? <Icon icon="check" /> : <></>,
                      onSelect: () => setActiveResponseId(r.id),
                    })),
                  ]}
                >
                  <IconButton icon="clock" className="ml-auto" size="sm" />
                </Dropdown>
              </HStack>
            </HStack>

            {response?.error ? (
              <div className="p-1">
                <div className="text-white bg-red-500 px-3 py-2 rounded">{response.error}</div>
              </div>
            ) : viewMode === 'pretty' && contentType.includes('html') ? (
              <Webview body={response.body} contentType={contentType} url={response.url} />
            ) : viewMode === 'pretty' && contentType.includes('json') ? (
              <Editor
                readOnly
                key={`${contentType}:${response.updatedAt}:pretty`}
                className="bg-gray-50 dark:!bg-gray-100"
                defaultValue={tryFormatJson(response?.body)}
                contentType={contentType}
              />
            ) : response?.body ? (
              <Editor
                readOnly
                key={`${contentType}:${response.updatedAt}`}
                className="bg-gray-50 dark:!bg-gray-100"
                defaultValue={response?.body}
                contentType={contentType}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
