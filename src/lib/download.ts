// Opens the résumé PDF (served from /public) in the browser's built-in PDF viewer.
// A new tab is used rather than an embedded viewer because mobile browsers
// (iOS Safari, Android Chrome) cannot render PDFs inside an <iframe>.

export const PDF_FILE_NAME = 'Abu_Naser_Arman_Resume.pdf';
export const PDF_URL = `${import.meta.env.BASE_URL}Abu_Naser_Arman_Resume.pdf`;

export function viewResume(): void {
  // Must run synchronously inside the click handler, or popup blockers stop it.
  // (No 'noopener' feature: it makes window.open always return null, hiding a blocked popup.)
  const tab = window.open(PDF_URL, '_blank');
  if (tab) {
    tab.opener = null; // same protection as noopener
  } else {
    // Popup blocked: open it in the current tab instead.
    window.location.href = PDF_URL;
  }
}
