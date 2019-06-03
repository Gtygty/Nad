<template>
  <div class="dailyPart">
    <Card>
      <Spin fix  v-if="spinShow" style="z-index:1000">
        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>
      <div class="swiper-container dailySwiper" ref="dailySwiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item,index) in wholeMonth" :key="index">
            <Button
              @click="selectDay(item,index)"
              :class="{activeBtn: currentDay === index}"
            >{{`${item.week} ${item.month}/${item.day}`}}</Button>
          </div>
        </div>
      </div>
      <img src="@/assets/left.svg" class="swiperBtn swiperBtnLeft" width="30">
      <img src="@/assets/right.svg" class="swiperBtn swiperBtnRight" width="30">
      <div class="timeShow" v-show="!isShowEdit">
        <Button
          v-for="(item,index) in timeData"
          :key="index"
          class="btnCycle"
          :class="{btnChecked: item.status === 0 ? false : true}"
        >
          {{item.time}}
          <p v-if="scheType === 'store' && item.capacity != 0">
            <strong>{{`${$t('backend.capacity')}：`}}</strong>{{item.capacity}}
          </p>
        </Button>
      </div>
      <div class="timeEdit" v-show="isShowEdit">
        <Checkbox
          :value="checkAll"
          @click.prevent.native="handleCheckAll"
          style="margin-left: 5px;"
        >{{$t('selectAll')}}</Checkbox>
        <CheckboxGroup v-model="daily_time" @on-change="changeDailyTime">
          <span
            v-for="(item,index) in timeData"
            :key="index"
            class="boxCycle"
            :class="{boxChecked: item.status === 0 ? false : true,boxHeight: scheType === 'store' ? true:false}"
          >
            <Checkbox :label="item.time"></Checkbox>
            <div class="capacity" v-if="scheType === 'store'">
              <strong>{{`${$t('backend.capacity')}：`}}</strong>
              <InputNumber :max="999" :min="0" v-model="item.capacity" size="small" :disabled="item.status === 0"></InputNumber>
            </div>
          </span>
        </CheckboxGroup>
      </div>
      <div class="operateBtn">
        <div v-if="!isShowEdit">
          <Button type="primary" @click="edit" style="width: 100%;">{{$t('Edit')}}</Button>
        </div>
        <div v-else>
          <Button @click="toBack">{{$t('goback')}}</Button>
          <Button @click="toReset">{{$t('reset')}}</Button>
          <Button type="primary" @click="submit" :loading="submitLoading">{{$t('submit')}}</Button>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import { CODE_OK, IsAlert, AjaxApi, IsMessage } from "@/utils/api";
