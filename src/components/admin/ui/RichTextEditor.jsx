import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Quote, 
  Undo, 
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Unlink,
  Code
} from 'lucide-react';

export default function RichTextEditor({ value = '', onChange, placeholder = 'İçeriğinizi buraya yazın...' }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#7FA34D] underline hover:text-[#8eb85c]',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full my-6 border border-slate-800',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[300px] max-h-[600px] overflow-y-auto px-4 py-3 bg-slate-950 text-slate-300 text-sm leading-relaxed rounded-b-xl border border-t-0 border-slate-800 focus:ring-2 focus:ring-[#7FA34D]/10 focus:border-[#7FA34D]',
      },
    },
  });

  // Sync value prop without cursor jumps
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="animate-pulse bg-slate-950 border border-slate-800 rounded-xl h-[350px]"></div>
    );
  }

  const addLink = () => {
    const url = window.prompt('URL Girin:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Görsel URL Girin:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const btnClass = (active) => `p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
    active ? 'text-[#7FA34D] bg-[#1E4D3A]/30 border border-[#7FA34D]/20' : 'border border-transparent'
  }`;

  return (
    <div className="flex flex-col">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-900 border border-slate-800 rounded-t-xl">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive('bold'))}
          title="Kalın"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive('italic'))}
          title="Eğik"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={btnClass(editor.isActive('code'))}
          title="Kod Satırı"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-800 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={btnClass(editor.isActive('heading', { level: 1 }))}
          title="Başlık 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btnClass(editor.isActive('heading', { level: 2 }))}
          title="Başlık 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-800 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive('bulletList'))}
          title="Sırasız Liste"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive('orderedList'))}
          title="Sıralı Liste"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btnClass(editor.isActive('blockquote'))}
          title="Alıntı"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-800 mx-1"></div>

        <button
          type="button"
          onClick={addLink}
          className={btnClass(editor.isActive('link'))}
          title="Bağlantı Ekle"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        {editor.isActive('link') && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className={btnClass(false)}
            title="Bağlantıyı Kaldır"
          >
            <Unlink className="w-4 h-4 text-red-400" />
          </button>
        )}
        <button
          type="button"
          onClick={addImage}
          className={btnClass(false)}
          title="Görsel Ekle"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-800 mx-1 flex-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={`${btnClass(false)} disabled:opacity-20`}
          title="Geri Al"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={`${btnClass(false)} disabled:opacity-20`}
          title="Yinele"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
      
      {/* Editor CSS overrides for placeholder and visual structure */}
      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #64748b;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror {
          min-height: 300px;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #7FA34D;
          padding-left: 1rem;
          margin: 1.5rem 0;
          color: #94a3b8;
          font-style: italic;
        }
        .ProseMirror h1 {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 1.5rem 0 1rem 0;
          color: #fff;
        }
        .ProseMirror h2 {
          font-size: 1.4rem;
          font-weight: 600;
          margin: 1.5rem 0 1rem 0;
          color: #fff;
        }
        .ProseMirror code {
          background-color: #1e293b;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: monospace;
          color: #e2e8f0;
        }
      `}</style>
    </div>
  );
}
