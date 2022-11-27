<template>
	<div>
		<el-input placeholder="添加职位" suffix-icon="el-icon-plus" v-model="pos.name" class="addPosInput"
			@keydown.enter.native="addPosition" />
		<el-button type="primary" icon="el-icon-plus" @click="addPosition">添加</el-button>
		<el-table :data="positions" style="width: 70%;margin-top: 10px;" stripe border
			@selection-change="handleSelectionChange">
			<el-table-column type="selection"></el-table-column>
			<el-table-column prop="id" label="编号" width="55"></el-table-column>
			<el-table-column prop="name" label="职位" width="120"></el-table-column>
			<el-table-column prop="createDate" label="创建时间" width="200"></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" @click="showEditView(scope.$index, scope.row)">编辑</el-button>
					<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-button type="danger" size="small" style="margin-top:10px" @click="deleteList"
			:disabled="this.multipartSelection.length > 0 ? false : true"> 批量删除
		</el-button>
		<el-dialog title="编辑" :visible.sync="dialogVisible" width="30%">
			<div>
				<el-tag>职位名称</el-tag>
				<el-input v-model="updatePos.name" class="updatePosInput" size="small"></el-input>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button size="small" @click="dialogVisible = false">取 消</el-button>
				<el-button size="small" type="primary" @click="update">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data(){
		return{
			pos:{
				name:""
			},
			positions:[],
			dialogVisible: false,
			updatePos:{
				name:""
			},
			multipartSelection:[]
		}
	},
	methods:{
		deleteList(){
			let ids = "?"
			this.multipartSelection.forEach(item=>{
				ids+="ids="+item.id+"&"
			})

			this.$confirm('此操作将永久删除, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.deleteRequest('/system/basic/pos'+ids).then(resp=>{
					if(resp){
						this.initPositions()
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
			this.multipartSelection = val;
		},
		update(){
			this.putRequest('/system/basic/pos',this.updatePos).then(resp=>{
				if(resp){
					this.initPositions()
					this.dialogVisible = false
				}
			})
		},
		addPosition(){
			if(this.pos.name){
				this.postRequest('/system/basic/pos',this.pos).then(resp=>{
					if(resp){
						this.initPositions();
					}
				})
			}else{
				this.$message.error("请输入职位名")
			}
		},
		initPositions(){
			this.getRequest('/system/basic/pos').then(resp=>{
				if(resp){
					this.positions = resp;
					this.pos.name = ''
				}
			})
		},
		showEditView(index, row) {
			Object.assign(this.updatePos,row)
			this.updatePos.createDate = ''
			this.dialogVisible = true
    },
    handleDelete(index, row) {
			this.$confirm('此操作将永久删除, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.deleteRequest('/system/basic/pos/'+row.id).then(resp=>{
					if(resp){
						this.initPositions()
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
    }
	},
	mounted(){
		this.initPositions()
	}
}
</script>

<style scoped>
.addPosInput {
	width: 300px;
	margin-right: 10px;
}

.updatePosInput {
	width: 200px;
	margin-left: 10px;
}
</style>