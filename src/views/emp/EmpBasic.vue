<template>
  <div>
    <div style="display:flex;justify-content:space-between">
      <div>
        <el-input prefix-icon="el-icon-search" placeholder="请输入员工名进行搜索..." @clear="initEmps" clearable v-model="empName"
          style="width: 300px;margin-right: 10px;">
        </el-input>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button>
          <i class="fa fa-angle-double-down" aria-hidden="true"></i> 高级搜索
        </el-button>
      </div>
      <div>
        <el-upload class="upload-demo" action="/employee/basic/import" style="display: inline-flex;margin-right: 8px;"
          :show-file-list="false" :before-upload="beforeUpload" :on-success="onSuccess" :on-error="onError"
          :disabled="importDataBtnDisabled" :headers="headers">
          <el-button type="success" :icon="importDataBtnIcon" :disabled="importDataBtnDisabled"> {{ importDataBtnText }}
          </el-button>
        </el-upload>
        <el-button type="success" @click="exportData" icon="el-icon-download"> 导出数据
        </el-button>
        <el-button type="success" icon="el-icon-plus" @click="showDialog"> 添加员工</el-button>
      </div>
    </div>
    <div style="border: 1px solid #409eff;border-radius:5px;box-sizing:border-box;padding:5px; margin: 10px 0">

    </div>
    <div style="margin-top: 10px;">
      <el-table :data="emps" stripe border v-loading="loading" element-loading-text="加载中"
        element-loading-spinner="el-icon-loading" element-loading-background="rgba(0,0,0,0.8)" style="width: 100%">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="name" align="left" label="姓名" width="45" fixed />
        <el-table-column prop="workID" align="left" label="工号" />
        <el-table-column prop="gender" label="性别" width="35" />
        <el-table-column prop="birthday" label="生日" align="left" width="90" />
        <el-table-column prop="idCard" label="身份证号" width="150" />
        <el-table-column prop="wedlock" label="婚姻状况" width="45" />
        <el-table-column prop="nation.name" label="民族" width="45" />
        <el-table-column prop="nativePlace" label="籍贯" width="60" />
        <el-table-column prop="politicsStatus.name" label="政治面貌" />
        <el-table-column prop="email" label="邮箱" align="left" width="160" />
        <el-table-column prop="phone" label="电话号码" width="100" />
        <el-table-column prop="address" label="联系地址" width="260" />
        <el-table-column prop="department.name" label="所属部门" align="left" width="60" />
        <el-table-column prop="joblevel.name" label="职称" width="90" />
        <el-table-column prop="position.name" label="职位" width="90" />
        <el-table-column prop="engageForm" label="聘用形式" />
        <el-table-column prop="tiptopDegree" label="最高学历" />
        <el-table-column prop="school" label="学校" width="150" />
        <el-table-column prop="specialty" label="专业" width="90" />
        <el-table-column prop="workState" label="在职状态" width="70" />
        <el-table-column prop="beginDate" label="入职日期" width="95" />
        <el-table-column prop="conversionTime" label="转正日期" width="95" />
        <el-table-column prop="beginContract" label="合同起始日期" width="95" />
        <el-table-column prop="endContract" label="合同结束日期" width="95" />
        <el-table-column prop="contractTerm" label="合同期限">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.contractTerm }}</el-tag>年
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button style="padding: 3px;" size="mini" type="primary" @click="showEditView(scope.row)">编辑</el-button>
            <el-button style="padding: 3px;" size="mini" type="primary">查看高级资料</el-button>
            <el-button style="padding: 3px;" size="mini" type="danger" @click="deleteEmp(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content:flex-end">
        <el-pagination @current-change="currentChange" background layout="sizes,prev, pager, next,jumper,->,total"
          :total="total" @size-change="sizeChange">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="80%">
      <div>
        <el-form ref="empForm" :model="emp" :rules="rules">
          <el-row>
            <el-col :span="6">
              <el-form-item label="姓名" prop="name">
                <el-input prefix-icon="el-icon-edit" size="mini" style="width: 150px;" v-model="emp.name"
                  placeholder="请输入员工姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="emp.gender" style="margin-top: 8px;">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出生日期" prop="birthday">
                <el-date-picker size="mini" style="width: 150px;" v-model="emp.birthday" type="date"
                  value-format="yyyy-MM-dd" placeholder="出生日期" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="政治面貌" prop="politicId">
                <el-select v-model="emp.politicId" size="mini" style="width: 200px;" placeholder="政治面貌">
                  <el-option v-for="item in politicsStatus" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="民族" prop="nationalId">
                <el-select v-model="emp.politicId" size="mini" style="width: 150px;" placeholder="民族">
                  <el-option v-for="item in nations" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="籍贯" prop="nativePlace">
                <el-input style="width: 120px;" v-model="emp.nativePlace" prefix-icon="el-icon-edit" placeholder="输入籍贯">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电子邮箱" prop="email">
                <el-input size="mini" v-model="emp.email" style="width: 150px;" placeholder="输入邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="联系地址" prop="address">
                <el-input size="mini" style="width: 200px;" v-model="emp.address" placeholder="输入地址" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="职位" prop="posId">
                <el-select v-model="emp.posId" size="mini" style="width: 150px;" placeholder="职位">
                  <el-option v-for="item in positions" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="职称" prop="jobLevelId">
                <el-select v-model="emp.jobLevelId" size="mini" style="width: 150px;" placeholder="职称">
                  <el-option v-for="item in jobLevels" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属部门" prop="departmentId">
                <el-popover placement="bottom" title="选择" width="200" trigger="manual" v-model="visible">
                  <el-tree :data="allDeps" :props="defaultProps" default-expand-all @node-click="hanleNodeClick" />
                  <div
                    style="width: 150px;display:inline-flex;border:1px solid #dedede;height:24px;border-radios:5px;cursor:pointer;align-items: center;font-size: 13px;padding-left: 8px;box-sizing: border-box;"
                    @click="showDepView" slot="reference">{{ inputDepName }}</div>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="电话号码" prop="phone">
                <el-input size="mini" style="width: 200px;" prefix-icon="el-icon-phone" v-model="emp.phone"
                  placeholder="输入电话号码" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="工号" prop="workID">
                <el-input v-model="emp.workID" style="width: 150px;" placeholder="输入" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="学历" prop="tiptopDegree">
                <el-select v-model="emp.tiptopDegree" size="mini" style="width: 150px;" placeholder="学历">
                  <el-option v-for="item in tiptopDegree" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="毕业院校" prop="school">
                <el-input size="mini" v-model="emp.school" style="width: 150px;" placeholder="输入学校"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="专业名称" prop="specialty">
                <el-input size="mini" style="width: 200px;" v-model="emp.specialty" placeholder="输入专业名称" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="入职日期" prop="beginDate">
                <el-date-picker size="mini" style="width: 130px;" v-model="emp.beginDate" type="date"
                  value-format="yyyy-MM-dd" placeholder="入职日期" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="转正日期" prop="conversionTime">
                <el-date-picker size="mini" style="width: 130px;" v-model="emp.conversionTime" type="date"
                  value-format="yyyy-MM-dd" placeholder="转正日期" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同起始日期" prop="beginContract">
                <el-date-picker size="mini" style="width: 130px;" v-model="emp.beginContract" type="date"
                  value-format="yyyy-MM-dd" placeholder="合同起始日期" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="合同结束日期" prop="endContract">
                <el-date-picker size="mini" style="width: 190px;" v-model="emp.endContract" type="date"
                  value-format="yyyy-MM-dd" placeholder="合同结束日期" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="身份证号码" prop="idCard">
                <el-input v-model="emp.idCard" style="width: 150px;" placeholder="输入身份证号码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="聘用形式" prop="engageForm">
                <el-radio-group v-model="emp.engageForm" style="margin-top: 8px;">
                  <el-radio label="劳动合同">劳动合同</el-radio>
                  <el-radio label="劳务合同">劳务合同</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="婚姻状况" prop="wedlock">
                <el-radio-group v-model="emp.wedlock" style="margin-top: 8px;">
                  <el-radio label="已婚">已婚</el-radio>
                  <el-radio label="未婚">未婚</el-radio>
                  <el-radio label="离异">离异</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEmp" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:"empbasic",
  data(){
    return {
      headers:{
        Authorization:window.sessionStorage.getItem('tokenStr')
      },
      importDataBtnDisabled:false,
      importDataBtnText:'导入数据',
      importDataBtnIcon:'el-icon-upload2',
      title:"",
      rules:{
        name: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        gender: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        birthday: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        idCard: [
          { required: true, message: '请输入字段', trigger: 'blur' },
          { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '格式不对', trigger: 'blur'}
        ],
        wedlock: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        nationId: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        nativePlace: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        politicId: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入字段', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不对', trigger: 'blur'}
        ],
        phone: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        address: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        departmentId: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        jobLevelId: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        posId: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        engageForm: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        tiptopDegree: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        specialty: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        school: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        beginDate: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        workState: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        workID: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        contractTerm: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        conversionTime: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        notWorkDate: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        beginContract: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        endContract: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        workAge: [{ required: true, message: '请输入字段', trigger: 'blur' }],
        salaryId: [{ required: true, message: '请输入字段', trigger: 'blur' }]
      },
      loading:false,
      allDeps:[],
      defaultProps:{
        children:"children",
        label:"name"
      },
      visible:false,
      inputDepName:"",
      emps:[],
      loading:false,
      total:0,
      currentPage:1,
      size:10,
      empName:"",
      dialogVisible:false,
      nations:[],
      jobLevels:[],
      politicsStatus:[],
      positions:[],
      tiptopDegree:['博士','硕士','本科','大专','高中','初中','小学','其他'],
      options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
      emp:{ 
        id: null,
        name: "",
        gender: "",
        birthday: "",
        idCard: "",
        wedlock: "",
        nationId: null,
        nativePlace: "",
        politicId: null,
        email: "",
        phone: "",
        address: "",
        departmentId: null,
        jobLevelId: null,
        posId: null,
        engageForm: "",
        tiptopDegree: "",
        specialty: "",
        school: "",
        beginDate: "",
        workState: "在职",
        workID: "",
        contractTerm: null,
        conversionTime: "",
        notWorkDate: null,
        beginContract: "",
        endContract: "",
        workAge: null,
        salaryId: null,
        nation: {
          id: null,
          name: ""
        },
        politicsStatus: {
          id: null,
          name: ""
        },
        department: {
          id: null,
          name: "",
          parentId: null,
          depPath: null,
          enabled: null,
          isParent: null,
          children: null,
          result: null
        },
        joblevel: {
          id: null,
          name: "",
          titleLevel: null,
          createDate: null,
          enabled: null
        },
        position: {
          id: null,
          name: "",
          createDate: null,
          enabled: null
        },
        salary: null
      }
    }
  },
  methods:{
    onSuccess(){
      this.importDataBtnIcon='el-icon-upload2'
      this.importDataBtnText='导入数据'
      this.importDataBtnDisabled = false
      this.initEmps()
    },
    onError(){
      this.importDataBtnIcon='el-icon-upload2'
      this.importDataBtnText='导入数据'
      this.importDataBtnDisabled = false
    },
    beforeUpload(){
      this.importDataBtnDisabled = true
      this.importDataBtnIcon='el-icon-loading'
      this.importDataBtnText='正在导入'
    },
    exportData(){
      this.downloadRequest('/employee/basic/export').then(resp=>{
        console.log(111)
      }).catch(e=>{
        console.log(222)
      })
    },
    showEditView(data){
      this.title = '编辑'
      this.emp = data;
      this.inputDepName = data.department.name
      this.initPositions()
      this.dialogVisible = true
    },
    deleteEmp(data){
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.deleteRequest('/employee/basic/'+data.id).then(resp=>{
					if(resp){
						this.initEmps()
					}
				})
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
			});
    },
    hanleNodeClick(data){
      this.inputDepName = data.name
      this.emp.departmentId = data.id
      this.visible = !this.visible
    },
    showDepView(){
      this.visible = !this.visible
    },
    getMaxWorkId(){
      this.getRequest('/employee/basic/maxWorkID').then(resp=>{
        if(resp){
          this.emp.workID = resp.obj
        }
      })
    },
    initPositions(){
      this.getRequest('/employee/basic/positions').then(resp=>{
        if(resp){
          this.positions = resp
        }
      })
    },
    addEmp(){
      this.loading = true
      if(this.emp.id){
        this.$refs['empForm'].validate(valid=>{
        if(valid){
          this.putRequest('/employee/basic',this.emp).then(resp=>{
            if(resp){
              this.loading = false
              this.dialogVisible = false
              this.initEmps()
            }
          })
        }else{
          this.$message.error('表单验证不通过')
        }
      })
      }else{
        this.$refs['empForm'].validate(valid=>{
        if(valid){
          this.postRrquest('/employee/basic',this.emp).then(resp=>{
            if(resp){
              this.loading = false
              this.dialogVisible = false
              this.initEmps()
            }
          })
        }else{
          this.$message.error('表单验证不通过')
        }
      })
      }
      
      
    },
    initData(){
      if(!window.sessionStorage.getItem('nations')){
        this.getRequest('/employee/basic/nations').then(resp=>{
          if(resp){
            this.nations = resp;
            window.sessionStorage.setItem('nations',JSON.stringify(resp))
          }
        })
      }else{
        this.nations = JSON.parse(window.sessionStorage.getItem('nations'))
      }
      if(!window.sessionStorage.getItem('jobLevels')){
        this.getRequest('/employee/basic/joblevels').then(resp=>{
          if(resp){
            this.jobLevels = resp;
            window.sessionStorage.setItem('jobLevels',JSON.stringify(resp))
          }
        })
      }else{
        this.jobLevels = JSON.parse(window.sessionStorage.getItem('jobLevels'))
      }
      if(!window.sessionStorage.getItem('politicsStatus')){
        this.getRequest('/employee/basic/politics').then(resp=>{
          if(resp){
            this.politicsStatus = resp;
            window.sessionStorage.setItem('politicsStatus',JSON.stringify(resp))
          }
        })
      }else{
        this.politicsStatus = JSON.parse(window.sessionStorage.getItem('politicsStatus'))
      }
      if(!window.sessionStorage.getItem('allDeps')){
        this.getRequest('/employee/basic/deps').then(resp=>{
          if(resp){
            this.allDeps = resp;
            window.sessionStorage.setItem('allDeps',JSON.stringify(resp))
          }
        })
      }else{
        this.allDeps = JSON.parse(window.sessionStorage.getItem('allDeps'))
      }
    },
    showDialog(){
      this.title = '添加员工'
      this.emp = {
        id: null,
        name: "",
        gender: "",
        birthday: "",
        idCard: "",
        wedlock: "",
        nationId: null,
        nativePlace: "",
        politicId: null,
        email: "",
        phone: "",
        address: "",
        departmentId: null,
        jobLevelId: null,
        posId: null,
        engageForm: "",
        tiptopDegree: "",
        specialty: "",
        school: "",
        beginDate: "",
        workState: "在职",
        workID: "",
        contractTerm: null,
        conversionTime: "",
        notWorkDate: null,
        beginContract: "",
        endContract: "",
        workAge: null,
        salaryId: null,
        nation: {
          id: null,
          name: ""
        },
        politicsStatus: {
          id: null,
          name: ""
        },
        department: {
          id: null,
          name: "",
          parentId: null,
          depPath: null,
          enabled: null,
          isParent: null,
          children: null,
          result: null
        },
        joblevel: {
          id: null,
          name: "",
          titleLevel: null,
          createDate: null,
          enabled: null
        },
        position: {
          id: null,
          name: "",
          createDate: null,
          enabled: null
        },
        salary: null
      }
      this.initPositions()
      this.getMaxWorkId()
      this.inputDepName = ""
      this.dialogVisible = true
    },
    search(){
      this.initEmps()
    },
    sizeChange(size){
      this.size = size
      this.initEmps()
    },
    currentChange(currentPage){
      this.currentPage = currentPage
      this.initEmps()
    },
    initEmps(){
      this.loading = true
      let url = '/employee/basic?currentPage='+this.currentPage+"&size="+this.size+"&name="+this.empName
      this.getRequest(url).then(resp=>{
        this.loading = false
        this.emps = resp.data
        this.total = resp.total
      })
    }
  },
  mounted(){
    this.initEmps()
    this.initData()
  }
}
</script>

<style>

</style>