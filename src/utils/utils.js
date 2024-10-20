/**
 * @returns {Promise<{
 * name: string,
 * picture: string,
 * email: string}>}
 */
export async function _getMe() {
  let me = await fetch('/api/info/me').catch(console.warn);
  if (!me) {
    return {
      online: false,
    };
  }
  if (me.ok) {
    me = await me.json();
    if (me?.user) return me.user || me;
  }
  return;
}

/**
 * scrolles the given element to bottom
 * @param {string} selectors valid dom selector string
 */
export function scroll_bottom(selectors) {
  setTimeout(() => {
    const _element = document.querySelector(selectors);
    _element.scrollTo({
      top: _element.scrollHeight,
      behavior: 'smooth',
    });
  }, 0);
}

/**
 * closes the currentTarget dialog 
 * if(e.target.id == e.currentTarget.id)
 * @param {Event} e dialog click event
 */
export function closeDialog(e) {
  // console.log(e);
  if(e.target.id == e.currentTarget.id)
    e.currentTarget.close();  
}