export interface GenerateReportQueue {
  publish<T>(payload: T): Promise<void>
}
