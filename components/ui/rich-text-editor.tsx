'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered, Link as LinkIcon, RemoveFormatting } from 'lucide-react'
import { Button } from './button'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-[var(--border)] bg-[var(--muted)]/30 rounded-t-lg items-center">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`h-8 w-8 rounded-md ${editor.isActive('bold') ? 'bg-[#5483B3]/20 text-[#5483B3]' : 'text-[var(--muted-foreground)]'}`}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`h-8 w-8 rounded-md ${editor.isActive('italic') ? 'bg-[#5483B3]/20 text-[#5483B3]' : 'text-[var(--muted-foreground)]'}`}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={`h-8 w-8 rounded-md ${editor.isActive('underline') ? 'bg-[#5483B3]/20 text-[#5483B3]' : 'text-[var(--muted-foreground)]'}`}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`h-8 w-8 rounded-md ${editor.isActive('strike') ? 'bg-[#5483B3]/20 text-[#5483B3]' : 'text-[var(--muted-foreground)]'}`}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-5 bg-[var(--border)] mx-1" />
      
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`h-8 w-8 rounded-md ${editor.isActive('bulletList') ? 'bg-[#5483B3]/20 text-[#5483B3]' : 'text-[var(--muted-foreground)]'}`}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`h-8 w-8 rounded-md ${editor.isActive('orderedList') ? 'bg-[#5483B3]/20 text-[#5483B3]' : 'text-[var(--muted-foreground)]'}`}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <div className="w-px h-5 bg-[var(--border)] mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={setLink}
        className={`h-8 w-8 rounded-md ${editor.isActive('link') ? 'bg-[#5483B3]/20 text-[#5483B3]' : 'text-[var(--muted-foreground)]'}`}
      >
        <LinkIcon className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        className="h-8 w-8 rounded-md text-[var(--muted-foreground)] ml-auto"
        title="Hapus Format"
      >
        <RemoveFormatting className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      // Return HTML output
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[150px] p-4 text-[var(--foreground)]',
      },
    },
  })

  // Update editor content if value changes externally (e.g. form reset)
  if (editor && value !== editor.getHTML() && !editor.isFocused) {
    editor.commands.setContent(value)
  }

  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm flex flex-col focus-within:border-[#5483B3] focus-within:ring-1 focus-within:ring-[#5483B3] transition-all">
      <MenuBar editor={editor} />
      <div className="bg-[var(--background)] cursor-text" onClick={() => editor?.commands.focus()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
