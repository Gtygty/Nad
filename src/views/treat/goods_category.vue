<template>
  <div class="goods_category">
    <Layout>
      <Layout>
        <Content style="text-align:left;width:80vw">
          <Tree :data="categoryTree" :render="renderContent"></Tree>
        </Content>
      </Layout>
    </Layout>
    <!-- 编辑商品 -->
    <div v-show="model_edit">
      <Modal
        v-model="model_edit"
        scrollable
        :title="modeltitle"
        @on-ok="do_edit"
        @on-cancel="cancelEdit"
        id="editgoods_category"
        width="700"
      >
        <div>
          <Form
            ref="resetForm"
            class="foodsedit"
            :model="editGoodData"
            :rules="resetRule"
            :label-width="90"
          >
            <FormItem :label="$t('goods.CategoryName')" prop="category_name">
              <Input
                v-model="editGoodData.category_name"
                :placeholder="$t('goods.CategoryName')"
                clearable
              ></Input>
            </FormItem>
            <FormItem :label="$t('goods.Picture')">
              <uploadimg @emitSuccess="handImgSuccessEdit" :imageSrc="editGoodData.image_src"></uploadimg>
              <Button
                class="btn_visible"
                type="primary"
                @click.native="visible=true"
              >{{$t('goods.View')}}</Button>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button size="small" type="dashed" @click="cancelEdit">{{$t('goods.Cancel')}}</Button>
          <Button type="primary" size="small" @click="do_edit">{{$t('goods.Apply')}}</Button>
        </div>
      </Modal>
    </div>
    <!-- 查看图片 -->
    <Modal :title="$t('goods.Picture')" v-model="visible">
      <img :src="editGoodData.image_src" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
