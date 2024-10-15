/**
 * pases socket message [if possible json.parse]
 * @param {string} message socket message
 * @returns {{err,
 * data,
 * pathes:[root:string, type:string, category:string, touuid:string, fromuuid:string]}}
 */
export function parseSocketMessage(message, uuid) {
  if (!(message.startsWith('{') || message.startsWith('[')))
    return { err: null, data: uuid ? null : message, pathes: [] };
  let { data, path } = JSON.parse(message);
  if (!(path && data))
    // return console.warn('no path or data');
    return { err: null, data: uuid ? null : message, pathes: [] };
  let pathes = path.replace(/^\//, '').split('/');
  let [root, type, category, touuid, fromuuid] = pathes;
  if (uuid && fromuuid != uuid) return { err: null, data: null, pathes: [] };
  return {
    err: null,
    data,
    pathes: [root, type, category, touuid, fromuuid],
  };
}
