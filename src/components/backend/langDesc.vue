<template>
    <div class="langDesc">
        <Button type="primary" @click="back">
          <Icon type="ios-arrow-back"></Icon>
          {{$t('goback')}}
        </Button>
        <Button type="primary" @click="addLang">{{$t('goods.Add')}}</Button>
        <Table border :columns="columnsLang" :data="dataLang" style="margin-top: 10px;"></Table>
        <Page
          simple
          :total="count"
          :page-size="langParams.limit"
          :current="langParams.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handlePageSizeChange"
          show-elevator
          show-sizer
          show-total
          class="langPage"
        />
        <Modal
          v-model="modalVal"
          scrollable
          :title="modalObj.title"
          label-width="50"
          @on-ok="submit"
          @on-cancel="cancel"
          class-name="lang_form_modal"
          :mask-closable="false"
          width="700">
          <div class="lang_form">
            <Form
              ref="lang_form"
              :model="lang_form"
              label-position="left"
              :rules="formRules"
              :label-width="100"
              inline>
              <FormItem :label="item" :prop="index" v-for="(item,index) in formOptions" :key="index">
                <template v-if="index==='locale'">
                  <Select label-in-value v-model="lang_form[index]" filterable :placeholder="$t('backend.selectLang')">
                    <Option v-for="(val,i) in withOptions" :value="val.locale" :key="i">{{ val.name }}</Option>
                  </Select>
                </template>
                <template v-else>
                  <Input v-model="lang_form[index]" :placeholder="`${$t('PleaseEnterThe')}${item}`"></Input>
                </template>
              </FormItem>
            </Form>
          </div>
          <div slot="footer">
            <Button size="small" type="dashed" @click="cancel">{{$t('Cancel')}}</Button>
            <Button type="primary" size="small" @click="submit" :loading="langLoading">{{$t('Apply')}}</Button>
          </div>
        </Modal>
    </div>
</template>
<script>
import { CODE_OK, IsAlert, AjaxApi, IsMessage , IsLoading } from "@/utils/api";
export default {
    name: "langDesc",
    data () {
        return {
          langParams: {
            limit: 20, 
            page: 1,
          },
          count: 0, //分页总数total
          columnsLang: [],
          dataLang: [],
          modalVal: false,
          lang_form: {},
          formRules: {},
          formOptions: {},
          withOptions: [],
          currentId: null,
          modalObj: {
            modalType: '',
            title: ''
          },
          langLoading: false
        }
    },
    props: {
      rowInfo: {
        type: Object,
        default(){
          return []
        }
      },
      foreign_name: {
        type: String,
        default(){
          return ''
        }
      }
    },
    computed: {

    },
    created(){
      this.getWithSelect()
    },
    mounted() {

    },
    methods: {
      addLang(){
        this.modalVal = true
        this.modalObj = {
          modalType: 'add',
          title: this.$t('goods.Add')
        }
      },
      submit(){
        this.$refs.lang_form.validate( valid => {
          if(valid){
            let successFuc = res => {
              this.getInitData()
              this.$refs.lang_form.resetFields();
              IsMessage("success", this.$t("Successful"));
              this.langLoading = false
              this.modalVal = false
            };
            let elseFuc = () => {
              this.langLoading = false
            };
            this.langLoading = true
            switch(this.modalObj.modalType){
              case 'add':
                let {id,...newParams} = {...this.rowInfo}
                newParams[this.foreign_name] = this.rowInfo.id
                AjaxApi("lang_add", {...newParams,...this.lang_form}, successFuc, elseFuc);
                break;
              case 'edit':
                AjaxApi("lang_update", {...this.rowInfo,...this.lang_form,id: this.currentId}, successFuc, elseFuc);
              break;
            }
          }
        })
      },
      cancel(){
        this.$refs.lang_form.resetFields();
        this.modalVal = false
      },
      back(){
        this.$emit('cancelAdd')
      },
      getInitData() {
        let successFuc = res => {
          this.$emit('update:modalType', true);
          this.getTableColumns(res.data)
        };
        let elseFuc = () => {};
        AjaxApi("lang_translate_list", {...this.rowInfo,...this.langParams}, successFuc, elseFuc);
      },
      getTableColumns(tData){
        this.formOptions = {}
        let allKeys = Object.keys(tData.lang_columns)
        allKeys.push('Operating')
        if(tData.lang_list.length === 0){
          this.dataLang = [];
        }else{
          let baseColumns = allKeys.reduce( (obj,key) => {
            obj[key] = {
              title: tData.lang_columns[key],
              key: key,
              minWidth: 130,
              align: "center",
              tooltip: true,
              sortable: key === 'id' ? true : false
            }
            return obj
          },{})
          baseColumns['Operating'] = {
            title: this.$t("Operating"),
            minWidth: 140,
            fixed: "right",
            align: "center",
            render: (h, params) => {
              return h("div", [
                h("Button", {
                  //编辑
                  attrs: {
                    title: this.$t("Edit")
                  },
                  props: {
                    type: "primary",
                    shape: "circle",
                    icon: "md-create",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.modalVal = true
                      this.modalObj = {
                        modalType: 'edit',
                        title: this.$t('Edit')
                      }
                      this.currentId = params.row.id
                      Object.keys(this.lang_form).map( v => {
                        this.lang_form[v] = params.row[v]
                      })
                    }
                  }
                })
              ]);
            }
          }
          let pData = []
          allKeys.forEach( v => {
            pData.push(baseColumns[v])
          })
          this.columnsLang = pData
          this.dataLang = tData.lang_list;
        }
        
        let allFormKeys = Object.keys(tData.lang_columns_form)
        /* 定义表单 */
        this.lang_form = allFormKeys.reduce( (obj,v) => {
          obj[v] = '';
          return obj
        },{})
        /* 表单验证 */
        allFormKeys.map( v => {
          this.formRules[v] = [
            {
              required: true,
              type: "string",
              message: `${this.$t("isRequired")}`,
              trigger: "blur"
            }
          ]
        })
        /* 表单数据 */
        allFormKeys.filter( v => v !== 'id' && v !== 'menu_id').forEach( key => {
          this.formOptions[key] = tData.lang_columns_form[key]
        })
      },
      //分页跳转方法
      handleCurrentChange(page) {
        this.langParams.page = page;
        this.getInitData();
      },
      //分页页数改变
      handlePageSizeChange(limit) {
        this.langParams.limit = limit;
        this.getInitData();
      },
      getWithSelect(){
        let successFuc = res => {
          this.withOptions = res.data.data;
        };
        let elseFuc = () => {};
        AjaxApi("lang_options", {status: 1}, successFuc, elseFuc);
      },
    },
    components: {

    }
}
</script>
<style lang="less">
.langDesc{
  .langPage{
    margin-top: 10px;
  }
}
.lang_form_modal{
  .ivu-modal-body{
    padding: 30px 80px;
    .lang_form{
      .ivu-form-item{
        width: 100%;
      }
    }
  }
  .ivu-btn > .ivu-icon{
    font-size: 12px;
  }
}
</style>