import {
  CODE_OK,
  IsAlert,
  IsLoading,
  AjaxApi,
  IsMessage,
  AsyncLoading,
  getTreeDeepArr
} from "@/utils/api";
import uploadimg from "@/components/uploadImg/uploadImgFormData.vue";
export default {
  name: "goods_category",
  components: {
    uploadimg
  },
  data() {
    return {
      parent_id: null,
      modeltitle: this.$t('New'),
      file_img: new FormData(), //formdata图片
      dynamicHeight: 400, //table动态高度
      addList: [], //添加商品列表
      deletArr: [], //编辑弹窗中添加商品的列表
      StatusId: [], //控制上下架的id串
      visible: false, //图片查看弹窗
      model_edit: false, //编辑弹窗状态
      model_goods: false, //添加商品弹窗状态
      count: 0, //分页总数total
      count_child: 0, //分页总数total
      seach_params: {
        category_id: 0,
        limit: 20,
        current_page: 1,
        search_goods: "",
        search_key: ""
      }, //获取table列表时的参数
      goods_params: {
        category_id: 0,
        limit: 20,
        current_page: 1,
        search_key: "",
        search_goods: ""
      }, //获取商品时的参数
      categoryTree: [], //页面左侧分类数据
      goodsData: [], //添加商品弹窗的table数据
      unitList: [], //单位列表
      cateList: [], //分类列表
      //编辑弹窗分类的数据
      editGoodData: {
        id: "",
        category_name: "",
        image_src: ""
      },
      //编辑弹窗商品的数据
      editDataGoods: [],

      resetRule: {
        // image_src: [
        //   {
        //     required: true,
        //     message: `${this.$t("PleaseChooseThe")}${this.$t("Picture")}`,
        //     trigger: "blur"
        //   }
        // ],

        category_name: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("Category")}`,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    changeCascader(value, selectedData) {
      let sss = getTreeDeepArr(value[value.length - 1], this.cateList);
    },
    newGood() {
      this.modeltitle = this.$t('New');
      this.editGoodData = {
        id: "",
        category_name: "",
        image_src: ""
      };
      this.file_img = new FormData();
      this.model_edit = true;
    },

    renderContent(h, { root, node, data }) {
      const selected = data.selected;
      const iFis = data.children.length === 0;
      const value = data;
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%"
          }
        },
        [
          h(
            "Button",
            {
              attrs: {
                title: "请点击"
              },
              style: {
                width: "200px",
                height: "34px",
                textAlign: "left",
                fontSize: "16px"
              },
              props: iFis
                ? {
                    size: "small",
                    ghost: selected ? false : true,
                    type: "primary"
                  }
                : {
                    size: "small",
                    type: "primary",
                    ghost: selected ? false : true,
                    icon: data.expand ? "ios-folder-open-outline" : "ios-folder"
                  },
              nativeOn: {
                click: () => {
                  root.forEach((i, index) => {
                    i.node.selected = false;
                    // if (index !== 0) {
                    //   i.node.expand =
                    //     i.node.id === node.node.parent_id
                    //       ? i.node.expand
                    //       : false;
                    // }
                  });
                  data.expand = data.expand ? false : true;
                  data.selected = data.selected ? false : true;
                }
              }
            },
            data.title
          ),
          h(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right",
                marginRight: "32px"
              }
            },
            [
              h("Button", {
                props: {
                  icon: "md-add",
                  type: "success"
                },
                style: {
                  width: "64px",
                  marginRight: "10px"
                },
                on: {
                  click: () => {
                    this.parent_id = node.node.id;
                    this.modeltitle =this.$t('New');
                    this.file_img = new FormData();
                    console.log("555")
                    this.model_edit = true;
                  }
                }
              }),
              h("Button", {
                props: {
                  icon: "md-build",
                  type: "info"
                },
                style: {
                  width: "64px",
                  marginRight: "10px"
                },
                on: {
                  click: () => {
                    this.modeltitle = this.$t('Edit');
                    this.editGoodData.category_name = node.node.title;
                    this.editGoodData.image_src = node.node.image_src;
                    this.parent_id = node.node.id;
                    this.model_edit = true;
                  }
                }
              })
            ]
          )
        ]
      );
    },
    nodeFuc(data) {
      let getArray = data => {
        for (var i in data) {
          data[i].expand = true;
          data[i].selected = false;
          data[i].title = data[i].category_name;
          getArray(data[i].children);
        }
      };
      getArray(data);
      let tree = [
        {
          title: this.$t("allcategories"),
          children: data,
          id: 0,
          image_src: "",
          selected: true,
          expand: true,
          parent_id: 0,
          status: 1
        }
      ];
      this.categoryTree = JSON.parse(JSON.stringify(tree));
      // this.categoryTreeCopy = JSON.parse(JSON.stringify(tree));
    },
    /** 编辑方法———————————————————————————————————————————————————— */
    //编辑弹窗  点击确定的回调（表单验证）
    do_edit() {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          this.this_do_edit();
        }
      });
    },
    //表单验证后确定编辑
    this_do_edit() {
      this.file_img.append("category_name", this.editGoodData.category_name);
      let successFuc = () => {
        this.modeltitle === this.$t('Edit')
          ? IsAlert("success", this.$t('editedSuccessfully'))
          : IsAlert("success", this.$t('addedSuccessfully'));
        this.getInitData();
        this.cancelEdit();
      };
      let elseFuc = () => this.cancelEdit();
      if (this.modeltitle === this.$t('Edit')) {
        this.file_img.append("_method", "PATCH");
        let query = {
          params: this.file_img,
          id: this.parent_id
        };
        AjaxApi("PostEditCategory", query, successFuc, elseFuc);
      } else {
        this.file_img.append("parent_id", this.parent_id);
        AjaxApi("AddCategory", this.file_img, successFuc, elseFuc);
      }
    },
    //编辑弹窗  点击取消的回调（重置表单验证）
    cancelEdit() {
      this.file_img = new FormData();
      this.editGoodData.image_src = '';
      this.model_edit = false;
      this.$nextTick(() => {
        this.$refs["resetForm"].resetFields();
      });
    },
    //上传图片
    handImgSuccessEdit(res) {
      this.editGoodData.image_src = res.upImg;
      this.file_img = res.formData;
    },
    //获取初始table数据
    getInitData() {
      let successFuc = res => {
        this.nodeFuc(res.data);
      };
      let elseFuc = () => {
        let tree = [
              {
                title: this.$t("allcategories"),
                children: [],
                id: 0,
                image_src: "",
                selected: true,
                expand: true,
                parent_id: 0,
                status: 1
              }
            ];
            this.categoryTree = JSON.parse(JSON.stringify(tree));
      };
      AjaxApi("GetCateList", {}, successFuc, elseFuc);
    }
  },

  created() {
    this.getInitData();
  }
};
</script>

<style scoped lang="less">
</style>
<style lang="less">
.foodsedit {
  .ivu-form-item-content {
    width: 220px;
  }
}
.btn_visible {
  margin: 5px 0 0 8px;
}

.ivu-layout {
  background-color: #ffffff !important;
}
.ivu-layout-footer {
  background-color: #ffffff !important;
}
#editgoods_category {
  .ivu-card-body {
    padding: 0 !important;
  }
}
</style>