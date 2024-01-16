type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = 
  Keys extends keyof T 
    ? Omit<T, Keys> & 
        {[K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>}[Keys] 
    : never;


export default RequireAtLeastOne