/**
 * @returns {Promise<{
 * name: string,
 * picture: string,
 * sid: string,
 * email: string}>}
 */
export async function _getMe() {
  let me = await fetch('/api/info/me').catch(console.warn);
  if (me.ok) {
    me = await me.json();
    if (me?.user) return me.user || me;
  }
  return;
}
