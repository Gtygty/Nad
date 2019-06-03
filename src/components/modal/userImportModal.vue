<template>
    <div class="userImportModal">
        <p style="color: red;">一次最多导入1000条数据</p>
        <hr />
        <Input v-model="excelVal" class="importExcel" disabled>
            <span slot="prepend">Excel文件</span>
            <span slot="append">
                <upLoadBtn idName="excelLoad" text="选择文件" color="success" size="small" accept=".xlsx" @fileUpload="fileUpload" :fileChangeLoading="fileChangeLoading" style="display:inline-block;" />
            </span>
        </Input>
        <Table
            v-cloak
            class="m_t_10"
            border
            :columns="tableColumns"
            :data="tableData"
        ></Table>
        <div class="com-footer">
            <Page
            :total="count"
            :page-size="seach_params.limit"
            :current="seach_params.current_page"
            @on-change="handleCurrentChange"
            @on-page-size-change="handlePageSizeChange"
            show-elevator
            show-sizer
            show-total
            />
        </div>
    </div>
</template>
<script>
import { CODE_OK, IsAlert, AjaxApi, IsMessage } from "@/utils/api";
import upLoadBtn from "@/components/excel/upLoadBtn"
import { user_excel_import } from "@/api/user_manage/user_list"
export default {
    name: "userImportModal",
    data () {
        return {
            excelVal: '',
            fileChangeLoading: false,
            tableData: [],
            count: 0, //分页总数total
            seach_params: { limit: 20, current_page: 1 }, //获取table列表时的参数
        }
    },
    computed: {
        tableColumns(){
            return [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: 'valid',
                    key: "title",
                    minWidth: 120,
                    align: "center",
                    tooltip: true,
                    sortable: false
                },
                {
                    title: this.$t("title"),
                    key: "title",
                    minWidth: 120,
                    align: "center",
                    tooltip: true,
                    sortable: false
                },
                {
                    title: this.$t("firstname"),
                    key: "first_name",
                    minWidth: 120,
                    align: "center",
                    tooltip: true,
                    sortable: false
                },
                {
                    title: this.$t("lastname"),
                    key: "first_name",
                    minWidth: 120,
                    align: "center",
                    tooltip: true,
                    sortable: false
                },
                {
                    title: this.$t("nurse.birth"),
                    key: "dob",
                    minWidth: 120,
                    align: "center",
                    tooltip: true,
                    sortable: false
                },
                {
                    title: this.$t("email"),
                    key: "email",
                    minWidth: 120,
                    align: "center",
                    tooltip: true,
                    sortable: false
                },
                {
                    title: this.$t("mobile"),
                    key: "mobile",
                    minWidth: 120,
                    align: "center",
                    tooltip: true,
                    sortable: false
                },
                {
                    title: this.$t("postcode"),
                    key: "postcode",
                    minWidth: 120,
                    align: "center",
                    tooltip: true,
                    sortable: false
                },
                {
                    title: this.$t("timezone"),
                    key: "time_zone",
                    minWidth: 120,
                    align: "center",
                    tooltip: true,
                    sortable: false
                },
                {
                    title: this.$t('StorefrontLabel'),
                    key: "store",
                    minWidth: 120,
                    align: "center",
                    tooltip: true,
                    sortable: false
                },
                {
                    title: this.$t('regtime'),
                    key: "time",
                    minWidth: 180,
                    align: "center",
                    tooltip: true,
                    sortable: false,
                    render: (h, params) => {
                        return h("span",params.row.time.date)
                    }
                },
                {
                    title: this.$t('Remarks'),
                    key: "memo",
                    minWidth: 120,
                    align: "center",
                    tooltip: true,
                    sortable: false
                },
            ]
        }
    },
    mounted() {
        console.log(777)
        console.log(this.$t('user.common'))
    },
    methods: {
        getInitData(){
            /* let successFuc = res => {
                this.$nextTick(() => {
                this.tableData = res.data;
                this.count = res.count;
                });
            };
            let elseFuc = () => {};
            AjaxApi("GetUsersList", this.seach_params, successFuc, elseFuc); */
        },
        //分页跳转方法
        handleCurrentChange(current_page) {
            this.seach_params.current_page = current_page;
            this.getInitData();
        },
        //分页页数改变
        handlePageSizeChange(limit) {
            this.seach_params.limit = limit;
            this.getInitData();
        },
        async fileUpload(itemFile){
            this.excelVal = itemFile.name;
            if (itemFile && /[.](xlsx|XLSX)$/.test(itemFile.name)) {
                let formData = new FormData()
                formData.append('excel', itemFile)
                this.fileChangeLoading = true
                let v = await user_excel_import(formData)
                this.fileChangeLoading = false
                if(v.code == 2000){
                    this.tableData = v.data
                }else{
                    IsMessage.error(v.msg)
                }
            } else {
                IsMessage("error", '格式不正确');
            } 
        },
    },
    components: {
        upLoadBtn
    }
}
</script>
<style lang="less">
.userImportModal{
    .importExcel{
        margin: 20px auto;
        width: 400px;
    }
    .ivu-input-group-append{
        width: 100px;
    }
}

</style>
