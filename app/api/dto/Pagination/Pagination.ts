export type PaginationDto<WHERE, SELECT, INCLUDE, ORDERBY> = {
  skip?: number;
  take?: number;
  all?: boolean;
  where?: WHERE;
  select?: SELECT;
  include?: INCLUDE;
  orderBy?: ORDERBY;
  lastSynced?: string;
};
