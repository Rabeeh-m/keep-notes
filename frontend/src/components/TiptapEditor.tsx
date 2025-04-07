
"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { FaBold, FaItalic, FaUnderline, FaAlignLeft, FaAlignCenter, FaAlignRight, FaPaintBrush } from 'react-icons/fa';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, 
      }),
      TextStyle,
      Color.configure({ types: ['textStyle'] }),
      Underline,
      TextAlign.configure({
        types: ['paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[100px] p-3 bg-white text-black border border-gray-600 rounded-lg focus:outline-none prose max-w-none',
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="space-y-1">
      {/* Compact and Attractive Toolbar */}
      <div className="flex items-center gap-1 bg-gray-200 p-1 rounded-md border border-black shadow-sm">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-1 rounded ${editor.isActive('bold') ? 'bg-black text-white' : 'bg-white text-black'} hover:bg-gray-300 transition-colors`}
        >
          <FaBold className="text-sm" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-1 rounded ${editor.isActive('italic') ? 'bg-black text-white' : 'bg-white text-black'} hover:bg-gray-300 transition-colors`}
        >
          <FaItalic className="text-sm" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={`p-1 rounded ${editor.isActive('underline') ? 'bg-black text-white' : 'bg-white text-black'} hover:bg-gray-300 transition-colors`}
        >
          <FaUnderline className="text-sm" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-1 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-black text-white' : 'bg-white text-black'} hover:bg-gray-300 transition-colors`}
        >
          <FaAlignLeft className="text-sm" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-1 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-black text-white' : 'bg-white text-black'} hover:bg-gray-300 transition-colors`}
        >
          <FaAlignCenter className="text-sm" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-1 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-black text-white' : 'bg-white text-black'} hover:bg-gray-300 transition-colors`}
        >
          <FaAlignRight className="text-sm" />
        </button>
        <div className="flex items-center gap-1 ml-2">
          <FaPaintBrush className="text-black text-sm" />
          <input
            type="color"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            className="w-6 h-6 p-0 border-none bg-transparent cursor-pointer"
          />
        </div>
      </div>
      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}