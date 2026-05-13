import { Button } from '@/components/ui/button'

interface Props {
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
  onSample: () => void
}

export function EditorPane({ label, value, placeholder, onChange, onSample }: Props) {
  return (
    <div className="flex flex-col flex-1 min-w-0 border border-border rounded-md overflow-hidden">
      <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30 shrink-0">
        {label}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className="flex-1 resize-none font-mono text-sm p-3 bg-background text-foreground focus:outline-none"
      />
      <div className="px-3 py-2 border-t border-border bg-muted/30 shrink-0 flex justify-end">
        <Button variant="ghost" size="sm" onClick={onSample} className="text-xs">
          Sample
        </Button>
      </div>
    </div>
  )
}
