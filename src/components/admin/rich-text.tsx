"use client";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Heading2, Heading3, ImagePlus, Italic, Link2, List, ListOrdered, Loader2, Quote, Redo2, Undo2, Video } from "lucide-react";
import { useRef, useState } from "react";
import { uploadImage } from "./fields";

function Btn({ on, active, label, children, disabled }: { on: () => void; active?: boolean; label: string; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={on}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`rounded-lg p-2 transition-colors disabled:opacity-30 ${active ? "bg-emerald-soft text-emerald" : "hover:bg-sunken"}`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const file = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onImage(f?: File) {
    if (!f) return;
    setBusy(true);
    try {
      const src = await uploadImage(f, "articles");
      editor.chain().focus().setImage({ src, alt: "" }).run();
    } catch (e) {
      alert(`Unggah gagal: ${(e as Error).message}`);
    } finally {
      setBusy(false);
      if (file.current) file.current.value = "";
    }
  }

  function onLink() {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Alamat tautan (kosongkan untuk menghapus):", prev ?? "https://");
    if (url === null) return;
    if (url === "") editor.chain().focus().unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function onYoutube() {
    const url = window.prompt("Tempel tautan video YouTube:");
    const id = url?.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)?.[1];
    if (!id) return;
    editor
      .chain()
      .focus()
      .insertContent(`<p><a href="https://www.youtube.com/watch?v=${id}">Tonton video di YouTube</a></p>`)
      .run();
  }

  return (
    <div className="sticky top-0 z-10 flex flex-wrap gap-0.5 border-b border-line bg-surface p-1.5">
      <Btn label="Judul bagian" on={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
        <Heading2 className="size-4" />
      </Btn>
      <Btn label="Subjudul" on={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
        <Heading3 className="size-4" />
      </Btn>
      <Btn label="Tebal" on={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
        <Bold className="size-4" />
      </Btn>
      <Btn label="Miring" on={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
        <Italic className="size-4" />
      </Btn>
      <Btn label="Daftar poin" on={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
        <List className="size-4" />
      </Btn>
      <Btn label="Daftar bernomor" on={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
        <ListOrdered className="size-4" />
      </Btn>
      <Btn label="Kutipan" on={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
        <Quote className="size-4" />
      </Btn>
      <Btn label="Tautan" on={onLink} active={editor.isActive("link")}>
        <Link2 className="size-4" />
      </Btn>
      <Btn label="Sisipkan gambar" on={() => file.current?.click()} disabled={busy}>
        {busy ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
      </Btn>
      <Btn label="Sisipkan tautan YouTube" on={onYoutube}>
        <Video className="size-4" />
      </Btn>
      <span className="mx-1 w-px self-stretch bg-line" />
      <Btn label="Batalkan" on={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        <Undo2 className="size-4" />
      </Btn>
      <Btn label="Ulangi" on={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        <Redo2 className="size-4" />
      </Btn>
      <input ref={file} type="file" accept="image/*" hidden onChange={(e) => onImage(e.target.files?.[0])} />
    </div>
  );
}

export function RichText({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: false }),
      Image,
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: "Tulis isi artikel di sini…" }),
    ],
    content: value,
    editorProps: { attributes: { class: "prose-asa max-w-none px-5 py-4" } },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface focus-within:border-emerald">
      {editor ? <Toolbar editor={editor} /> : <div className="h-[45px] border-b border-line" />}
      <EditorContent editor={editor} />
    </div>
  );
}
