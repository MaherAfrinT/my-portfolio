import re

with open('/mnt/PROJECTS/my-portfolio/src/pages/public/WorkPage.jsx', 'r') as f:
    content = f.read()

replacements = {
    'text-slate-200': 'text-slate-900 dark:text-slate-200',
    'text-slate-400': 'text-slate-600 dark:text-slate-400',
    'text-slate-500': 'text-slate-500 dark:text-slate-400',
    
    # Navigation lines
    "'w-16 bg-slate-200'": "'w-16 bg-slate-900 dark:bg-slate-200'",
    "'w-8 bg-slate-600 group-hover:w-16 group-hover:bg-slate-200'": "'w-8 bg-slate-300 dark:bg-slate-600 group-hover:w-16 group-hover:bg-slate-900 dark:group-hover:bg-slate-200'",
    
    # Navigation text
    "'text-slate-500 group-hover:text-slate-200'": "'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'",
    
    # Links and accents
    'text-cyan-400': 'text-cyan-600 dark:text-cyan-400',
    'text-cyan-300': 'text-cyan-700 dark:text-cyan-300',
    'hover:text-cyan-300': 'hover:text-cyan-600 dark:hover:text-cyan-300',
    'focus-visible:text-cyan-300': 'focus-visible:text-cyan-600 dark:focus-visible:text-cyan-300',
    
    'bg-cyan-400/10': 'bg-cyan-50 dark:bg-cyan-400/10',
    'bg-cyan-500/20': 'bg-cyan-100 dark:bg-cyan-500/20',
    
    # Backgrounds and borders
    'bg-slate-900/75': 'bg-white/75 dark:bg-slate-900/75',
    'lg:group-hover:bg-slate-800/50': 'lg:group-hover:bg-slate-100 dark:lg:group-hover:bg-slate-800/50',
    'bg-slate-800/20': 'bg-slate-50 dark:bg-slate-800/20',
    'bg-slate-800': 'bg-slate-100 dark:bg-slate-800',
    'border-slate-700/50': 'border-slate-200 dark:border-slate-700/50',
    'text-slate-300': 'text-slate-700 dark:text-slate-300',
    'border-slate-200/10': 'border-slate-200 dark:border-slate-700',
    'group-hover:border-slate-200/30': 'group-hover:border-slate-300 dark:group-hover:border-slate-500',
}

for old, new in replacements.items():
    content = content.replace(old, new)

# Cleanup double dark variants if any
content = content.replace('text-slate-900 dark:text-slate-900 dark:text-slate-200', 'text-slate-900 dark:text-slate-200')
content = content.replace('text-slate-500 dark:text-slate-500 dark:text-slate-400', 'text-slate-500 dark:text-slate-400')
content = content.replace('text-cyan-600 dark:text-cyan-600 dark:text-cyan-400', 'text-cyan-600 dark:text-cyan-400')
content = content.replace('text-cyan-700 dark:text-cyan-700 dark:text-cyan-300', 'text-cyan-700 dark:text-cyan-300')
content = content.replace('hover:text-cyan-600 dark:hover:text-cyan-600 dark:hover:text-cyan-300', 'hover:text-cyan-600 dark:hover:text-cyan-300')
content = content.replace('focus-visible:text-cyan-600 dark:focus-visible:text-cyan-600 dark:focus-visible:text-cyan-300', 'focus-visible:text-cyan-600 dark:focus-visible:text-cyan-300')
content = content.replace('bg-cyan-50 dark:bg-cyan-50 dark:bg-cyan-400/10', 'bg-cyan-50 dark:bg-cyan-400/10')
content = content.replace('bg-cyan-100 dark:bg-cyan-100 dark:bg-cyan-500/20', 'bg-cyan-100 dark:bg-cyan-500/20')
content = content.replace('bg-white/75 dark:bg-white/75 dark:bg-slate-900/75', 'bg-white/75 dark:bg-slate-900/75')
content = content.replace('bg-slate-100 dark:bg-slate-100 dark:bg-slate-800', 'bg-slate-100 dark:bg-slate-800')

with open('/mnt/PROJECTS/my-portfolio/src/pages/public/WorkPage.jsx', 'w') as f:
    f.write(content)
