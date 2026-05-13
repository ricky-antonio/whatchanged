import { Button } from '@/components/ui/button'

interface Props {
  label: 'Original' | 'Changed'
  value: string
  placeholder: string
  onChange: (value: string) => void
  onSample: () => void
}

const labelStyle = {
  Original: {
    dot: 'bg-orange-400',
    text: 'text-orange-600 dark:text-orange-400',
  },
  Changed: {
    dot: 'bg-cyan-400',
    text: 'text-cyan-600 dark:text-cyan-400',
  },
}

export function EditorPane({ label, value, placeholder, onChange, onSample }: Props) {
  const style = labelStyle[label]

  return (
    <div className="flex flex-col flex-[2] min-h-0 min-w-0">
      <div className="px-5 py-3 flex items-center gap-2 border-b border-border bg-card shrink-0">
        <span className={`h-2 w-2 rounded-full shrink-0 ${style.dot}`} />
        <span className={`text-xs font-bold uppercase tracking-widest ${style.text}`}>
          {label}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSample}
          className="ml-auto h-5 px-2 text-[10px] text-muted-foreground hover:text-foreground"
        >
          sample
        </Button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className="flex-1 resize-none font-mono text-sm px-5 py-4 bg-background text-foreground focus:outline-none placeholder:text-muted-foreground/40 min-h-0"
      />
    </div>
  )
}
