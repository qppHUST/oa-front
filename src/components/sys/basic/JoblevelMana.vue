<template>
	<div>
		<div>
			<el-input v-model="jl.name" placeholder="添加职称等级" prefix-icon="el-icon-plus" style="width:300px" size="small" />
			<el-select v-model="jl.titleLevel" placeholder="请选择职称等级" size="small" style="margin-left:6px;margin-right: 6px;">
				<el-option v-for="item in titleLevels" :key="item" :label="item" :value="item">
				</el-option>
			</el-select>
			<el-button type="primary" size="small" @click="addJl">添加</el-button>
		</div>
		<div>
			<el-table :data="jls" stripe style="width: 70%;margin-top: 10px;" border
				@selection-change="handleSelectionChange">
				<el-table-column type="selection" />
				<el-table-column prop="id" label="编号" width="55" />
				<el-table-column prop="name" label="职称名" width="150" />
				<el-table-column prop="titleLevel" label="职称等级" width="150" />
				<el-table-column prop="createDate" label="创建日期" width="150" />
				<el-table-column prop="enabled" label="是否启用" width="150">
					<template slot-scope="scope">
						<el-tag v-if="scope.row.enabled" type="success">已启用</el-tag>
						<el-tag v-else type="danger">未启用</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button size="small" @click="showEditView(scope.row)">编辑</el-button>
						<el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-button type="danger" style="margin-top: 10px;" :disabled="this.multipartSelection.length > 0 ? false : true"
				@click="deletejls">批量删除
			</el-button>
			<el-dialog title="编辑" :visible.sync="dialogVisible" width="30%">
				<table>
					<tr>
						<td>
							<el-tag>职称名称</el-tag>
						</td>
						<td>
							<el-input style="width:300px;margin-left: 6px;" v-model="updatejl.name" size="small"></el-input>
						</td>
					</tr>
					<tr>
						<td>
							<el-tag>职称等级</el-tag>
						</td>
						<td>
							<el-select v-model="updatejl.titleLevel" placeholder="请选择职称等级" size="small"
								style="margin-left:6px;margin-right: 6px;">
								<el-option v-for="item in titleLevels" :key="item" :label="item" :value="item">
								</el-option>
							</el-select>
						</td>
					</tr>
					<tr>
						<td>
							<el-tag>是否启用</el-tag>
						</td>
						<td>
							<el-switch v-model="updatejl.enabled" active-color="#13ce66" inactive-color="#ff4949" active-text="已启用"
								inactive-text="未启用">

							</el-switch>
						</td>
					</tr>
				</table>
				<span slot="footer" class="dialog-footer">
					<el-button size="small" @click="dialogVisible = false">取 消</el-button>
					<el-button size="small" type="primary" @click="update">确 定</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
export default {
	data(){
		return {
			jl:{
				name:'',
				titleLevel:""
			},
			titleLevels:[
				"正高级",
				"副高级",
				"中级",
				"初级",
				"员级"
			],
			jls:[],
			updatejl:{
				name:'',
				titleLevel:'',
				enabled:false
			},
			multipartSelection:[],
			dialogVisible:false
		}
	},
	methods:{
		update(){
			this.putRequest('/system/basic/joblevel',this.updatejl).then(resp=>{
				if(resp){
					this.initJls()
					this.dialogVisible = false
				}
			})
		},
		showEditView(row){
			Object.assign(this.updatejl,row)
			this.updatejl.createDate = ''
			this.dialogVisible = true
		},
		deletejls(){
			let ids = "?"
			this.multipartSelection.forEach(item=>{
				ids+="ids="+item.id+"&"
			})
			this.$confirm('此操作将永久删除, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.deleteRequest('/system/basic/joblevel'+ids).then(resp=>{
					if(resp){
						this.initJls()
					}
				})
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
			});
		},
		handleSelectionChange(val){
			this.multipartSelection = val
		},
		handleDelete(row){
			this.$confirm('此操作将永久删除, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.deleteRequest('/system/basic/joblevel/'+row.id).then(resp=>{
					if(resp){
						this.initJls()
						this.$message({
						type: 'success',
						message: '删除成功!'
					});
					}
				})
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
			});
		},
		addJl(){
			if(this.jl.name && this.jl.titleLevel){
				this.postRequest('/system/basic/joblevel',this.jl).then(resp=>{
					if(resp){
						this.initJls();
						this.jl.name = ""
						this.jl.titleLevel =""
					}
				})
			}else{
				this.$message.error("字段不能为空")
			}
		},
		initJls(){
			this.getRequest('/system/basic/joblevel').then(resp=>{
				this.jls = resp
			})
		}
	},
	mounted(){
		this.initJls()
	}
}
</script>

<style>

</style>