<template>
  <div class="panel">
    <div class="panel-wrapper" v-for="(item, index) in list" :key="index">
      <div class="number" :class="type" :key="refKey">
        <template v-if="countTo">
          <count-to class="card-panel-num" :suffix="item.suffix || ''" :decimals="item.decimals === 0 ? 0 : 2" :startVal="0" :endVal="item.value" :duration="1000"></count-to>
        </template>
        <template v-else>
          <span v-if="formatNumber">{{ numberFormat(item.value) }}</span>
          <span v-else>{{ item.value }}</span>
        </template>
      </div>
      <div class="distr" :class="type">
        <span>{{item.text}}</span>
      </div>
    </div>
  </div>
</template>
<script>
  import CountTo from 'vue-count-to'
  import {
    _func
  } from '@/business/baseFunc'
  export default {
    components: {
      CountTo
    },
    props: {
      list: {
        type: Array,
        default: []
      },
      type: {
        type: String,
        default: 'success'
      },
      countTo: {
        type: Boolean,
        default: true
      },
      formatNumber: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        refKey: Math.random()
      }
    },
    watch: {
      list(n) {
        this.refKey = Math.random()
      }
    },
    methods: Object.assign(_func(), {

    })
  }
</script>
<style lang="scss" scoped>
  .panel {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 16px;

    .panel-wrapper {
      margin-right: 54px;
      margin-bottom: 16px;

      .number {
        font-size: 24px;
        padding: 8px 0;
      }

      .success {
        background: linear-gradient(to right, rgb(28, 172, 28), rgb(150, 201, 151));
        -webkit-background-clip: text;
        color: transparent;
      }

      .warning {
        background: linear-gradient(to right, rgb(240, 83, 5), rgb(121, 97, 87));
        -webkit-background-clip: text;
        color: transparent;
      }

      .error {
        background: linear-gradient(to right, rgb(247, 9, 9), rgb(241, 121, 121));
        -webkit-background-clip: text;
        color: transparent;
      }

      .info {
        background: linear-gradient(to right, rgb(46, 45, 45), rgb(180, 165, 165));
        -webkit-background-clip: text;
        color: transparent;
      }

      .distr {
        font-size: 14px;
      }
    }
  }
</style>
