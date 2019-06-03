<template>
  <li class="appIcon">
    <div class="iconPlace">
      <span class="iconIncDec" :class="icon.is_fixed!==1&&edit?'showPoint':''" @click="iconClick">
        <Icon :type="plus?'md-add':'md-remove'" class="innerIcon"/>
      </span>
      <Icon :type="plus?'md-lock':'md-unlock'" class="mainIcon"></Icon>
    </div>
    <br>
    <span class="appName">{{icon.menu_name}}</span>
  </li>
</template>

<script>
export default {
  name:'appIcon',
  props:{
    icon:{
      type:Object
    },
    plus:{
      type:Boolean,
      default:false
    },
    edit:{
      type:Boolean,
      default:false
    }
  },
  methods:{
    iconClick(){
      if(this.icon.is_fixed===1||!this.edit){
        console.log(666)
        return
      }
      this.$emit('editApp',{plus:this.plus,id:this.icon.id})
    }
  }
}
</script>

<style lang="stylus" type="stylesheet/stylus">
.appIcon{
  font-size: 12px;
  text-align: center;
  width: 72px;
  height: 68px;
  display: inline-block;
  cursor: pointer;
  &:hover{
    .iconPlace{
      .iconIncDec{
        transform: scale(1);
      }
    }
  }
  .iconPlace {
    display: inline-block;
    width: 32px;
    height: 32px;
    vertical-align: middle;
    background: #90ee90;
    position: relative;
    border-radius: 4px;
    color: #333;
    font-size: 18px;
    line-height: 30px;
    .iconIncDec.showPoint{
      opacity: 1;
    }
    .iconIncDec{
      position: absolute;
      top: -8px;
      right: -6px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      font-size: 12px;
      line-height: 15px;
      overflow: hidden;
      transition: all .3s cubic-bezier(.645,.045,.355,1);
      background: #ed3f14;
      opacity: 0;
      transform: scale(.7) translateZ(0);
      .innerIcon{
        color: #fff;
        line-height: 18px;
        vertical-align: middle;
      }
    }
    .mainIcon{
      display: inline-block;
      width: 100%;
      text-align: center;
      vertical-align: middle;
    }

  }
  .appName{
    display:inline-block;
    width:100%;
    text-align:center;
  }
}

</style>
