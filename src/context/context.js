import { createContext } from 'react';

/**
 * @type {React.Context<{
 * isLoading: boolean,
 * uuid:string,
 * name: string,
 * picture: string,
 * email: string,
 * setUser:Function,
 * refresh:Function
 * }>}
 */
export const User = createContext({ isLoading: true, online: false });

/**
 * @type {React.Context<{
 *        online: boolean,
 *        isConnected: boolean,
 *        send: Function,
 *        messageNav: any,
 *        messageMain:{data:string,
 *              touuid:string,
 *              fromuuid:string,
 *              type:string,
 *              category:string,
 *              update:string},        
 *              setMessageMain:function,
 *              setMessageNav :function,
 * }>}
 */
export const Sync = createContext({ isConnected: false });
