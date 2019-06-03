<template>
    <div class="schedulingModal">
        <Tabs v-model="tabValue" on-click="clickTab">
          <TabPane label="Daily" name="1"></TabPane>
          <TabPane label="Weekly" name="2"></TabPane>
        </Tabs>
        <dailyPart ref="dailyRef" v-show="tabValue==='1'" v-if="dailyData.length>0" :nurse_id="nurse_id" :dailyData="dailyData" @requestDailyData="requestDailyData" :scheType="scheType" :spinShow="spinShow" />
        <weeklyPart ref="weekRef" v-show="tabValue==='2'" v-if="weeklyData.length>0" :nurse_id="nurse_id" :weeklyData="weeklyData" @requestWeeklyData="requestWeeklyData" :scheType="scheType" :spinShow="spinShow" />
    </div>
</template>
<script>
import {
  daily_show,
  weekly_show
} from "@/api/organize/nurse";
import {
  store_daily_show,
  store_weekly_show
} from "@/api/organize/store";
import dailyPart from "@/components/modal/dailyPart.vue"
import weeklyPart from "@/components/modal/weeklyPart.vue"
import { IsMessage } from "@/utils/api";
export default {
    name: "schedulingModal",
    data () {
        return {
          tabValue: '1',
          nurse_id: '',
          dailyData: [],
          weeklyData: [],
          spinShow: false,
          defaultDaily: 0
        }
    },
    props: {
      scheType: {
        type: String,
        default(){
          return ''
        }
      }
    },
    components: {
      dailyPart,weeklyPart
    },
    computed: {

    },
    created(){

    },
    mounted() {
      
    },
    methods: {
      getReady(id){
        this.nurse_id = id
        let date = new Date()
        this.requestDailyData(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
        this.requestWeeklyData(1)
      },
      /* 天和周初始化 */
      initializeData(){
        this.$nextTick( () => {
          this.$refs.dailyRef.currentDay = 0;
          this.$refs.weekRef.currentDay = 0;
        })
      },
      async requestDailyData(daily) {
        console.log(daily)
        this.spinShow = true
        let v;
        switch(this.scheType){
          case 'nurse':
            v = await daily_show({
              nurse_id: this.nurse_id,
              daily
            });
            break;
          case 'store':
            v = await store_daily_show({
              store_id: this.nurse_id,
              daily
            });
            break;
        }
        if (v.code === 0) {
          this.dailyData = v.data;
        } else {
          IsMessage("error", v.msg);
        }
        this.spinShow = false
      },
      async requestWeeklyData(weekly) {
        this.spinShow = true
        let v;
        switch(this.scheType){
          case 'nurse':
            v = await weekly_show({
              nurse_id: this.nurse_id,
              weekly
            });
            break;
          case 'store':
            v = await store_weekly_show({
              store_id: this.nurse_id,
              weekly
            });
            break;
        }
        if (v.code === 0) {
          this.weeklyData = v.data;
        } else {
          IsMessage("error", v.msg);
        }
        this.spinShow = false
      }
    }
}
</script>
<style lang="less">
</style>
