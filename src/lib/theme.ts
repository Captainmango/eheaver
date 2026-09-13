export function toggleTheme(event: Event) {
  event.preventDefault();
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', newTheme);
  }
}
