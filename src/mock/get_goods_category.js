
export const get_goods_category = {
  code: "2000",
  message: "成功",
  data: [
      {
          id: 20,
          parent_id: 0,
          category_name: "输液疗法",
          son: [
              { id: 100, goods_name: "VITAMIN C 7.5G" },
              { id: 101, goods_name: "GLUTHATIONE" },
              { id: 102, goods_name: "VENSICY" },
              { id: 103, goods_name: "NADclinic肌肤美白" },
              { id: 105, goods_name: "NADclinic抗衰老" },
              { id: 107, goods_name: "VITAMIN B COMPLEX" },
              { id: 108, goods_name: "ADVANCED ATP" }
          ],
          expand: false,
          children: [
              {
                  id: 25,
                  parent_id: 20,
                  category_name: "身体健康",
                  son: [
                      { id: 216, goods_name: "1" },
                      { id: 219, goods_name: "精油" },
                      { id: 220, goods_name: "刮痧板" },
                      { id: 221, goods_name: "排毒" },
                      { id: 222, goods_name: "第三方" },
                      { id: 224, goods_name: "VITAMIN B COMPLEX" }
                  ],
                  expand: false,
                  children: []
              }
          ]
      },
      {
          id: 21,
          parent_id: 0,
          category_name: "排毒疗法",
          son: [
              { id: 110, goods_name: "NADclinic焕新补能排毒疗法" },
              { id: 111, goods_name: "NAD+" },
              { id: 112, goods_name: "WELLNESS MYERS" },
              { id: 113, goods_name: "VITAMIN C 7.5G" },
              { id: 114, goods_name: "GLUTHATIONE" },
              { id: 196, goods_name: "Nad测试" },
              { id: 197, goods_name: "Nad+test" },
              { id: 203, goods_name: "123" },
              { id: 204, goods_name: "抗疲劳" },
              { id: 206, goods_name: "123" },
              { id: 208, goods_name: "test333" },
              { id: 217, goods_name: "455465" },
              { id: 218, goods_name: "发生" },
              { id: 223, goods_name: "护理" },
              { id: 228, goods_name: "PERFORMANCE BOOSTER PLUS" },
              { id: 230, goods_name: "GLUTHATIONE" },
              { id: 231, goods_name: "维生素c" }
          ],
          expand: false,
          children: []
      },
      {
          id: 22,
          parent_id: 0,
          category_name: "注射疗法",
          son: [
              { id: 122, goods_name: "VITAMIN C 7.5G" },
              { id: 127, goods_name: "GLUTHATIONE" },
              { id: 226, goods_name: "GLUTHATIONE" }
          ],
          expand: false,
          children: []
      }
  ]
};