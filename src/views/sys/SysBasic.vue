<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="部门管理" name="first">
        <DepMana />
      </el-tab-pane>
      <el-tab-pane label="职位管理" name="second">
        <PosMana />
      </el-tab-pane>
      <el-tab-pane label="职称管理" name="third">
        <JoblevelMana />
      </el-tab-pane>
      <el-tab-pane label="奖罚规则" name="fourth">
        <EcMana />
      </el-tab-pane>
      <el-tab-pane label="权限组" name="five">
        <PermissMana />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DepMana from '@/components/sys/basic/DepMana.vue';
import EcMana from '@/components/sys/basic/EcMana.vue';
import JoblevelMana from '@/components/sys/basic/JoblevelMana.vue';
import PermissMana from '@/components/sys/basic/PermissMana.vue';
import PosMana from '@/components/sys/basic/PosMana.vue';

export default {
    data() {
        return {
            activeName: "first"
        };
    },
    components: { DepMana, JoblevelMana, PermissMana, EcMana, PosMana }
}
</script>

<style>

</style>