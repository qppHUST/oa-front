<template>
	<div>

		<div class="permissManaTool">
			<el-input placeholder="请输入角色英文名" v-model="role.name" size="small">
				<template slot="prepend">ROLE_</template>
			</el-input>
			<el-input size="small" placeholder="请输入中文名称" v-model="role.nameZh"></el-input>
			<el-button type="primary" size="small" @click="addRole">添加</el-button>
		</div>

		<div class="permissManaMain">
			<el-collapse accordion @change="change">
				<el-collapse-item v-for="r, index in roles" :key="index" :title="r.nameZh" :name="r.id">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span>可访问资源</span>
							<el-button style="float: right; padding: 3px 0;color: red;" type="text" icon="el-icon-delete"
								@click="deleteRole(r)">
							</el-button>
						</div>
						<div>
							<el-tree show-checkbox :data="allMenus" :props="defaultProps" :default-checked-keys="selectMenus"
								node-key="id" ref="tree" v-model="activeName" :key="index"></el-tree><!-- 两个key都是数据中的id  -->
							<div style="display:flex;justify-content:flex-end">
								<el-button size="mini" @click="cancelDelete">取消修改</el-button>
								<el-button size="mini" type="primary" @click="doupdate(r.id, index)">确认修改</el-button>
							</div>
						</div>
					</el-card>
				</el-collapse-item>
			</el-collapse>
		</div>

	</div>
</template>

<script>
export default {
data(){
	return {
		role:{
			name:'',
			nameZh:''
		},
		roles:[],
		allMenus:[],
		defaultProps:{
			children:'children',
			label:'name'
		},
		selectMenus:[],
		activeName:"-1"
	}
},
methods:{
	deleteRole(role){
		this.$confirm('此操作将永久删除, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.deleteRequest('/system/basic/permiss/'+role.id).then(resp=>{
					if(resp){
						this.initPermiss()
					}
				})
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
			});
	},
	addRole(){
		if(this.role.name && this.role.nameZh){
			this.postRequest('/system/basic/permiss/role',this.role).then(resp=>{
				if(resp){
					this.role.name = ''
					this.role.nameZh = ''
					this.initPermiss()
				}
			})
		}else{
			this.$message.error('输入所需字段')
		}
	},
	cancelDelete(){
		this.activeName = -1
	},
	doupdate(rid,index){
		let tree = this.$refs.tree[index]
		let checkedKeys = tree.getCheckedKeys(true);
		let url = '/system/basic/permiss?rid='+rid;
		checkedKeys.forEach(item=>{
			url+="&mids="+item
		});
		this.putRequest(url).then(resp=>{
			if(resp){
				this.activeName = "-1"
				console.log(this.activeName)
			}
		})
	},
	initSelectMenus(rid){
		this.getRequest('/system/basic/permiss/mid/'+rid).then(resp=>{
			if(resp){
				this.selectMenus = resp
			}
		})
	},
	handleCheckChange(data, checked, indeterminate) {
        // console.log(data, checked, indeterminate);
  },
	change(rid){
		//是collapase改变时候的回调函数
		if(rid){
			this.initAllMenus()
			this.initSelectMenus(rid)
		}
	},
	initAllMenus(){
		this.getRequest('/system/basic/permiss/menus').then(resp=>{
			if(resp){
				this.allMenus = resp
			}
		})
	},
	initPermiss(){
		this.getRequest('/system/basic/permiss').then(resp=>{
			if(resp){
				this.roles = resp
			}
		})
	}
},
mounted(){
	this.initPermiss()
}
}
</script>

<style>
.permissManaTool {
	display: flex;
	justify-content: flex-start;
}

.permissManaTool .el-input {
	width: 300px;
	margin-right: 6px;
}

.permissManaMain {
	margin-top: 10px;
	width: 700px;
}
</style>