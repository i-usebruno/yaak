import { useCallback, useMemo } from 'react';
import type { HttpRequest } from '@yaakapp-internal/models';
import type { Pair, PairEditorProps } from './core/PairEditor';
import { PairEditor } from './core/PairEditor';

type Props = {
  forceUpdateKey: string;
  body: HttpRequest['body'];
  onChange: (body: HttpRequest['body']) => void;
};

export function FormMultipartEditor({ body, forceUpdateKey, onChange }: Props) {
  const pairs = useMemo<Pair[]>(
    () =>
      (Array.isArray(body.form) ? body.form : []).map((p) => ({
        enabled: p.enabled,
        name: p.name,
        value: p.file ?? p.value,
        contentType: p.contentType,
        isFile: !!p.file,
      })),
    [body.form],
  );

  const handleChange = useCallback<PairEditorProps['onChange']>(
    (pairs) =>
      onChange({
        form: pairs.map((p) => ({
          enabled: p.enabled,
          name: p.name,
          contentType: p.contentType,
          file: p.isFile ? p.value : undefined,
          value: p.isFile ? undefined : p.value,
        })),
      }),
    [onChange],
  );

  return (
    <PairEditor
      valueAutocompleteVariables
      nameAutocompleteVariables
      allowFileValues
      pairs={pairs}
      onChange={handleChange}
      forceUpdateKey={forceUpdateKey}
    />
  );
}
