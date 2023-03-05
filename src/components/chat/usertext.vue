<template>
  <div id="uesrtext">
    <div class="toolBox">
      <el-popover placement="top-start" width="200" trigger="click" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
        <i slot="reference" class="el-icon-mic"></i>
      </el-popover>
      <el-popover placement="top-start" width="200" trigger="click" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
        <i slot="reference" class="el-icon-picture-outline"></i>
      </el-popover>
      <el-popover placement="top-start" width="200" trigger="click" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
        <i slot="reference" class="el-icon-s-comment"></i>
      </el-popover>
    </div>
    <textarea placeholder="按 Ctrl + Enter 发送" v-model="content" v-on:keyup="addMessage"></textarea>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'uesrtext',
  data () {
    return {
      content:''
    }
  },
  computed:mapState([
    'currentSession'
  ]),
  methods: {
  	addMessage (e) {
  		if (e.ctrlKey && e.keyCode ===13 && this.content.length) {
        //发远程
        let obj = new Object()
        obj.to = this.currentSession.username
        obj.content = this.content
        this.$store.state.stomp.send('/ws/chat',{},JSON.stringify(obj))
        //改本地
        this.$store.commit('addMessage',obj);
  			this.content='';
  		}
  	}
  }
}
</script>

<style lang="scss" scoped>
.toolBox {
  display: felx;
  justify-content: flex-start;
}

i {
  margin-left: 5px;
  height: 20px;
  cursor: pointer;
}

#uesrtext {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 30%;
  border-top: solid 1px #DDD;

  >textarea {
    padding: 10px;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
  }
}
</style>
