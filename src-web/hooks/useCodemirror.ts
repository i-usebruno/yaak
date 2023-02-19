import { useEffect, useRef, useState } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { html } from '@codemirror/lang-html';
import { EditorState } from '@codemirror/state';
import { tags } from '@lezer/highlight';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';

const myHighlightStyle = HighlightStyle.define([
  {
    tag: [tags.documentMeta, tags.blockComment, tags.lineComment, tags.docComment, tags.comment],
    color: '#757b93',
  },
  { tag: tags.name, color: '#4dafff' },
  { tag: tags.variableName, color: '#4bff4e' },
  { tag: tags.attributeName, color: '#b06fff' },
  { tag: tags.attributeValue, color: '#ff964b' },
  { tag: [tags.keyword, tags.string], color: '#fc6' },
  { tag: tags.comment, color: '#f5d', fontStyle: 'italic' },
]);

const syntaxExtensions = {
  'application/json': json(),
  'application/javascript': javascript(),
  'text/html': html(),
};

const extensions = [basicSetup, syntaxHighlighting(myHighlightStyle)];
export type EditorLanguage = keyof typeof syntaxExtensions;

export default function useCodeMirror({
  value,
  language,
}: {
  value: string;
  language: EditorLanguage;
}) {
  const [cm, setCm] = useState<EditorView | null>(null);
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current === null) return;

    const view = new EditorView({
      extensions: [...extensions, syntaxExtensions[language]],
      parent: ref.current,
    });

    setCm(view);

    return () => view?.destroy();
  }, [ref.current]);

  useEffect(() => {
    if (cm === null) return;

    const newState = EditorState.create({
      doc: value,
      extensions: [...extensions, syntaxExtensions[language]],
    });
    cm.setState(newState);
  }, [cm, value]);

  return { ref, cm };
}
