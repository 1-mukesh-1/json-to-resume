/**
 * Download JSON as file
 */
export function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate filename for resume export
 */
export function generateFilename(resume) {
  const company = resume.company || 'unknown';
  const role = resume.role || 'resume';
  const date = new Date().toISOString().split('T')[0];
  return `${company}_${role}_${date}.json`.replace(/\s+/g, '_').toLowerCase();
}

/**
 * Read JSON file and parse
 */
export function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (err) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}