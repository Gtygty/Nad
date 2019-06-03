<template>
    <div class="schedulingModal">
        <Tabs v-model="tabValue" on-click="clickTab">
          <TabPane label="Daily" name="1"></TabPane>
          <TabPane label="Weekly" name="2"></TabPane>
        </Tabs>
       <!--  <dailyPart :nurse_id="nurse_id" /> -->
          <Card class="dailyPart" v-show="tabValue==='1'">
            <div class="swiper-container dailySwiper" ref="dailySwiper">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item,index) in wholeMonth" :key="index">
                  <Button @click="selectDay(item,index)" :class="{activeBtn: currentDay === index}">
                    {{`星期${item.week} ${item.month}/${item.day}`}}
                  </Button>
                </div>
              </div>
            </div>
            <img src="@/assets/left.svg" class="swiperBtn swiperBtnLeft" width="30" />
            <img src="@/assets/right.svg" class="swiperBtn swiperBtnRight" width="30" />
            <div class="timeShow" v-show="!isShowEdit">
              <Button v-for="(item,index) in timeData" :key="index" class="btnCycle" :class="{btnChecked: item.status === 0 ? false : true}">{{item.time}}</Button>
            </div>
            <div class="timeEdit" v-show="isShowEdit">
              <Checkbox
                :indeterminate="indeterminate"
                :value="checkAll"
                @click.prevent.native="handleCheckAll" style="margin-left: 5px;">全选</Checkbox>
              <CheckboxGroup v-model="daily_time" @on-change="changeDailyTime">
                <span v-for="(item,index) in timeData" :key="index" class="boxCycle" :class="{boxChecked: item.status === 0 ? false : true}">
                  <Checkbox :label="item.time"></Checkbox>
                  <div class="capacity">
                    <strong>容量：</strong><Input v-model="capacityVal" size="small" />
                  </div>
                </span>
              </CheckboxGroup>
            </div>
            <div class="operateBtn">
              <div v-if="!isShowEdit">
                <Button type="primary" @click="edit" style="width: 100%;">修改</Button>
              </div>
              <div v-else>
                <Button @click="toBack">返回</Button>
                <Button type="primary" @click="submit">提交</Button>
              </div>
            </div>
          </Card>
          <Card v-show="tabValue==='2'">
            2
          </Card>
    </div>
