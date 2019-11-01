<template>
  <div>
    <svg t="1537860224668" @click="dialogBaseStatus = true" class="qrcode-svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1031" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32">
      <path d="M876 404h-63.008v103.008h-91.008v-103.008h-152.992V301.984h-51.008V262.976h51.008V210.976h51.008V147.968h-51.008V96.96h-166.016v63.008h103.008v39.008h-52v115.008h52v90.016h-52v52h-90.016v-52H300.96v52H261.952v-52H146.944v52H95.936v63.008h63.008v-51.008h91.008v51.008h51.008v102.016h63.008v-102.016h102.016v-52h192.992v40h-152.992v63.008h51.008v102.016h114.016v-63.008h-51.008v-39.008h204.992v-51.008H864v51.008h63.008v-63.008h-51.008v-103.008z m-409.984 204.992h-63.008v166.016h51.008v39.008h-51.008v63.008h103.008v51.008h63.008v-51.008h51.008v-63.008h-63.008v51.008h-39.008v-90.016h102.016v-64h-154.016v-102.016zM96 558.016h63.008v63.008H96v-63.008z m56.992-193.024h154.016q23.008 0 40-16.992t16.992-40V153.984q0-23.008-16.992-40t-40-16.992H152.992q-23.008 0-40 16.992T96 153.984v154.016q0 23.008 16.992 40t40 16.992z m6.016-62.976V160h142.016v142.016H159.008z m39.008-103.008h64v64h-64v-64z m672-102.016h-154.016q-23.008 0-40 16.992t-16.992 40v154.016q0 23.008 16.992 40t40 16.992h154.016q24 0 40.512-16.992t16.512-40V153.984q0-23.008-16.512-40t-40.512-16.992zM864 160v142.016h-142.016V160H864z m-101.984 39.008h63.008v64h-63.008v-64z m108 460.992h-154.016q-23.008 0-40 16.992t-16.992 40v154.016q0 24 16.992 40.512t40 16.512h154.016q24 0 40.512-16.512t16.512-40.512v-154.016q0-23.008-16.512-40t-40.512-16.992zM864 723.008v142.016h-142.016v-142.016H864z m-101.984 40h63.008v63.008h-63.008v-63.008zM307.008 660H152.992q-23.008 0-40 16.992T96 716.992v154.016q0 24 16.992 40.512t40 16.512h154.016q23.008 0 40-16.512t16.992-40.512v-154.016q0-23.008-16.992-40t-40-16.992z m-6.016 63.008v142.016H158.976v-142.016h142.016z m-102.976 40h64v63.008h-64v-63.008z" p-id="1032"></path>
    </svg>
    <!-- dialog -->
    <el-dialog :close-on-click-modal="false" v-el-drag-dialog title="我的二维码" :visible.sync="dialogBaseStatus" center>
      <div style="display:flex;justify-content:center" id="qrcode">
        <VueQrcode :value="url" :options="{ size: 200 }"></VueQrcode>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogSubmit()">下载二维码</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import VueQrcode from '@xkeshi/vue-qrcode';
  import auth from '@/utils/auth.js'
  export default {
    name: 'qrcode',
    components: {
      VueQrcode
    },
    props: {
      width: {
        type: Number,
        default: 22
      },
      height: {
        type: Number,
        default: 22
      },
      fill: {
        type: String,
        default: '#48576a'
      }
    },
    data() {
      return {
        dialogBaseStatus: false,
        url: `https://blog.muzlin.cn/${auth.getUserInfo().Id}`
      }
    },
    methods: {
      dialogSubmit() {
        //找到canvas标签
        let myCanvas = document.getElementById('qrcode').getElementsByTagName('canvas');
        //创建一个a标签节点
        let a = document.createElement("a")
        //设置a 标签的href属性（将canvas 变成png图片）
        a.href = myCanvas[0].toDataURL('image/png').replace('image/png', 'image/octet-stream')
        //设置下载文件的名字
        a.download = "我的二维码"
        //点击
        a.click()
        //弹出提示
        this.$message.success({message:'Hey Man, 下载成功了哟, 请记得给好评哦 （づ￣3￣）づ╭❤～ (づ￣ 3￣)づ'})
        this.dialogBaseStatus = false
      }
    }
  }
</script>

<style scoped>
  .qrcode-svg {
    display: inline-block;
    cursor: pointer;
    fill: #5a5e66;
    ;
    width: 20px;
    height: 20px;
    vertical-align: 10px;
  }
</style>
