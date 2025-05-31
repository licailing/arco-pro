import { successResponseWrap } from '@/utils/setup-mock';
import sysPremits from './_sysPremits';

interface PermitItem {
  moduleName: string;
  moduleDesc: string;
  moduleType: string;
  actions: {
    [propName: string]: any;
  };
}

let premits: any[] = [];
let i = 1;
sysPremits.forEach(
  ({ moduleName, moduleDesc, moduleType, actions }: PermitItem) => {
    Object.keys(actions).forEach((act: any) => {
      premits.push({
        premitId: `${i}`,
        premitModule: moduleName,
        premitModuleDesc: moduleDesc,
        premitAction: act,
        premitActionDesc: actions[act] as string,
        premitType: moduleType,
      });
      i += 1;
    });
  }
);

function generatePremit() {
  sysPremits.forEach(
    ({ moduleName, moduleDesc, moduleType, actions }: PermitItem) => {
      Object.keys(actions).forEach((act) => {
        let index = -1;
        for (const [key, premit] of premits.entries()) {
          if (premit.premitAction === act) {
            index = key;
            break;
          }
        }
        const item = {
          premitId: '',
          premitModule: moduleName,
          premitModuleDesc: moduleDesc,
          premitAction: act,
          premitActionDesc: actions[act] as string,
          premitType: moduleType,
        };
        if (index !== -1) {
          item.premitId = premits[index].premitId;
          premits.splice(index, 1, item);
        } else {
          item.premitId = `${i}`;
          premits.push(item);
          i += 1;
        }
      });
    }
  );
  return successResponseWrap('ok');
}

function getPremit({ query }: any) {
  let dataSource = premits;

  if (query.sorter) {
    const s = query.sorter.split('.');
    dataSource = dataSource.sort((prev: any, next: any) => {
      if (s[1] === 'desc') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (query.premitId) {
    dataSource = dataSource.filter((data) =>
      data.premitId.includes(query.premitId || '')
    );
  }

  if (query.premitModule) {
    dataSource = dataSource.filter((data) =>
      data.premitModule.includes(query.premitModule || '')
    );
  }
  if (query.premitModuleDesc) {
    dataSource = dataSource.filter((data) =>
      data.premitModuleDesc.includes(query.premitModuleDesc || '')
    );
  }
  if (query.premitAction) {
    dataSource = dataSource.filter((data) =>
      data.premitAction.includes(query.premitAction || '')
    );
  }
  if (query.premitActionDesc) {
    dataSource = dataSource.filter((data) =>
      data.premitActionDesc.includes(query.premitActionDesc || '')
    );
  }

  const result = {
    list: dataSource,
    total: dataSource.length,
  };

  return successResponseWrap(result);
}

function updatePremit({ body }: any) {
  const {
    premitId,
    premitAction,
    premitModule,
    premitActionDesc,
    premitModuleDesc,
  } = body || {};

  if (premitId) {
    premits = premits.map((item) => {
      if (item.premitId === premitId) {
        return {
          ...item,
          premitModule,
          premitModuleDesc,
          premitAction,
          premitActionDesc,
        };
      }
      return item;
    });
  }

  return successResponseWrap({ status: 'ok' });
}

function getMenu() {
  // 生成菜单
  const options: any = {};
  premits.forEach(
    ({
      premitId,
      premitType,
      premitModule,
      premitModuleDesc,
      premitActionDesc,
    }) => {
      if (!options[premitType]) {
        options[premitType] = {};
      }
      if (!options[premitType][premitModule]) {
        options[premitType][premitModule] = {
          key: premitModule,
          title: premitModuleDesc,
          checkable: false,
          children: [],
        };
      }
      options[premitType][premitModule].children.push({
        key: premitId,
        title: premitActionDesc,
      });
    }
  );
  const menuData: any[] = [];
  Object.keys(options).forEach((opt) => {
    let title = opt;
    switch (opt) {
      case 'menu':
        title = '菜单';
        break;
      case 'module':
        title = '功能模块';
        break;
      default:
        break;
    }
    const optionChildren: any[] = [];
    Object.keys(options[opt]).forEach((optC) => {
      optionChildren.push(options[opt][optC]);
    });
    menuData.push({
      title,
      key: opt,
      checkable: false,
      children: optionChildren,
    });
  });
  return successResponseWrap(menuData);
}

function deletePremit({ query }: any) {
  if (!query.ids) {
    return successResponseWrap('ok');
  }
  const ids = query.ids.split(',');
  premits = premits.filter((item) => ids.indexOf(item.premitId) === -1);
  return successResponseWrap('ok');
}
export default [
  {
    url: '/api/premit/generate',
    method: 'get',
    response: generatePremit,
  },
  {
    url: '/api/premit/list',
    method: 'get',
    response: getPremit,
  },
  {
    url: '/api/premit/update',
    method: 'post',
    response: updatePremit,
  },
  {
    url: '/api/premit/delete',
    method: 'get',
    response: deletePremit,
  },
  {
    url: '/api/premit/menu',
    method: 'get',
    response: getMenu,
  },
];
