import re

file_path = 'app/page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Split content at STUDENT VIEW
parts = content.split('/* ═══ STUDENT VIEW ═══ */')
if len(parts) < 2:
    print("Could not find STUDENT VIEW marker.")
    exit(1)

head = parts[0]
tail = '/* ═══ STUDENT VIEW ═══ */' + parts[1]

replacements = {
    # primary button
    'bg-gradient-to-r from-[#6c63ff] to-[#5a52e0] text-white': 'bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-[#0A0F1A]',
    'bg-[#6c63ff] text-white': 'bg-[#D4AF37] text-[#0A0F1A]',
    
    # general backgrounds
    'bg-gradient-to-br from-slate-50 via-white to-[#6c63ff]/5': 'bg-[#0A0F1A]',
    'bg-white/95': 'bg-[#121626]/90',
    'bg-white/80': 'bg-[#121626]/80',
    'bg-white/60': 'bg-[#121626]/60',
    'bg-white': 'bg-[#121626]',
    'bg-slate-50': 'bg-[#0A0F1A]',
    'bg-slate-100': 'bg-[#1A2235]',
    
    # borders
    'border-slate-100/50': 'border-[#D4AF37]/20',
    'border-slate-100/80': 'border-[#D4AF37]/20',
    'border-slate-100': 'border-[#D4AF37]/20',
    'border-slate-200': 'border-[#D4AF37]/30',
    'border-[#6c63ff]': 'border-[#D4AF37]',
    'border-[#6c63ff]/10': 'border-[#D4AF37]/20',
    
    # text colors
    'text-slate-800': 'text-white',
    'text-slate-700': 'text-slate-100',
    'text-slate-600': 'text-slate-200',
    'text-slate-500': 'text-slate-300',
    'text-slate-400': 'text-slate-400',
    'text-slate-300': 'text-[#D4AF37]/70',
    'text-[#6c63ff]': 'text-[#D4AF37]',
    'text-slate-200': 'text-slate-500', 
    
    # purple backgrounds and rings
    'bg-[#6c63ff]': 'bg-[#D4AF37]',
    'bg-[#6c63ff]/5': 'bg-[#D4AF37]/5',
    'bg-[#6c63ff]/10': 'bg-[#D4AF37]/10',
    'bg-[#6c63ff]/20': 'bg-[#D4AF37]/20',
    'bg-[#6c63ff]/30': 'bg-[#D4AF37]/30',
    'from-[#6c63ff]': 'from-[#D4AF37]',
    'to-[#5a52e0]': 'to-[#C5A059]',
    'from-[#6c63ff]/5': 'from-[#D4AF37]/5',
    'to-[#6c63ff]/10': 'to-[#D4AF37]/10',
    'shadow-[#6c63ff]/20': 'shadow-[#D4AF37]/20',
    'shadow-[#6c63ff]/25': 'shadow-[#D4AF37]/20',
    'ring-[#6c63ff]': 'ring-[#D4AF37]',
    'ring-[#6c63ff]/20': 'ring-[#D4AF37]/20',
    'ring-[#6c63ff]/30': 'ring-[#D4AF37]/30',
    'accent-[#6c63ff]': 'accent-[#D4AF37]',

    # table header gradient
    'from-slate-50': 'from-[#121626]',
    'via-white': 'via-[#121626]/80',
    
    # alert/state colors -> muted elegant colors
    'bg-red-50': 'bg-[#E0BFB8]/10',
    'text-red-500': 'text-[#E0BFB8]',
    'text-red-400': 'text-[#E0BFB8]',
    
    'bg-amber-50': 'bg-[#D4AF37]/10',
    'text-amber-500': 'text-[#D4AF37]',
    'text-amber-600': 'text-[#D4AF37]',
    
    'bg-blue-50': 'bg-[#D4AF37]/10',
    'text-blue-600': 'text-[#D4AF37]',
    
    'bg-green-50': 'bg-[#A3B899]/10',
    'text-green-600': 'text-[#A3B899]',
    
    # Specific layout texts that should be changed to Playfair or matching 
    'className="text-xl font-bold"': 'className="text-xl font-semibold tracking-wide text-[#D4AF37]" style={{ fontFamily: "var(--font-playfair), serif" }}',
    'className="text-lg font-bold"': 'className="text-lg font-semibold tracking-wide text-[#FFFFFF]" style={{ fontFamily: "var(--font-playfair), serif" }}',
    
    # Ensure text is not accidentally black on dark backgrounds
    'text-black': 'text-[#0A0F1A]'
}

# Apply replacements to the tail
for old, new in replacements.items():
    tail = tail.replace(old, new)

# Write back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(head + tail)

print("Updated page.tsx successfully.")