import {
  daily_set
} from "@/api/organize/nurse";
import {
  store_daily_set
} from "@/api/organize/store";
import swiper from "swiper";
export default {
  name: "dailyPart",
  data() {
    return {
      isShowEdit: false,
      daily_time: [],
      indeterminate: false,
      checkAll: false,
      timeData: [],
      checkAllData: [],
      dailySwiper: null,
      currentDay: 0,
      wholeMonth: [],
      dateVal: "",
      submitLoading: false
    };
  },
  props: {
    nurse_id: {
      type: [Number, String],
      default() {
        return null;
      }
		},
		dailyData: {
      type: Array,
      default() {
        return [];
      }
		},
		scheType: {
			type: String,
			default(){
				return ''
			}
    },
    spinShow: {
      type: Boolean,
      default(){
        return false
      }
    }
	},
	watch: {
		dailyData(){
			this.initData()
		}
	},
  computed: {
    weekdata(){
      return [
        this.$t('nurse.sun'),
        this.$t('nurse.mon'),
        this.$t('nurse.tues'),
        this.$t('nurse.wed'),
        this.$t('nurse.thur'),
        this.$t('nurse.fri'),
        this.$t('nurse.sat')
      ]
    }
  },
  created() {
		this.initData()
		this.dailyInit();
    this.getThirtyDays();
  },
  mounted() {},
  methods: {
		initData(){
			this.timeData = this.dailyData;
			this.daily_time = this.dailyData.reduce((arr, v) => {
				if (v.status === 1) {
					arr.push(v.time);
				}
				return arr;
			}, []);
			this.changeDailyTime(this.daily_time);
			this.checkAllData = this.dailyData.reduce((arr, v) => {
				arr.push(v.time);
				return arr;
			}, []);
		},
    dailyInit() {
      this.$nextTick(() => {
        this.dailySwiper = new swiper(this.$refs.dailySwiper, {
          slidesPerView: 6,
          spaceBetween: 8,
          freeMode: true,
          navigation: {
            nextEl: ".swiperBtnRight",
            prevEl: ".swiperBtnLeft"
          },
          observer: true,
          observeParents: true
        });
      });
    },
    handleCheckAll() {
      this.checkAll = !this.checkAll;
      if (this.checkAll) {
        this.daily_time = this.checkAllData;
      } else {
        this.daily_time = [];
      }
      this.isDiasbledCheck()
    },
    toBack() {
      this.isShowEdit = false;

      this.$emit('requestDailyData',this.dateVal)
    },
    toReset(){
      this.checkAll = false
      this.daily_time = [];
      this.isDiasbledCheck()
    },
    edit() {
      this.isShowEdit = true;
    },
    async submit() {
      this.submitLoading = true
      let v;
      switch(this.scheType){
        case 'nurse':
          v = await daily_set({
            nurse_id: this.nurse_id,
            daily: this.dateVal,
            free_time: this.daily_time
          });
          break;
        case 'store':
          let timeParams = [''];
          if(this.daily_time.length > 0){
            let tData = this.timeData.filter( val => this.daily_time.includes(val.time))
            timeParams = tData.reduce( (arr,v) => {
              arr.push({
                time: v.time,
                capacity: v.capacity ? v.capacity : 0
              })
              return arr
            },[])
          }
          v = await store_daily_set({
            store_id: this.nurse_id,
            daily: this.dateVal,
            free_time: timeParams
          });
          break;
      }
      
      if (v.code === 0) {
        this.isShowEdit = false;
        this.$emit('requestDailyData',this.dateVal)
        IsMessage("success", this.$t("Successful"));
      } else {
        IsMessage("error", v.msg);
      }
      this.submitLoading = false
    },
    isDiasbledCheck(){
      /* 不选择checkbox，则禁用 */
      this.timeData.map( val => {
        if(this.daily_time.includes(val.time)){
          val.status = 1
        }else{
          val.status = 0
          val.capacity = 0
        }
      })
    },
    changeDailyTime(val) {
      this.isDiasbledCheck()
      if (val.length != 0 && val.length === this.checkAllData.length) {
        this.checkAll = true;
      } else if (val.length > 0) {
        this.checkAll = false;
      } else {
        this.checkAll = false;
      }
    },
    /* 获取最近的30天 */
    getThirtyDays() {
      let date = new Date();
      //let weekArr = ["日", "一", "二", "三", "四", "五", "六"];
      let weekArr = this.weekdata.reduce( (arr,v) => {
        arr.push(v)
        return arr
      },[])
      let tData = [];
      for (var i = 0; i < 30; i++) {
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
        });
        date.setDate(date.getDate() + 1);
      }
      this.wholeMonth = tData;
      this.dateVal = this.wholeMonth[0].dateTime;
    },
    selectDay(item, index) {
      this.clearAll();
      this.currentDay = index;
      this.dateVal = item.dateTime;
      this.$emit('requestDailyData',this.dateVal)
    },
    /* 清空多选框 */
    clearAll() {
      this.indeterminate = false;
      this.daily_time = [];
    }
  },
  components: {}
};
</script>
<style lang="less">
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
    p{
      margin-top: 5px;
    }
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
		.boxHeight{
			height: 60px!important;
		}
		.boxCycle{
			width: 112px;
			height: 35px;
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
		.capacity{
			strong{
				font-size: 12px;
				width: 36px;
				display: inline-block;
				color: #fff;
			}
      .ivu-input-number{
        width: calc(100% - 41px)!important;
        .ivu-input-number-input{
          padding-left: 5px;
        }
      }
		}
	}
}
</style>
