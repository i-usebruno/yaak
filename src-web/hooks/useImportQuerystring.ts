import { useMutation } from '@tanstack/react-query';
import type { HttpUrlParameter } from '@yaakapp-internal/models';
import { useToast } from '../components/ToastContext';
import { pluralize } from '../lib/pluralize';
import { getHttpRequest } from '../lib/store';
import { useRequestEditor } from './useRequestEditor';
import { useUpdateAnyHttpRequest } from './useUpdateAnyHttpRequest';

export function useImportQuerystring(requestId: string) {
  const updateRequest = useUpdateAnyHttpRequest();
  const toast = useToast();
  const [, { focusParamsTab, forceParamsRefresh, forceUrlRefresh }] = useRequestEditor();

  return useMutation({
    mutationKey: ['import_querystring'],
    mutationFn: async (url: string) => {
      const split = url.split(/\?(.*)/s);
      const baseUrl = split[0] ?? '';
      const querystring = split[1] ?? '';
      if (!querystring) return;

      const request = await getHttpRequest(requestId);
      if (request == null) return;

      const parsedParams = Array.from(new URLSearchParams(querystring).entries());
      const urlParameters: HttpUrlParameter[] = parsedParams.map(([name, value]) => ({
        name,
        value,
        enabled: true,
      }));

      await updateRequest.mutateAsync({
        id: requestId,
        update: {
          url: baseUrl ?? '',
          urlParameters,
        },
      });

      if (urlParameters.length > 0) {
        toast.show({
          id: 'querystring-imported',
          color: 'info',
          message: `Extracted ${urlParameters.length} ${pluralize('parameter', urlParameters.length)} from URL`,
        });
      }

      focusParamsTab();

      // Wait for request to update, then refresh the UI
      // TODO: Somehow make this deterministic
      setTimeout(() => {
        forceUrlRefresh();
        forceParamsRefresh();
      }, 100);
    },
  });
}
