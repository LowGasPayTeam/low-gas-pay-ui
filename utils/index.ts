export const summaryAddress = (addr: string) => 
  addr ? `${addr.slice(0,2)}...${addr.slice(-4)}` : '';
