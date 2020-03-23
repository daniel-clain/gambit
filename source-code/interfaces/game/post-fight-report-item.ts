export interface PostFightReportItem{
  message: string;
  type: PostFightReportType
}

type PostFightReportType = 
'employee hired' |
'employee outcome' |
'fight bet result'