</template>
<script>
import { CODE_OK, IsAlert, AjaxApi, IsMessage } from "@/utils/api";
import {
  daily_show,
  daily_set,
  weekly_show,
  weekly_set
} from "@/api/organize/nurse";
import swiper from "swiper";
import dailyPart from "@/components/modal/dailyPart.vue"
import weeklyPart from "@/components/modal/weeklyPart.vue"
export default {
    name: "schedulingModal",
    data () {
        return {
          tabValue: '1',
          isShowEdit: false,
          daily_time: [],
          indeterminate: false,
          checkAll: false,
          timeData: [],
          checkAllData: [],
          capacityVal: '',
          dailySwiper: null,
          currentDay: 0,
          wholeMonth: [],
          dateVal: '',
          nurse_id: ''
        }
    },
    components: {
      dailyPart,weeklyPart
    },
    computed: {

    },
    created(){
      this.dailyInit()
      this.getThirtyDays()
    },
    mounted() {
      
    },
    methods: {
      getReady(id){
        this.nurse_id = id
        this.requestInitData()
      },
      dailyInit(){
        this.$nextTick( () => {
          this.dailySwiper = new swiper(this.$refs.dailySwiper, {
              slidesPerView: 6,
              spaceBetween: 8,
              freeMode: true,
              navigation: {
                nextEl: '.swiperBtnRight',
                prevEl: '.swiperBtnLeft',
              },
              observer: true,
              observeParents: true
          });
        })
      },
      async requestInitData(){
        let v = await daily_show({
          nurse_id: this.nurse_id,
          daily: this.dateVal
        })
        if(v.code === 0){
          this.timeData = v.data
          this.daily_time = v.data.reduce( (arr,v) => {
            if(v.status === 1){
              arr.push(v.time)
            }
            return arr
          },[])
          this.changeDailyTime(this.daily_time)
          this.checkAllData = v.data.reduce( (arr,v) => {
            arr.push(v.time)
            return arr
          },[])
        }else{
          IsMessage("error", v.msg);
        }
      },
      handleCheckAll(){
        if (this.indeterminate) {
            this.checkAll = false;
        } else {
            this.checkAll = !this.checkAll;
        }
        this.indeterminate = false;

        if (this.checkAll) {
            this.daily_time = this.checkAllData;
        } else {
            this.daily_time = [];
        }
      },
      toBack(){
        this.isShowEdit = false
        this.requestInitData()
      },
      edit(){
        this.isShowEdit = true
      },
      async submit(){
        let v = await daily_set({
          nurse_id: this.nurse_id,
          daily: this.dateVal,
          free_time: this.daily_time
        })
        if(v.code === 0){
          this.isShowEdit = false
          this.requestInitData()
          IsMessage("success", this.$t('Successful'));
        }else{
          IsMessage("error", v.msg);
        }
      },
      changeDailyTime(val) {
        if (val.length === this.checkAllData.length) {
            this.indeterminate = false;
            this.checkAll = true;
        } else if (val.length > 0) {
            this.indeterminate = true;
            this.checkAll = false;
        } else {
            this.indeterminate = false;
            this.checkAll = false;
        }
      },
      /* 获取最近的30天 */
      getThirtyDays(){
        let date = new Date();
        let weekArr = ["日", "一", "二", "三", "四", "五", "六"];
        let tData = []
        for(var i = 0; i < 30; i++){
          let year = date.getFullYear(),
          month = date.getMonth() + 1,
          day = date.getDate(),
          week = date.getDay();
          tData.push({
            year: year,
            month: month,
            day: day,
            week: weekArr[week],
            dateTime: `${year}-${month}-${day}`
          })
          date.setDate(date.getDate() + 1);
        }
        this.wholeMonth = tData
        this.dateVal = this.wholeMonth[0].dateTime
      },
      selectDay(item,index){
        this.clearAll();
        this.currentDay = index;
        this.dateVal = item.dateTime
        this.requestInitData()
      },
      /* 清空多选框 */
      clearAll(){
        this.indeterminate = false;
        this.daily_time = [];
      }
    }
}
</script>
<style lang="less">
.schedulingModal{
  .dailyPart{
    .swiper-container{
      margin: 0 38px;
      width: calc(100% - 76px);
      height: 60px;
      .swiper-wrapper{
        .swiper-slide{
          height: 60px;
          line-height: 60px;
          .activeBtn{
            background: #499df1;
            color: #fff;
          }
        }
      }
    }
    .swiperBtn{
      position: absolute;
      top: 32px;
      &:hover{
        cursor: pointer;
      }
      &:focus{
        outline-width: 0px;
      }
    }
    .swiperBtnLeft{
      left: 15px;
    }
    .swiperBtnRight{
      right: 15px;
    }
    .operateBtn{
      margin-top: 20px;
      text-align: center;
    }
    .timeShow{
      .btnCycle{
        width: 80px;
        height: 60px; 
        margin: 5px;
        
      }
      .btnChecked{
        background: rgba(26, 188, 156, 1);
        color: #fff;
      }
    }
    .timeEdit{
      .boxCycle{
        width: 112px;
        height: 60px;
        display: inline-block; 
        margin: 5px;
        background: rgba(26, 188, 156, 1);
        border: 1px solid rgba(26, 188, 156, 1);
        padding: 5px;
        border-radius: 5px;
        .ivu-checkbox-wrapper{
          width: 100%;
          span{
            color: #fff;
          }
        }
        .ivu-checkbox{
          float: right;
          .ivu-checkbox-inner{
            border-radius: 50%;
            border-color: #fff;
          }
          .ivu-checkbox-input{
            color: rgba(26, 188, 156, 1);
          }
        }
        .ivu-checkbox-checked .ivu-checkbox-inner{
          border-color: #fff;
          background: #f90;
          &:after{
            border-color: #fff;
          }
        }
      }
      /* .boxChecked{
        background: rgba(26, 188, 156, 1);
      } */
      .capacity{
        strong{
          font-size: 12px;
          width: 40px;
          display: inline-block;
          color: #fff;
        }
        .ivu-input-wrapper{
          width: calc(100% - 40px)!important;
        }
      }
    }
    
    
    
  }
}
</style>
