/** Skrip sebelum hidrasi: lewati splash bila sudah tampil di sesi ini. */
export const splashGuardScript = `try{if(sessionStorage.getItem('asa:splashed'))document.documentElement.classList.add('no-splash')}catch(e){}`;
