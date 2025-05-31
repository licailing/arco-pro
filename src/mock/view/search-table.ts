import Mock from 'mockjs';
import qs from 'query-string';
import { successResponseWrap } from '@/utils/setup-mock';
import dayjs from 'dayjs';

interface ListItem {
  id: number;
  number: string;
  name: string;
  contentType: string;
  count: string;
  status: number;
  filterType: string;
  createdTime: string;
}

const { Random } = Mock;
let i = 156;
const policys = Mock.mock({
  'list|155': [
    {
      'id|+1': 1,
      // 'id|8': /[A-Z][a-z][-][0-9]/,
      'number|2-3': /[0-9]/,
      'name|4-8': /[A-Z]/,
      'contentType|1': ['img', 'horizontalVideo', 'verticalVideo'],
      'count|2-3': /[0-9]/,
      'status|1': [1, 0],
      'filterType|1': ['artificial', 'rules'],
      'createdTime': Random.datetime(),
    },
  ],
});
function getPolicy({ query }: any) {
  const p = (query.current as number) || 1;
  const ps = (query.pageSize as number) || 20;

  let dataSource: ListItem[] = policys.list;

  if (query.sorter) {
    const s = query.sorter.split('.');
    dataSource = dataSource.sort((prev: any, next: any) => {
      if (s[1] === 'desc') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (query.keyword) {
    dataSource = dataSource.filter(
      (data) =>
        data.number.includes(query.keyword || '') ||
        data.name.includes(query.keyword || '')
    );
  }

  if (query.number) {
    dataSource = dataSource.filter((data) =>
      data.number.includes(query.number || '')
    );
  }

  if (query.name) {
    dataSource = dataSource.filter((data) =>
      data.name.includes(query.name || '')
    );
  }

  if (query.contentType) {
    dataSource = dataSource.filter((data) =>
      data.contentType.includes(query.contentType || '')
    );
  }

  if (query.filterType) {
    dataSource = dataSource.filter((data) =>
      data.filterType.includes(query.filterType || '')
    );
  }

  if (query.createdTime) {
    dataSource = dataSource.filter(
      (data) =>
        dayjs(data.createdTime) > dayjs(query.createdTime[0]) &&
        dayjs(data.createdTime) < dayjs(query.createdTime[1])
    );
  }

  if (query.status) {
    dataSource = dataSource.filter((data) => data.status === query.status);
  }

  const result = {
    list: dataSource.slice((p - 1) * ps, p * ps),
    total: dataSource.length,
  };

  return successResponseWrap(result);
}

function updatePolicy({ body }: any) {
  const { id } = body as ListItem;

  if (id) {
    // 编辑
    policys.list = policys.list.map((item: ListItem) => {
      if (item.id === id) {
        return {
          ...item,
          ...body,
        };
      }
      return item;
    });
  } else {
    // 新增
    policys.list.unshift({
      id: `${i}`,
      ...body,
    });
    i += 1;
  }
  return successResponseWrap('ok');
}

function deletePolicy({ query }) {
  if (!query.ids) {
    return successResponseWrap('ok');
  }
  const ids = query.ids.split(',');
  policys.list = policys.list.filter(
    (item: ListItem) => !ids.includes(`${item.id}`)
  );
  return successResponseWrap('ok');
}
export default [
  {
    url: '/api/list/policy',
    method: 'get',
    response: getPolicy,
  },
  {
    url: '/api/policy/edit',
    method: 'post',
    response: updatePolicy,
  },
  {
    url: '/api/policy/delete',
    method: 'get',
    response: deletePolicy,
  },
];
