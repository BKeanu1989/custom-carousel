export type singleBreakPoint = {
    itemsToShow: number,
}
  
export interface BreakPoint {
    [breakPoint: string]: singleBreakPoint  
}

