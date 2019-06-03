export const menu_data_res = {
  //菜单mock
  code: "2000",
  msg: "成功",
  data: [
    {
      id: 1,
      menu_name: "工作台",
      menu_level: 1,
      path: "work_desk",
      icon: "",
      is_hidden: 0,
      parent_id: 0,
      is_leaf: 0,
      is_top: 1,
      is_fixed: 1,
      order_index: 0,
      menu_type: 1,
      children: [
        {
          id: 2,
          menu_name: "我的工作台",
          menu_level: 2,
          path: "work_desk/my_work_desk",
          icon: "",
          is_hidden: 0,
          parent_id: 1,
          is_leaf: 1,
          is_top: 0,
          is_fixed: 0,
          order_index: 0,
          menu_type: 1,
          children: []
        },
        {
          id: 3,
          menu_name: "工作提醒",
          menu_level: 2,
          path: "work_desk/work_reminder",
          icon: "",
          is_hidden: 0,
          parent_id: 1,
          is_leaf: 1,
          is_top: 0,
          is_fixed: 0,
          order_index: 0,
          menu_type: 1,
          children: []
        },
        {
          id: 4,
          menu_name: "消息列表",
          menu_level: 2,
          path: "work_desk/message_list",
          icon: "",
          is_hidden: 0,
          parent_id: 1,
          is_leaf: 1,
          is_top: 0,
          is_fixed: 0,
          order_index: 0,
          menu_type: 1,
          children: []
        }
      ]
    },
    {
      id: 5,
      menu_name: "客户管理",
      menu_level: 1,
      path: "user_manage",
      icon: "",
      is_hidden: 0,
      parent_id: 0,
      is_leaf: 0,
      is_top: 1,
      is_fixed: 0,
      order_index: 0,
      menu_type: 1,
      children: [
        {
          id: 6,
          menu_name: "客户列表",
          menu_level: 2,
          path: "user_manage/user_list",
          icon: "",
          is_hidden: 0,
          parent_id: 5,
          is_leaf: 1,
          is_top: 0,
          is_fixed: 0,
          order_index: 0,
          children: [],
          menu_type: 1
        }
      ]
    },
    {
      id: 7,
      menu_name: "订单管理",
      menu_level: 1,
      path: "order",
      icon: "",
      is_hidden: 0,
      parent_id: 0,
      is_leaf: 0,
      is_top: 0,
      is_fixed: 0,
      order_index: 0,
      menu_type: 1,
      children: [
        {
          id: 8,
          menu_name: "订单列表",
          menu_level: 2,
          path: "order/order_list",
          icon: "",
          is_hidden: 0,
          parent_id: 7,
          is_leaf: 0,
          is_top: 0,
          is_fixed: 0,
          order_index: 0,
          children: [],
          menu_type: 1
        }
      ]
    },
    {
      id: 9,
      menu_name: "组织",
      menu_level: 1,
      path: "organize",
      icon: "",
      is_hidden: 0,
      parent_id: 0,
      is_leaf: 0,
      is_top: 0,
      is_fixed: 0,
      order_index: 0,
      menu_type: 2,
      children: [
        {
          id: 10,
          menu_name: "用户管理",
          menu_level: 2,
          path: "organize/admin",
          icon: "",
          is_hidden: 0,
          parent_id: 9,
          is_leaf: 0,
          is_top: 0,
          is_fixed: 0,
          order_index: 0,
          children: [],
          menu_type: 2
        },
        {
          id: 11,
          menu_name: "权限管理",
          menu_level: 2,
          path: "organize/access",
          icon: "",
          is_hidden: 0,
          parent_id: 9,
          is_leaf: 0,
          is_top: 0,
          is_fixed: 0,
          order_index: 0,
          children: [],
          menu_type: 2
        },
        {
          id: 12,
          menu_name: "部门管理",
          menu_level: 2,
          path: "organize/dept",
          icon: "",
          is_hidden: 0,
          parent_id: 9,
          is_leaf: 0,
          is_top: 0,
          is_fixed: 0,
          order_index: 0,
          children: [],
          menu_type: 2
        },
        {
          id: 13,
          menu_name: "动态",
          menu_level: 2,
          path: "organize/dynamic",
          icon: "",
          is_hidden: 0,
          parent_id: 9,
          is_leaf: 0,
          is_top: 0,
          is_fixed: 0,
          order_index: 0,
          children: [],
          menu_type: 2
        }
      ]
    }
  ]
};
export const group_data_res = {
  //分组mock
  code: 0,
  msg: "sys_success",
  data: [
    {
      id: 1,
      group_name: "高级管理员",
      group_desc: "系统管理员，超管",
      status: 1
    },
    {
      id: 2,
      group_name: "管理员",
      group_desc: "管理大部分后台功能",
      status: 1
    },
    {
      id: 3,
      group_name: "行政经理",
      group_desc: "管理库存，下单，业务统计",
      status: 1
    },
    {
      id: 4,
      group_name: "财务经理",
      group_desc: "财务模块",
      status: 1
    },
    {
      id: 5,
      group_name: "渠道销售",
      group_desc: "沟通加盟店，看签下的店",
      status: 1
    },
    {
      id: 6,
      group_name: "售前客服",
      group_desc: "客户下单前沟通",
      status: 1
    },
    {
      id: 7,
      group_name: "售后客服",
      group_desc: "下单后沟通",
      status: 1
    },
    {
      id: 8,
      group_name: "权限管理",
      group_desc: "控制权限",
      status: 1
    },
    {
      id: 9,
      group_name: "权限管理",
      group_desc: "控制权限",
      status: 1
    },
    {
      id: 10,
      group_name: "权限管理",
      group_desc: "控制权限",
      status: 1
    }
  ]
};
