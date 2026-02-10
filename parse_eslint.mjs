import { readFileSync } from 'fs';

const input = readFileSync(0, 'utf8');
let currentFile = '';
for (const line of input.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('C:') && trimmed.length > 3 && !trimmed.startsWith('  ')) {
    currentFile = trimmed;
  } else {
    const match = trimmed.match(/^(\d+:\d+)\s+warning\s+(.+?)\s{2,}(@\S+)/);
    if (match) {
      const short = currentFile.split('portal-lusitano').pop() || currentFile;
      console.log(short.replace(/^\\/,'') + ':' + match[1] + ' | ' + match[2].trim());
    }
  }
}
