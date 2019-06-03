<template>
  <div id="app" v-cloak>
    <!-- <router-view/> -->
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    }
  },
  components: {}
};
</script>

<style lang="stylus" type="stylesheet/stylus">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-size: 12px;
  // overflow:hidden
}
[v-cloak] {
  display: none;
}
.ivu-table {
  width: 100%;
}

.flex-from {
  display: flex;

  .form-item {
    flex: 1;
    display: flex;
    .ivu-form-item-label: {
      flex: 0;
    }

    div {
      flex: 1;
    }
  }
}

.ivu-menu-horizontal {
  height: 52px !important;
  line-height: 52px !important;
}
.areaItem{
  .ivu-select-arrow{
    color: #808695;
  }
  .ivu-select-visible .ivu-select-selection{
    border-color: #dcdee2;
    box-shadow: none;
  }
  .ivu-input-prefix{
    .prefixSpan{
      width: 40px;
      height: 32px;
      line-height: 32px;
      display: inline-block;
    }
  }
  .ivu-input-with-prefix{
    padding-left: 40px;
  }
}
</style>
