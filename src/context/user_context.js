import { createContext } from 'react';

/**
 * @type {React.Context<{
 * isLoading: true,
 * name: string,
 * picture: string,
 * sid: string,
 * email: string,
 * setUser:Function}>}
 */
export const User = createContext({ isLoading: true });
