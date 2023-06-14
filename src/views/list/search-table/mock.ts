import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams } from '@/types/global';
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
function getPolicy(options: GetParams) {
  const { url } = options;

  const params = qs.parseUrl(url).query as any;
  const p = (params.current as number) || 1;
  const ps = (params.pageSize as number) || 20;

  let dataSource: ListItem[] = policys.list;

  if (params.sorter) {
    const s = params.sorter.split('.');
    dataSource = dataSource.sort((prev: any, next: any) => {
      if (s[1] === 'desc') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.keyword) {
    dataSource = dataSource.filter(
      (data) =>
        data.number.includes(params.keyword || '') ||
        data.name.includes(params.keyword || '')
    );
  }

  if (params.number) {
    dataSource = dataSource.filter((data) =>
      data.number.includes(params.number || '')
    );
  }

  if (params.name) {
    dataSource = dataSource.filter((data) =>
      data.name.includes(params.name || '')
    );
  }

  if (params.contentType) {
    dataSource = dataSource.filter((data) =>
      data.contentType.includes(params.contentType || '')
    );
  }

  if (params.filterType) {
    dataSource = dataSource.filter((data) =>
      data.filterType.includes(params.filterType || '')
    );
  }

  if (params.createdTime) {
    dataSource = dataSource.filter(
      (data) =>
        dayjs(data.createdTime) > dayjs(params.createdTime[0]) &&
        dayjs(data.createdTime) < dayjs(params.createdTime[1])
    );
  }

  if (params.status) {
    dataSource = dataSource.filter((data) => data.status === params.status);
  }

  const result = {
    list: dataSource.slice((p - 1) * ps, p * ps),
    total: dataSource.length,
  };

  return successResponseWrap(result);
}

function updatePolicy(options: GetParams) {
  const body = options.body ? JSON.parse(options.body) || {} : {};
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

function deletePolicy(options: GetParams) {
  const { url } = options;
  const params = qs.parseUrl(url).query as any;
  if (!params.ids) {
    return successResponseWrap('ok');
  }
  const ids = params.ids.split(',');
  policys.list = policys.list.filter(
    (item: ListItem) => !ids.includes(`${item.id}`)
  );
  return successResponseWrap('ok');
}

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/list/policy'), getPolicy);
    Mock.mock(new RegExp('/api/policy/edit'), updatePolicy);
    Mock.mock(new RegExp('/api/policy/delete'), deletePolicy);
  },
});
